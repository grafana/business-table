import { DataFrame, FieldType } from '@grafana/data';
import { Combobox, type ComboboxOption, SelectBaseProps } from '@grafana/ui';
import React, { useMemo } from 'react';

import { TEST_IDS } from '@/constants';
import { FieldSource } from '@/types';
import { getFieldKey } from '@/utils';

import { getFieldOption } from './utils';

/**
 * Properties
 */
interface Props extends Omit<SelectBaseProps<string>, 'value' | 'onChange' | 'options' | 'width'> {
  /**
   * Value
   *
   * @type {FieldSource}
   */
  value?: FieldSource;

  /**
   * Change
   */
  onChange: (value: FieldSource | undefined) => void;

  /**
   * Data
   *
   * @type {DataFrame[]}
   */
  data: DataFrame[];

  /**
   * Filter Field
   *
   * @type {FieldSource[]}
   */
  alreadySelectedFields?: FieldSource[];

  /**
   * Include Types
   *
   * @type {FieldType[]}
   */
  includeTypes?: FieldType[];
}

interface FieldOption {
  label?: string;
  icon?: string;
  value: string;
  source: string | number;
  fieldName: string;
}

/**
 * Field Picker
 */
export const FieldPicker: React.FC<Props> = ({
  data,
  value,
  onChange,
  alreadySelectedFields,
  includeTypes,
  inputId,
  id,
  placeholder,
  autoFocus,
  disabled,
  isLoading,
  invalid,
  onBlur,
  isClearable = false,
  'aria-label': ariaLabel,
  'data-testid': dataTestid,
}) => {
  /**
   * Available Field Options
   */
  const availableFieldOptions = useMemo(() => {
    const filterField = alreadySelectedFields?.[0];

    /**
     * Take fields within selected frame
     */
    if (filterField) {
      const dataFrameIndex = data.findIndex((dataFrame, index) =>
        dataFrame.refId === undefined ? index === filterField.source : dataFrame.refId === filterField.source
      );
      const dataFrame = data[dataFrameIndex];

      if (dataFrame) {
        const source = dataFrame.refId || dataFrameIndex;

        return (
          dataFrame.fields
            .filter((field) => (includeTypes ? includeTypes.includes(field.type) : true))
            .map((field) => getFieldOption(field, source))
            .filter((option) => !alreadySelectedFields.some((item) => item.name === option.fieldName)) || []
        ) as FieldOption[];
      }
    }

    return data.reduce((acc: FieldOption[], dataFrame, index) => {
      return acc.concat(
        dataFrame.fields
          .filter((field) => (includeTypes ? includeTypes.includes(field.type) : true))
          .map((field) => {
            const source = dataFrame.refId || index;

            return getFieldOption(field, source);
          })
      );
    }, [] as FieldOption[]);
  }, [alreadySelectedFields, data, includeTypes]);

  /**
   * Select Value
   */
  const selectValue = useMemo(() => {
    if (value) {
      return getFieldKey(value);
    }

    return null;
  }, [value]);

  const onChangeCombobox = (event: ComboboxOption<string> | null) => {
    const selectedOption = availableFieldOptions.find((option) => option.value === event?.value);

    onChange(
      selectedOption
        ? {
            source: selectedOption.source,
            name: selectedOption.fieldName,
          }
        : undefined
    );
  };

  if (isClearable) {
    return (
      <Combobox
        id={id ?? inputId ?? 'config-new-column'}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        loading={isLoading}
        invalid={invalid}
        onBlur={onBlur}
        isClearable={true}
        aria-label={ariaLabel}
        data-testid={dataTestid}
        options={availableFieldOptions}
        value={selectValue}
        onChange={onChangeCombobox}
        {...TEST_IDS.fieldPicker.root.apply()}
      />
    );
  }

  return (
    <Combobox
      id={id ?? inputId ?? 'config-new-column'}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
      loading={isLoading}
      invalid={invalid}
      onBlur={onBlur}
      aria-label={ariaLabel}
      data-testid={dataTestid}
      options={availableFieldOptions}
      value={selectValue}
      onChange={onChangeCombobox}
      {...TEST_IDS.fieldPicker.root.apply()}
    />
  );
};
