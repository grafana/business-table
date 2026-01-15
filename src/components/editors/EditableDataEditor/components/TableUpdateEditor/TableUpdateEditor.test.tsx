import { fireEvent, render, screen } from '@testing-library/react';
import { createSelector, getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { TEST_IDS } from '@/constants';
import { ColumnEditorType, PermissionMode } from '@/types';
import {
  createColumnConfig,
  createColumnEditConfig,
  createPermissionConfig,
  createTableConfig,
  createTableRequestConfig,
} from '@/utils';

import { TableUpdateEditor } from './TableUpdateEditor';

/**
 * Props
 */
type Props = React.ComponentProps<typeof TableUpdateEditor>;

/**
 * In Test Ids
 */
const inTestIds = {
  requestEditor: createSelector('data-testid request-editor'),
  permissionEditor: createSelector('data-testid permission-editor'),
};

/**
 * Mock Request Editor
 */
jest.mock('@/components/editors/RequestEditor', () => ({
  RequestEditor: ({ onChange, value }: any) => (
    <input {...inTestIds.requestEditor.apply()} onChange={() => onChange(value)} />
  ),
}));

/**
 * Mock Permission Editor
 */
jest.mock('@/components/editors/PermissionEditor', () => ({
  PermissionEditor: ({ onChange, value }: any) => (
    <input {...inTestIds.permissionEditor.apply()} onChange={() => onChange(value)} />
  ),
}));

describe('TableUpdateEditor', () => {
  /**
   * Defaults
   */
  const onChange = jest.fn();
  const defaultField = { source: 'A', name: 'hello' };
  const defaultName = 'A:hello';

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors({ ...TEST_IDS.tableUpdateEditor, ...inTestIds });
  const selectors = getSelectors(screen);

  /**
   * Get Component
   */
  const getComponent = (props: Partial<Props>) => {
    return <TableUpdateEditor onChange={onChange} data={[]} {...(props as any)} />;
  };

  it('Should show message if no items', () => {
    render(getComponent({ value: createTableConfig({ items: [] }) }));

    expect(selectors.noColumnsMessage()).toBeInTheDocument();
  });

  it('Should not show message if items present', () => {
    render(getComponent({ value: createTableConfig({ items: [createColumnConfig({})] }) }));

    expect(selectors.noColumnsMessage(true)).not.toBeInTheDocument();
  });

  describe('Update Request', () => {
    const openSection = () => {
      expect(screen.getByText('Update Request')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Update Request/ }));

      expect(selectors.updateSectionContent()).toBeInTheDocument();
    };

    it('Should allow to change request', () => {
      render(
        getComponent({
          value: createTableConfig({
            items: [
              createColumnConfig({
                edit: createColumnEditConfig({
                  enabled: true,
                }),
              }),
            ],
            update: createTableRequestConfig({
              datasource: 'postgres',
            }),
          }),
        })
      );

      openSection();

      expect(selectors.requestEditor()).toBeInTheDocument();

      fireEvent.change(selectors.requestEditor(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          update: createTableRequestConfig({
            datasource: 'postgres',
          }),
        })
      );
    });
  });

  describe('Edit Settings', () => {
    const openSettings = (name: string, fieldName: string) => {
      expect(screen.getByText(fieldName)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: new RegExp(fieldName) }));

      expect(selectors.columnContent(false, name)).toBeInTheDocument();
    };

    it('Should allow to update permission', () => {
      render(
        getComponent({
          value: createTableConfig({
            items: [
              createColumnConfig({
                field: defaultField,
                edit: createColumnEditConfig({
                  enabled: true,
                  permission: createPermissionConfig({
                    mode: PermissionMode.QUERY,
                  }),
                }),
              }),
            ],
          }),
        })
      );

      openSettings(defaultName, defaultField.name);

      expect(selectors.permissionEditor()).toBeInTheDocument();

      fireEvent.change(selectors.permissionEditor(), { target: { value: 'hello' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            expect.objectContaining({
              edit: expect.objectContaining({
                permission: createPermissionConfig({
                  mode: PermissionMode.QUERY,
                }),
              }),
            }),
          ],
        })
      );
    });

    it('Should allow to enable edit in header', () => {
      render(
        getComponent({
          value: createTableConfig({
            items: [
              createColumnConfig({
                field: defaultField,
                edit: createColumnEditConfig({
                  enabled: false,
                }),
              }),
              createColumnConfig({
                field: { source: 'B', name: '123' },
              }),
            ],
          }),
        })
      );

      expect(selectors.fieldEditQuickEnabled(false, defaultName)).toBeInTheDocument();
      expect(selectors.columnContent(true, defaultName)).not.toBeInTheDocument();

      fireEvent.click(selectors.fieldEditQuickEnabled(false, defaultName));

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            expect.objectContaining({
              edit: expect.objectContaining({
                enabled: true,
              }),
            }),
            createColumnConfig({
              field: { source: 'B', name: '123' },
            }),
          ],
        })
      );
    });

    it('Should allow to set editor config', () => {
      render(
        getComponent({
          value: createTableConfig({
            items: [
              createColumnConfig({
                field: defaultField,
                edit: createColumnEditConfig({
                  enabled: true,
                  editor: {
                    type: ColumnEditorType.NUMBER,
                  },
                }),
              }),
            ],
          }),
        })
      );

      openSettings(defaultName, defaultField.name);

      const editorConfigSelectors = getJestSelectors(TEST_IDS.editableColumnEditor)(screen);
      expect(editorConfigSelectors.fieldNumberMin()).toBeInTheDocument();

      fireEvent.change(editorConfigSelectors.fieldNumberMin(), { target: { value: 10 } });
      fireEvent.blur(editorConfigSelectors.fieldNumberMin(), { target: { value: 10 } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            expect.objectContaining({
              edit: expect.objectContaining({
                editor: {
                  type: ColumnEditorType.NUMBER,
                  min: 10,
                },
              }),
            }),
          ],
        })
      );
    });
  });
});
