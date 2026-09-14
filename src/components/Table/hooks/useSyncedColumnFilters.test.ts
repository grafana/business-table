import { EventBusSrv } from '@grafana/data';
import { getTemplateSrv, RefreshEvent } from '@grafana/runtime';
import { act, renderHook } from '@testing-library/react';

import { ColumnFilterMode, ColumnFilterType } from '@/types';
import { getVariableColumnFilters, mergeColumnFilters } from '@/utils';
import { createColumnMeta, createVariable } from '@/utils/test';

import { useSyncedColumnFilters } from './useSyncedColumnFilters';

/**
 * Mock Utils
 */
jest.mock('@/utils', () => ({
  mergeColumnFilters: jest.fn(),
  getVariableColumnFilters: jest.fn(),
}));

describe('useSyncedColumnFilters', () => {
  /**
   * Event Bus
   */
  const eventBus = new EventBusSrv();

  it.each(['query', 'custom'])(
    'Should clear a %s All filter on refresh while preserving client filters',
    async (type) => {
      const actualUtils = jest.requireActual<typeof import('@/utils/table')>('@/utils/table');
      jest.mocked(getVariableColumnFilters).mockImplementation(actualUtils.getVariableColumnFilters);
      jest.mocked(mergeColumnFilters).mockImplementation(actualUtils.mergeColumnFilters);
      const variable = createVariable({
        name: 'category',
        type,
        multi: true,
        includeAll: true,
        current: { value: ['a'] },
      } as never);
      jest.mocked(getTemplateSrv().getVariables).mockReturnValue([variable]);
      const columns = [
        {
          id: 'category',
          enableColumnFilter: true,
          meta: createColumnMeta({ filterMode: ColumnFilterMode.QUERY, filterVariableName: 'category' }),
        },
      ];
      const clientFilter = {
        id: 'client',
        value: { type: ColumnFilterType.SEARCH, value: 'keep', caseSensitive: false },
      };
      const { result, unmount } = renderHook(() =>
        useSyncedColumnFilters({
          columns,
          eventBus,
          userFilterPreference: [],
          defaultFilters: [clientFilter],
        })
      );
      expect(result.current[0]).toContainEqual({
        id: 'category',
        value: { type: ColumnFilterType.FACETED, value: ['a'] },
      });
      jest
        .mocked(getTemplateSrv().getVariables)
        .mockReturnValue([
          createVariable({
            name: 'category',
            type,
            multi: true,
            includeAll: true,
            current: { value: ['$__all'] },
          } as never),
        ]);
      await act(async () => eventBus.publish(new RefreshEvent()));
      expect(result.current[0]).toEqual([clientFilter]);
      unmount();
      const reloaded = renderHook(() =>
        useSyncedColumnFilters({
          columns,
          eventBus,
          userFilterPreference: [],
          defaultFilters: [],
        })
      );
      expect(reloaded.result.current[0]).toEqual([]);
    }
  );

  it('Should set initial filter values', async () => {
    const filterFromVariable = {
      id: 'a',
      value: {
        type: ColumnFilterType.SEARCH,
        value: '1',
        caseSensitive: false,
      },
    };
    jest.mocked(getVariableColumnFilters).mockImplementation(() => [filterFromVariable] as any);
    jest.mocked(mergeColumnFilters).mockImplementation((current, updated) => current.concat(updated));

    const columns = [] as any;

    const { result } = await act(async () =>
      renderHook(() =>
        useSyncedColumnFilters({
          columns: columns as any,
          eventBus,
          userFilterPreference: [],
          defaultFilters: [],
        })
      )
    );

    expect(result.current[0]).toEqual([filterFromVariable]);
  });

  it('Should refresh filter values', async () => {
    const filterFromVariable = {
      id: 'a',
      value: {
        type: ColumnFilterType.SEARCH,
        value: '1',
        caseSensitive: false,
      },
    };
    jest.mocked(getVariableColumnFilters).mockImplementation(() => []);
    jest.mocked(mergeColumnFilters).mockImplementation((current, updated) => current.concat(updated));

    const columns = [] as any;

    const { result } = await act(async () =>
      renderHook(() =>
        useSyncedColumnFilters({
          columns: columns as any,
          eventBus,
          userFilterPreference: [],
          defaultFilters: [],
        })
      )
    );

    expect(result.current[0]).toEqual([]);

    jest.mocked(getVariableColumnFilters).mockImplementation(() => [filterFromVariable] as any);

    /**
     * Refresh
     */
    await act(async () => eventBus.publish(new RefreshEvent()));

    /**
     * Check filters updated
     */
    expect(result.current[0]).toEqual([filterFromVariable]);
  });

  it('Should allow to set updated filters', async () => {
    jest.mocked(getVariableColumnFilters).mockImplementation(() => []);
    jest.mocked(mergeColumnFilters).mockImplementation((current, updated) => current.concat(updated));

    const columns = [] as any;

    const { result } = await act(async () =>
      renderHook(() =>
        useSyncedColumnFilters({
          columns: columns as any,
          eventBus,
          userFilterPreference: [],
          defaultFilters: [],
        })
      )
    );

    expect(result.current[0]).toEqual([]);

    const newFilter = {
      id: 'a',
      value: {
        type: ColumnFilterType.SEARCH,
        value: '1',
        caseSensitive: false,
      },
    };

    /**
     * Update
     */
    await act(async () => result.current[1]([newFilter]));

    expect(result.current[0]).toEqual([newFilter]);
  });

  it('Should initialize filters from user preferences', async () => {
    const userFilterPreference = [
      {
        id: 'b',
        value: {
          type: ColumnFilterType.SEARCH,
          value: 'test',
          caseSensitive: false,
        },
      },
    ];

    jest.mocked(getVariableColumnFilters).mockImplementation(() => [] as any);
    jest.mocked(mergeColumnFilters).mockImplementation((current, updated) => current.concat(updated));

    const columns = [] as any;

    const { result } = await act(async () =>
      renderHook(() =>
        useSyncedColumnFilters({
          columns: columns as any,
          eventBus,
          userFilterPreference: userFilterPreference,
          defaultFilters: [],
        })
      )
    );

    expect(result.current[0]).toEqual(userFilterPreference);
  });

  it('Should default filters from default filters', async () => {
    const defaultFilters = [
      {
        id: 'b',
        value: {
          type: ColumnFilterType.SEARCH,
          value: 'test',
          caseSensitive: false,
        },
      },
    ];

    jest.mocked(getVariableColumnFilters).mockImplementation(() => [] as any);
    jest.mocked(mergeColumnFilters).mockImplementation((current, updated) => current.concat(updated));

    const columns = [] as any;

    const { result } = await act(async () =>
      renderHook(() =>
        useSyncedColumnFilters({
          columns: columns as any,
          eventBus,
          userFilterPreference: [],
          defaultFilters: defaultFilters,
        })
      )
    );

    expect(result.current[0]).toEqual(defaultFilters);
  });

  it('Should update filters when defaultFilters change', async () => {
    const initialDefaultFilters = [
      {
        id: 'a',
        value: {
          type: ColumnFilterType.SEARCH,
          value: 'initial',
          caseSensitive: false,
        },
      },
    ];

    const updatedDefaultFilters = [
      {
        id: 'a',
        value: {
          type: ColumnFilterType.SEARCH,
          value: 'updated',
          caseSensitive: false,
        },
      },
    ];

    jest.mocked(getVariableColumnFilters).mockImplementation(() => [] as any);
    jest.mocked(mergeColumnFilters).mockImplementation((current, updated) => current.concat(updated));

    const columns = [] as any;

    const { result, rerender } = renderHook(
      ({ defaultFilters }) =>
        useSyncedColumnFilters({
          columns,
          eventBus,
          userFilterPreference: [],
          defaultFilters,
        }),
      {
        initialProps: {
          defaultFilters: initialDefaultFilters,
        },
      }
    );

    expect(result.current[0]).toEqual(initialDefaultFilters);

    await act(async () => {
      rerender({ defaultFilters: updatedDefaultFilters });
    });

    expect(result.current[0]).toEqual(updatedDefaultFilters);
  });
});
