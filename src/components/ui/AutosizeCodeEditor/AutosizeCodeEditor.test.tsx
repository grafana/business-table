import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { AutosizeCodeEditor } from './AutosizeCodeEditor';

/**
 * Mock @grafana/ui CodeEditor with a plain textarea that exposes props
 * as data attributes so tests can assert them.
 */
jest.mock('@grafana/ui', () => {
  const actual = jest.requireActual('@grafana/ui');
  return {
    ...actual,
    CodeEditor: ({ value, onChange, onBlur, onEditorDidMount, height }: any) => (
      <textarea
        data-testid="code-editor"
        data-height={String(height)}
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.value)}
        onBlur={(e) => onBlur?.(e.currentTarget.value)}
        ref={() => {
          /* onEditorDidMount invoked in a separate test via a spy */
          void onEditorDidMount;
        }}
      />
    ),
  };
});

const LINE_HEIGHT = 18;

describe('AutosizeCodeEditor', () => {
  const getEditor = () => screen.getByTestId('code-editor') as HTMLTextAreaElement;

  describe('height calculation', () => {
    it('clamps to default min when content is short', () => {
      render(<AutosizeCodeEditor value="one line" language="json" />);
      // DEFAULT_MIN_HEIGHT = 200
      expect(getEditor().getAttribute('data-height')).toBe('200');
    });

    it('uses content height when between min and max', () => {
      const value = Array.from({ length: 20 }).fill('line').join('\n');
      render(<AutosizeCodeEditor value={value} language="json" minHeight={50} maxHeight={1000} />);
      expect(getEditor().getAttribute('data-height')).toBe(String(20 * LINE_HEIGHT));
    });

    it('clamps to max when content is tall', () => {
      const value = Array.from({ length: 100 }).fill('line').join('\n');
      render(<AutosizeCodeEditor value={value} language="json" maxHeight={300} />);
      expect(getEditor().getAttribute('data-height')).toBe('300');
    });

    it('honors explicit height prop over computed', () => {
      render(<AutosizeCodeEditor value="x" language="json" height={500} />);
      expect(getEditor().getAttribute('data-height')).toBe('500');
    });

    it('recomputes on value change', () => {
      const { rerender } = render(
        <AutosizeCodeEditor value="one line" language="json" minHeight={50} />
      );
      expect(getEditor().getAttribute('data-height')).toBe('50');

      const tall = Array.from({ length: 10 }).fill('line').join('\n');
      rerender(<AutosizeCodeEditor value={tall} language="json" minHeight={50} />);
      expect(getEditor().getAttribute('data-height')).toBe(String(10 * LINE_HEIGHT));
    });
  });

  describe('isEscaping', () => {
    it('unescapes \\n -> newline on input display', () => {
      render(<AutosizeCodeEditor value={'a\\nb'} language="json" isEscaping />);
      expect(getEditor().value).toBe('a\nb');
    });

    it('re-escapes newlines on change', () => {
      const onChange = jest.fn();
      render(<AutosizeCodeEditor value="" language="json" isEscaping onChange={onChange} />);
      fireEvent.change(getEditor(), { target: { value: 'line1\nline2' } });
      expect(onChange).toHaveBeenCalledWith('line1\\nline2');
    });

    it('re-escapes newlines on blur', () => {
      const onBlur = jest.fn();
      render(<AutosizeCodeEditor value="" language="json" isEscaping onBlur={onBlur} />);
      fireEvent.blur(getEditor(), { target: { value: 'a\nb' } });
      expect(onBlur).toHaveBeenCalledWith('a\\nb');
    });

    it('does not transform when isEscaping is false', () => {
      const onChange = jest.fn();
      render(<AutosizeCodeEditor value={'x\\ny'} language="json" onChange={onChange} />);
      expect(getEditor().value).toBe('x\\ny');

      fireEvent.change(getEditor(), { target: { value: 'p\nq' } });
      expect(onChange).toHaveBeenCalledWith('p\nq');
    });
  });
});
