import { DataFrame, Field } from '@grafana/data';

import { FieldSource } from '@/types';

/**
 * Get Field Key
 */
export const getFieldKey = (field: FieldSource): string => `${field.source}:${field.name}`;

/**
 * Reorder
 * @param list
 * @param startIndex
 * @param endIndex
 */
export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Trailing label set Grafana appends to a series name, for example `usage {host="web-1"}`.
 */
const FIELD_LABEL_SUFFIX = /\s*\{[^}]*\}\s*$/;

/**
 * Field name without a trailing label set.
 * Influx and other series-oriented sources bake the current variable value into that suffix,
 * so an exact name match stays stuck on the value selected when the column was configured.
 */
export const getStableFieldName = (name: string): string => name.replace(FIELD_LABEL_SUFFIX, '').trim();

/**
 * Filter field by source
 * Frame should be already filtered
 * @param field
 * @param fieldSource
 */
export const filterFieldBySource = (field: Field, fieldSource: FieldSource): boolean => {
  return field.name === fieldSource.name;
};

/**
 * Exact name match, or the same name once the variable-dependent label suffix is removed.
 */
const matchFieldName = (field: Field, fieldSource: FieldSource): 'exact' | 'stable' | undefined => {
  if (field.name === fieldSource.name) {
    return 'exact';
  }

  const stableField = getStableFieldName(field.name);
  const stableSource = getStableFieldName(fieldSource.name);

  if (stableSource.length > 0 && stableField === stableSource) {
    return 'stable';
  }

  return undefined;
};

/**
 * Frames that can hold the configured columns.
 * A numeric source is the frame index saved when the frame had no refId.
 * A string source is the query refId. Every frame of that query is a candidate,
 * because Influx returns one frame per series and the first one changes with the variable.
 */
const getCandidateFrames = (series: DataFrame[], fieldSource: FieldSource): DataFrame[] => {
  if (typeof fieldSource.source === 'number') {
    const indexed = series[fieldSource.source];

    if (!indexed) {
      return series.length === 1 ? series : [];
    }

    if (!indexed.refId) {
      return [indexed];
    }

    const siblings = series.filter((frame) => frame.refId === indexed.refId && frame !== indexed);

    return [indexed, ...siblings];
  }

  return series.filter((frame) => frame.refId === fieldSource.source);
};

/**
 * How well a frame still contains the configured columns.
 * Exact names outrank names that only match after stripping the label suffix.
 */
const scoreFrame = (frame: DataFrame, fieldSources: FieldSource[]): number => {
  return fieldSources.reduce((score, fieldSource) => {
    const match = frame.fields.reduce<'exact' | 'stable' | undefined>((found, field) => {
      if (found === 'exact') {
        return found;
      }

      const next = matchFieldName(field, fieldSource);

      if (next === 'exact') {
        return 'exact';
      }

      if (next === 'stable' && !found) {
        return 'stable';
      }

      return found;
    }, undefined);

    if (match === 'exact') {
      return score + 2;
    }

    if (match === 'stable') {
      return score + 1;
    }

    return score;
  }, 0);
};

/**
 * Find a field inside one frame.
 * Already used fields are skipped so two columns that share a stable name stay distinct.
 */
export const findFieldInFrame = (frame: DataFrame, fieldSource: FieldSource, used?: Set<Field>): Field | undefined => {
  const exact = frame.fields.find((field) => !used?.has(field) && field.name === fieldSource.name);

  if (exact) {
    return exact;
  }

  const stableSource = getStableFieldName(fieldSource.name);

  if (!stableSource) {
    return undefined;
  }

  return frame.fields.find((field) => !used?.has(field) && getStableFieldName(field.name) === stableSource);
};

/**
 * Pick the frame for these columns and the field each column should read.
 * When a dashboard variable renames every series, leftover fields fill the unmatched
 * columns only if the counts are equal, so an unrelated extra column is not guessed.
 */
export const resolveTableFields = (
  series: DataFrame[],
  fieldSources: FieldSource[]
): { frame: DataFrame | undefined; fields: Array<Field | undefined> } => {
  if (!fieldSources.length) {
    return {
      frame: undefined,
      fields: [],
    };
  }

  let candidates = getCandidateFrames(series, fieldSources[0]);
  const matchedSavedSource = candidates.length > 0;

  /**
   * seriesToRows builds its refId from every input series, for example
   * `seriesToRows-A-A-A` while All is selected. A dashboard variable changes
   * that count, so the saved source is gone. The column names are still on the
   * new frame. Search every frame, and ignore the result when none of the
   * configured names are there.
   */
  if (!candidates.length) {
    candidates = series;
  }

  if (!candidates.length) {
    return {
      frame: undefined,
      fields: [],
    };
  }

  let frame = candidates[0];
  let bestScore = -1;

  candidates.forEach((candidate) => {
    const score = scoreFrame(candidate, fieldSources);

    if (score > bestScore) {
      frame = candidate;
      bestScore = score;
    }
  });

  if (!matchedSavedSource && bestScore <= 0) {
    return {
      frame: undefined,
      fields: fieldSources.map(() => undefined),
    };
  }

  /**
   * Exact matches may be shared. Nested columns often read the same field twice.
   */
  const fields: Array<Field | undefined> = fieldSources.map((fieldSource) =>
    frame.fields.find((field) => field.name === fieldSource.name)
  );

  /**
   * Stable-name matches fill columns the variable renamed.
   * An unused field is preferred so two series with the same base name stay apart.
   */
  fieldSources.forEach((fieldSource, index) => {
    if (fields[index]) {
      return;
    }

    const stableSource = getStableFieldName(fieldSource.name);

    if (!stableSource) {
      return;
    }

    const matches = frame.fields.filter((field) => getStableFieldName(field.name) === stableSource);
    const taken = new Set(fields.filter((field): field is Field => !!field));
    const unused = matches.find((field) => !taken.has(field));

    fields[index] = unused ?? matches[0];
  });

  const unmatchedIndexes = fields.flatMap((field, index) => (field ? [] : [index]));
  const taken = new Set(fields.filter((field): field is Field => !!field));
  const leftovers = frame.fields.filter((field) => !taken.has(field));

  if (unmatchedIndexes.length > 0 && unmatchedIndexes.length === leftovers.length) {
    unmatchedIndexes.forEach((fieldIndex, leftoverIndex) => {
      fields[fieldIndex] = leftovers[leftoverIndex];
    });
  }

  return {
    frame,
    fields,
  };
};

/**
 * Get field by source
 */
export const getFieldBySource = (series: DataFrame[], fieldSource: FieldSource): Field | undefined => {
  const frame = getFrameBySource(series, fieldSource);

  if (frame) {
    const field = findFieldInFrame(frame, fieldSource);

    if (field) {
      return field;
    }
  }

  for (const candidate of series) {
    const field = findFieldInFrame(candidate, fieldSource);

    if (field) {
      return field;
    }
  }

  return undefined;
};

/**
 * Get frame by source
 */
export const getFrameBySource = (series: DataFrame[], fieldSource: FieldSource): DataFrame | undefined => {
  return resolveTableFields(series, [fieldSource]).frame;
};

/**
 * Get Value Index
 */
export const getValueIndex = (field: Field, value: unknown) => {
  return field.values.findIndex((currentValue) => currentValue === value);
};
