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
 * Filter field by source
 * Frame should be already filtered
 * @param frame
 * @param field
 * @param fieldSource
 */
export const filterFieldBySource = (field: Field, fieldSource: FieldSource): boolean => {
  return field.name === fieldSource.name;
};

/**
 * Get field by source
 */
export const getFieldBySource = (series: DataFrame[], fieldSource: FieldSource): Field | undefined => {
  for (let i = 0; i < series.length; i++) {
    const frame = series[i];
    const field = frame.fields.find((f) => filterFieldBySource(f, fieldSource));
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
  if (typeof fieldSource.source === 'number') {
    return series[fieldSource.source];
  }

  return series.find((frame) => frame.refId === fieldSource.source);
};

/**
 * Get Value Index
 */
export const getValueIndex = (field: Field, value: unknown) => {
  return field.values.findIndex((currentValue) => currentValue === value);
};
