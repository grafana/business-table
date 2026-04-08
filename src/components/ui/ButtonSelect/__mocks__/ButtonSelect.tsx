import { SelectableValue } from '@grafana/data';
import React from 'react';

type OptionValue = SelectableValue<unknown>;

interface MockProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  onChange: (item: OptionValue | undefined) => void;
  options: OptionValue[];
  value?: OptionValue | string | number;
}

const flattenOptions = (options: OptionValue[]) =>
  options.reduce<OptionValue[]>(
    (acc, option) => acc.concat(Array.isArray(option.options) ? option.options : option),
    []
  );

export const ButtonSelect = ({ onChange, options, value, ...restProps }: MockProps) => {
  const selectedValue = typeof value === 'object' && value !== null ? value.value : value;

  return (
    <select
      onChange={(event) => {
        const plainOptions = flattenOptions(options);
        const option = plainOptions.find((item) => String(item.value) === event.target.value);

        onChange(option);
      }}
      value={selectedValue !== undefined ? String(selectedValue) : undefined}
      {...restProps}
    >
      {flattenOptions(options).map((option, index) => (
        <option key={index} value={String(option.value)}>
          {option.label ?? String(option.value)}
        </option>
      ))}
    </select>
  );
};
