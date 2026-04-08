import { CodeEditor, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

import React, { useCallback, useEffect, useState } from 'react';

/**
 * Line height in pixels
 */
const LINE_HEIGHT = 18;

/**
 * Default height bounds
 */
const DEFAULT_MIN_HEIGHT = 200;
const DEFAULT_MAX_HEIGHT = 1000;

/**
 * Calculate height from content
 */
const calculateHeight = (value: string, minHeight?: number, maxHeight?: number): number => {
  const contentHeight = value.split('\n').length * LINE_HEIGHT;
  const min = minHeight || DEFAULT_MIN_HEIGHT;
  const max = maxHeight || DEFAULT_MAX_HEIGHT;

  if (contentHeight < min) {
    return min;
  }

  if (contentHeight > max) {
    return max;
  }

  return contentHeight;
};

/**
 * Styles
 */
const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css`
    width: 100%;
  `,
});

/**
 * Properties
 */
type Props = React.ComponentProps<typeof CodeEditor> & {
  /**
   * Min Height
   *
   * @type {number}
   */
  minHeight?: number;

  /**
   * Max Height
   *
   * @type {number}
   */
  maxHeight?: number;

  /**
   * Should Escape Value
   *
   * @type {boolean}
   */
  isEscaping?: boolean;
};

/**
 * Autosize Code Editor
 */
export const AutosizeCodeEditor: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  minHeight,
  maxHeight,
  height,
  onEditorDidMount,
  isEscaping = false,
  ...rest
}) => {
  const styles = useStyles2(getStyles);
  const [computedHeight, setComputedHeight] = useState(calculateHeight(value, minHeight, maxHeight));

  /**
   * Handle Editor Mount
   */
  const handleEditorDidMount = useCallback(
    (editor: unknown, monaco: unknown) => {
      if (isEscaping && editor && typeof editor === 'object' && 'getModel' in editor) {
        const model = (editor as { getModel: () => { setEOL: (eol: number) => void } | null }).getModel();
        if (
          model &&
          monaco &&
          typeof monaco === 'object' &&
          'editor' in monaco &&
          typeof (monaco as { editor: { EndOfLineSequence: { LF: number } } }).editor === 'object'
        ) {
          model.setEOL(
            (monaco as { editor: { EndOfLineSequence: { LF: number } } }).editor.EndOfLineSequence.LF
          );
        }
      }
      onEditorDidMount?.(editor as Parameters<NonNullable<typeof onEditorDidMount>>[0], monaco as Parameters<NonNullable<typeof onEditorDidMount>>[1]);
    },
    [isEscaping, onEditorDidMount]
  );

  /**
   * Handle Change
   */
  const handleChange = useCallback(
    (code: string) => {
      const result = isEscaping ? code.replaceAll('\n', '\\n') : code;
      onChange?.(result);
      setComputedHeight(calculateHeight(code, minHeight, maxHeight));
    },
    [maxHeight, minHeight, onChange, isEscaping]
  );

  /**
   * Handle Blur
   */
  const handleBlur = useCallback(
    (code: string) => {
      const result = isEscaping ? code.replaceAll('\n', '\\n') : code;
      onBlur?.(result);
    },
    [onBlur, isEscaping]
  );

  /**
   * Sync height on value change
   */
  useEffect(() => {
    setComputedHeight(calculateHeight(value, minHeight, maxHeight));
  }, [value, minHeight, maxHeight]);

  return (
    <div className={styles.wrapper}>
      <CodeEditor
        value={isEscaping ? value.replaceAll('\\n', '\n') : value}
        height={height ?? computedHeight}
        onEditorDidMount={handleEditorDidMount}
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      />
    </div>
  );
};
