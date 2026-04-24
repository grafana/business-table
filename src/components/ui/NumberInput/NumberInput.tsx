import { Input } from '@grafana/ui';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Snap to nearest step
 */
const snapToStep = (value: number, steps: number[]): number => {
  if (steps.length === 0) {
    return value;
  }

  let i = 0;
  while (i < steps.length) {
    if (value <= steps[i]) {
      if (value === steps[i]) {
        return value;
      }
      const lower = steps[Math.max(i - 1, 0)];
      const upper = steps[i];
      return value - lower < upper - value ? lower : upper;
    }
    i += 1;
  }

  return steps[steps.length - 1];
};

/**
 * Properties
 */
interface Props extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  /**
   * On Change
   */
  onChange?: (value: number) => void;

  /**
   * Value
   *
   * @type {number | string}
   */
  value: number | string;

  /**
   * Step
   *
   * @type {number}
   */
  step?: number;

  /**
   * Steps
   *
   * @type {number[]}
   */
  steps?: number[];

  /**
   * Min
   *
   * @type {number}
   */
  min?: number;

  /**
   * Max
   *
   * @type {number}
   */
  max?: number;
}

/**
 * Number Input
 */
export const NumberInput: React.FC<Props> = ({ value, onChange, min, max, step, steps, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDirty = useRef(false);
  const [localValue, setLocalValue] = useState(value?.toString() ?? '0');

  /**
   * Handle Change
   */
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.currentTarget.value);
    isDirty.current = true;
  }, []);

  /**
   * Handle Blur
   */
  const handleBlur = useCallback(() => {
    if (!isDirty.current) {
      return;
    }

    let num = Number(localValue);

    if (Number.isNaN(num)) {
      num = 0;
    }

    if (step !== undefined) {
      const base = min ?? 0;
      num = base + Math.round((num - base) / step) * step;
    }

    if (max !== undefined && num > max) {
      num = max;
    } else if (min !== undefined && num < min) {
      num = min;
    }

    if (steps !== undefined) {
      num = snapToStep(num, steps);
    }

    onChange?.(num);
    setLocalValue(num.toString());
    isDirty.current = false;
  }, [localValue, max, min, onChange, step, steps]);

  /**
   * Handle Key Down
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        inputRef.current?.blur();
      }
    },
    []
  );

  /**
   * Sync external value — skip while user is typing to avoid clobbering input
   */
  useEffect(() => {
    if (isDirty.current) {
      return;
    }
    setLocalValue(value?.toString() ?? '0');
  }, [value]);

  return (
    <Input
      ref={inputRef}
      {...rest}
      type="text"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};
