import { getTemplateSrv } from '@grafana/runtime';
import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@/utils/test-selectors';
import React from 'react';

import { TEST_IDS } from '@/constants';
import { ColumnFilterMode, ColumnFilterType, ColumnFilterValue } from '@/types';
import { createVariable, getFilterWithNewType, getVariableColumnFilters } from '@/utils';

import { FilterFacetedList } from './FilterFacetedList';

type Props = React.ComponentProps<typeof FilterFacetedList>;

describe('FilterFacetedList', () => {
  /**
   * Change
   */
  const onChange = jest.fn();

  /**
   * Option Names
   */
  const optionsNameMap = {
    active: 'active',
    pending: 'pending',
  };

  /**
   * Create Value
   * @param params
   */
  const createValue = (params: { value?: string[] } = {}): ColumnFilterValue & { type: ColumnFilterType.FACETED } =>
    ({
      ...getFilterWithNewType(ColumnFilterType.FACETED),
      ...params,
    }) as never;

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.filterFacetedList);
  const selectors = getSelectors(screen);

  /**
   * Get Component
   */
  const getComponent = (props: Partial<Props>) => {
    return <FilterFacetedList onChange={onChange} value={createValue()} {...(props as any)} />;
  };

  it('Should render list', () => {
    render(
      getComponent({
        header: {
          column: {
            columnDef: {},
            getFacetedUniqueValues: () => new Map(),
          },
        } as any,
      })
    );

    expect(selectors.root()).toBeInTheDocument();
  });

  describe('client mode', () => {
    const uniqueValuesMap = new Map();
    uniqueValuesMap.set(optionsNameMap.active, 1);
    uniqueValuesMap.set(optionsNameMap.pending, 1);

    it('Should allow to select value', () => {
      render(
        getComponent({
          header: {
            column: {
              columnDef: {
                meta: {
                  filterMode: ColumnFilterMode.CLIENT,
                },
              },
              getFacetedUniqueValues: () => uniqueValuesMap,
            },
          } as any,
          value: createValue({ value: [optionsNameMap.pending] }),
        })
      );

      expect(selectors.root()).toBeInTheDocument();

      expect(selectors.option(false, optionsNameMap.active)).toBeInTheDocument();
      expect(selectors.option(false, optionsNameMap.active)).not.toBeChecked();

      fireEvent.click(selectors.option(false, optionsNameMap.active));

      expect(onChange).toHaveBeenCalledWith(createValue({ value: [optionsNameMap.pending, optionsNameMap.active] }));
    });

    it('Should allow to deselect value', () => {
      render(
        getComponent({
          header: {
            column: {
              columnDef: {
                meta: {
                  filterMode: ColumnFilterMode.CLIENT,
                },
              },
              getFacetedUniqueValues: () => uniqueValuesMap,
            },
          } as any,
          value: createValue({ value: [optionsNameMap.active, optionsNameMap.pending] }),
        })
      );

      expect(selectors.root()).toBeInTheDocument();

      expect(selectors.option(false, optionsNameMap.pending)).toBeInTheDocument();
      expect(selectors.option(false, optionsNameMap.pending)).toBeChecked();

      fireEvent.click(selectors.option(false, optionsNameMap.pending));

      expect(onChange).toHaveBeenCalledWith(createValue({ value: [optionsNameMap.active] }));
    });

    it('Should allow to select all values', () => {
      render(
        getComponent({
          header: {
            column: {
              columnDef: {
                meta: {
                  filterMode: ColumnFilterMode.CLIENT,
                },
              },
              getFacetedUniqueValues: () => uniqueValuesMap,
            },
          } as any,
          value: createValue({ value: [] }),
        })
      );

      expect(selectors.root()).toBeInTheDocument();

      expect(selectors.allOption()).toBeInTheDocument();
      expect(selectors.allOption()).not.toBeChecked();

      fireEvent.click(selectors.allOption());

      expect(onChange).toHaveBeenCalledWith(createValue({ value: [optionsNameMap.active, optionsNameMap.pending] }));
    });

    it('Should allow to deselect all values', () => {
      render(
        getComponent({
          header: {
            column: {
              columnDef: {
                meta: {
                  filterMode: ColumnFilterMode.CLIENT,
                },
              },
              getFacetedUniqueValues: () => uniqueValuesMap,
            },
          } as any,
          value: createValue({ value: [optionsNameMap.active, optionsNameMap.pending] }),
        })
      );

      expect(selectors.root()).toBeInTheDocument();

      expect(selectors.allOption()).toBeInTheDocument();
      expect(selectors.allOption()).toBeChecked();

      fireEvent.click(selectors.allOption());

      expect(onChange).toHaveBeenCalledWith(createValue({ value: [] }));
    });
  });

  describe('query mode', () => {
    it('Should keep the client selection behavior when initialized from native All', () => {
      jest.mocked(getTemplateSrv().getVariables).mockReturnValue([
        createVariable({
          name: 'var1',
          type: 'query',
          multi: true,
          includeAll: true,
          current: { value: ['$__all'] },
          options: [
            { value: '$__all', text: 'All' },
            { value: 'active', text: 'Active' },
            { value: 'pending', text: 'Pending' },
          ],
        } as never),
      ]);
      const columnDef = {
        id: 'category',
        enableColumnFilter: true,
        meta: { filterMode: ColumnFilterMode.QUERY, filterVariableName: 'var1' },
      };
      const initialFilter = getVariableColumnFilters([columnDef as never])[0].value;
      const header = { column: { columnDef } } as any;
      const { rerender } = render(getComponent({ header, value: (initialFilter || createValue()) as never }));

      expect(selectors.allOption()).not.toBeChecked();
      expect(selectors.allOption()).not.toBePartiallyChecked();
      expect(selectors.option(false, 'active')).not.toBeChecked();
      fireEvent.click(selectors.allOption());
      expect(onChange).toHaveBeenLastCalledWith(createValue({ value: ['active', 'pending'] }));
      rerender(getComponent({ header, value: onChange.mock.lastCall![0] }));
      expect(selectors.allOption()).toBeChecked();
      fireEvent.click(selectors.option(false, 'active'));
      expect(onChange).toHaveBeenLastCalledWith(createValue({ value: ['pending'] }));
      rerender(getComponent({ header, value: onChange.mock.lastCall![0] }));
      expect(selectors.allOption()).toBePartiallyChecked();
      expect(selectors.option(false, 'pending')).toBeChecked();
      fireEvent.click(selectors.option(false, 'pending'));
      expect(onChange).toHaveBeenLastCalledWith(createValue());
    });

    it('Should allow to select variable option', () => {
      jest.mocked(getTemplateSrv().getVariables).mockReturnValue([
        createVariable({
          name: 'var1',
          type: 'custom',
          multi: true,
          options: [
            { value: optionsNameMap.active, label: '' },
            { value: optionsNameMap.pending, label: 'Pending' },
          ],
        } as any),
      ]);

      render(
        getComponent({
          header: {
            column: {
              columnDef: {
                meta: {
                  filterMode: ColumnFilterMode.QUERY,
                  filterVariableName: 'var1',
                },
              },
            },
          } as any,
          value: createValue({ value: [optionsNameMap.pending] }),
        })
      );

      expect(selectors.root()).toBeInTheDocument();

      expect(selectors.option(false, optionsNameMap.active)).toBeInTheDocument();
      expect(selectors.option(false, optionsNameMap.active)).not.toBeChecked();

      fireEvent.click(selectors.option(false, optionsNameMap.active));

      expect(onChange).toHaveBeenCalledWith(createValue({ value: [optionsNameMap.pending, optionsNameMap.active] }));
    });

    it('Should work if invalid variable', () => {
      jest.mocked(getTemplateSrv().getVariables).mockReturnValue([
        createVariable({
          name: 'var1',
          type: 'custom',
          multi: true,
        } as any),
      ]);

      render(
        getComponent({
          header: {
            column: {
              columnDef: {
                meta: {
                  filterMode: ColumnFilterMode.QUERY,
                  filterVariableName: 'var1',
                },
              },
            },
          } as any,
          value: createValue({ value: [optionsNameMap.pending] }),
        })
      );

      expect(selectors.root()).toBeInTheDocument();
    });
  });
});
