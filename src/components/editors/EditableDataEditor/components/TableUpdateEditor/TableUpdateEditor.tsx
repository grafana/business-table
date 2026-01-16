import { DataFrame } from '@grafana/data';
import { Alert, Collapse, InlineSwitch, Label, Tag, useStyles2 } from '@grafana/ui';
import React, { useCallback, useMemo, useState } from 'react';

import { CollapseTitle, EditableColumnEditor, FieldsGroup, PermissionEditor, RequestEditor } from '@/components';
import { TEST_IDS } from '@/constants';
import { CellType, ColumnConfig, TableConfig } from '@/types';
import { getFieldKey } from '@/utils';

import { getStyles } from './TableUpdateEditor.styles';

/**
 * Value
 */
type Value = TableConfig;

/**
 * Properties
 */
interface Props {
  /**
   * Value
   *
   * @type {Value}
   */
  value: Value;

  /**
   * Change
   */
  onChange: (value: Value) => void;

  /**
   * Data
   *
   * @type {DataFrame[]}
   */
  data: DataFrame[];
}

/**
 * Test Ids
 */
const testIds = TEST_IDS.tableUpdateEditor;

/**
 * Table Update Editor
 */
export const TableUpdateEditor: React.FC<Props> = ({ value, onChange, data }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Expanded State
   */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  /**
   * Change Item
   */
  const onChangeItem = useCallback(
    (updatedItem: ColumnConfig) => {
      onChange({
        ...value,
        items: value.items.map((item) =>
          getFieldKey(item.field) === getFieldKey(updatedItem.field) ? updatedItem : item
        ),
      });
    },
    [onChange, value]
  );

  /**
   * Is Editable Column
   */
  const isEditableColumn = useMemo(() => {
    return value.items.some((item) => item.edit.enabled);
  }, [value.items]);

  return (
    <>
      <Label>Columns</Label>
      <>
        {value.items.length > 0 ? (
          value.items.map((item) => (
            <div key={getFieldKey(item.field)} className={styles.column}>
              <Collapse
                label={
                  // can't set onClick on Switch since it's passed to the inner input element
                  <div onClick={(event) => event.stopPropagation()}>
                    <CollapseTitle>
                      {item.field.name}
                      <InlineSwitch
                        value={item.edit.enabled}
                        label="Editable"
                        transparent={true}
                        onChange={(event) => {
                          onChangeItem({
                            ...item,
                            edit: {
                              ...item.edit,
                              enabled: event.currentTarget.checked,
                            },
                          });

                          /**
                           * Toggle Expanded State
                           */
                          setExpanded({
                            ...expanded,
                            [getFieldKey(item.field)]: event.currentTarget.checked,
                          });
                        }}
                        disabled={item.type === CellType.NESTED_OBJECTS}
                        {...testIds.fieldEditQuickEnabled.apply(getFieldKey(item.field))}
                      />
                      {item.edit.enabled && <Tag name={item.edit.editor.type} />}
                    </CollapseTitle>
                  </div>
                }
                isOpen={expanded[getFieldKey(item.field)]}
                onToggle={(isOpen) => {
                  setExpanded({
                    ...expanded,
                    [getFieldKey(item.field)]: isOpen,
                  })

                  if (isOpen) {
                    onChangeItem({
                      ...item,
                      edit: {
                        ...item.edit,
                        enabled: isOpen,
                      },
                    });
                  }
                }}
              >
                <div data-testid={testIds.columnContent.selector(getFieldKey(item.field))}>
                  {item.edit.enabled && (
                    <>
                      <FieldsGroup label="Permission">
                        <PermissionEditor
                          data={data}
                          value={item.edit.permission}
                          onChange={(permission) => {
                            onChangeItem({
                              ...item,
                              edit: {
                                ...item.edit,
                                permission,
                              },
                            });
                          }}
                        />
                      </FieldsGroup>
                      <FieldsGroup label="Editor">
                        <EditableColumnEditor
                          value={item.edit.editor}
                          onChange={(editor) => {
                            onChangeItem({
                              ...item,
                              edit: {
                                ...item.edit,
                                editor,
                              },
                            });
                          }}
                          data={data}
                        />
                      </FieldsGroup>
                    </>
                  )}
                </div>
              </Collapse>
            </div>
          ))
        ) : (
          <Alert severity="info" title="No Columns" {...testIds.noColumnsMessage.apply()}>
            Please add at least one column for table.
          </Alert>
        )}
      </>
      {isEditableColumn && (
        <>
          <Label>Settings</Label>
          <Collapse
            label="Update Request"
            isOpen={expanded.update}
            onToggle={(isOpen) => {
              setExpanded({
                ...expanded,
                update: isOpen,
              });
            }}
          >
            <div data-testid={testIds.updateSectionContent.selector()}>
              <RequestEditor
                value={value.update}
                onChange={(update) => {
                  onChange({
                    ...value,
                    update,
                  });
                }}
                queryEditorDescription="Updated row is placed in variable `${payload}`"
              />
            </div>
          </Collapse>
        </>
      )}
    </>
  );
};
