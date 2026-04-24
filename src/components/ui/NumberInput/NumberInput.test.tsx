import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  const setup = (props: Partial<React.ComponentProps<typeof NumberInput>> = {}) => {
    const onChange = jest.fn();
    const result = render(<NumberInput value={0} onChange={onChange} {...props} />);
    return { onChange, input: screen.getByRole('textbox') as HTMLInputElement, ...result };
  };

  it('commits typed value on blur', () => {
    const { onChange, input } = setup();
    fireEvent.change(input, { target: { value: '42' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it('commits on Enter key', () => {
    const { onChange, input } = setup();
    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    // Enter triggers blur via inputRef.blur()
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('coerces NaN input to 0', () => {
    const { onChange, input } = setup();
    fireEvent.change(input, { target: { value: 'not-a-number' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('clamps to max', () => {
    const { onChange, input } = setup({ max: 10 });
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('clamps to min', () => {
    const { onChange, input } = setup({ min: 5 });
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(5);
  });

  describe('step snapping', () => {
    it('rounds to nearest step, not ceiling', () => {
      const { onChange, input } = setup({ step: 1, min: 0 });
      fireEvent.change(input, { target: { value: '5.1' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('rounds up when closer to upper step', () => {
      const { onChange, input } = setup({ step: 1, min: 0 });
      fireEvent.change(input, { target: { value: '5.6' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(6);
    });

    it('rounds half to even/up (Math.round behavior)', () => {
      const { onChange, input } = setup({ step: 10, min: 0 });
      fireEvent.change(input, { target: { value: '15' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(20);
    });
  });

  describe('external value sync', () => {
    it('syncs external value changes when not typing', () => {
      const { input, rerender } = setup({ value: 1 });
      expect(input.value).toBe('1');

      rerender(<NumberInput value={42} onChange={jest.fn()} />);
      expect(input.value).toBe('42');
    });

    it('does not overwrite in-progress typing when parent re-renders', () => {
      const { input, rerender } = setup({ value: 1 });

      // User starts typing
      fireEvent.change(input, { target: { value: '99' } });
      expect(input.value).toBe('99');

      // Parent re-renders with a different external value before user blurs
      rerender(<NumberInput value={5} onChange={jest.fn()} />);

      // In-progress input must be preserved
      expect(input.value).toBe('99');
    });

    it('resumes sync after blur resets dirty state', () => {
      const { onChange, input, rerender } = setup({ value: 1 });
      fireEvent.change(input, { target: { value: '99' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(99);

      // After blur, external changes apply again
      rerender(<NumberInput value={7} onChange={onChange} />);
      expect(input.value).toBe('7');
    });
  });
});
