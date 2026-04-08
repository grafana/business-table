import { StandardEditorProps } from '@grafana/data';
import { Collapse, InlineSwitch, useStyles2 } from '@grafana/ui';
import React, { useCallback, useState } from 'react';

import { CollapseTitle } from '@/components';
import { TEST_IDS } from '@/constants';
import { PanelOptions, TableConfig } from '@/types';

import { TableDeleteRowEditor } from './components';
import { getStyles } from './DeleteDataEditor.styles';

/**
 * Properties
 */
type Props = StandardEditorProps<TableConfig[], null, PanelOptions>;

/**
 * Test Ids
 */
export const testIds = TEST_IDS.deleteDataEditor;

/**
 * Add Data Editor
 */
export const DeleteDataEditor: React.FC<Props> = ({ context: { data }, onChange, value }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({});

  /**
   /**
   * Change Items
   */
  const onChangeValue = useCallback(
    (items: TableConfig[]) => {
      onChange(items);
    },
    [onChange]
  );

  /**
   * Toggle Item Expanded State
   */
  const onToggleItemExpandedState = useCallback((name: string) => {
    setCollapseState((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }, []);

  /**
   * Change Item
   */
  const onChangeItem = useCallback(
    (updatedItem: TableConfig) => {
      onChangeValue(value.map((item) => (item.name === updatedItem.name ? updatedItem : item)));
    },
    [value, onChangeValue]
  );

  return (
    <>
      {value.map((item) => (
        <div key={item.name} className={styles.item}>
          <Collapse
            label={
              // can't set onClick on Switch since it's passed to the inner input element
              <div onClick={(event) => event.stopPropagation()}>
                <CollapseTitle>
                  {item.name}
                  <InlineSwitch
                    transparent={true}
                    value={item.deleteRow.enabled}
                    onChange={(event) => {
                      onChangeItem({
                        ...item,
                        deleteRow: {
                          ...item.deleteRow,
                          enabled: event.currentTarget.checked,
                        },
                      });
                      setCollapseState({
                        ...collapseState,
                        [item.name]: event.currentTarget.checked,
                      });
                    }}
                    {...testIds.fieldItemEnabled.apply(item.name)}
                  />
                </CollapseTitle>
              </div>
            }
            isOpen={collapseState[item.name]}
            onToggle={(isOpen) => {
              onToggleItemExpandedState(item.name);

              if (isOpen) {
                onChangeItem({
                  ...item,
                  deleteRow: {
                    ...item.deleteRow,
                    enabled: isOpen,
                  },
                });
              }
            }}
          >
            <div data-testid={testIds.itemContent.selector(item.name)}>
              <TableDeleteRowEditor value={item} onChange={onChangeItem} data={data} />
            </div>
          </Collapse>
        </div>
      ))}
    </>
  );
};
