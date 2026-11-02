import { getDataSourceInstanceList } from '@grafana/plugin-compat/datasources';

import { renderHook, waitFor } from '@testing-library/react';

import { useDatasources } from './useDatasources';

/**
 * Mock @grafana/plugin-compat/datasources
 */
jest.mock('@grafana/plugin-compat/datasources', () => ({
  getDataSourceInstanceList: jest.fn(),
}));

describe('Use Datasources', () => {
  it('Should return datasources', async () => {
    const getDatasourcesMock = jest.fn(async () => [
      {
        name: 'abc',
      },
      {
        name: 'cba',
      },
    ]);
    jest.mocked(getDataSourceInstanceList).mockImplementationOnce(getDatasourcesMock as any);

    const { result } = renderHook(() => useDatasources());

    await waitFor(() => expect(result.current).toHaveLength(2));

    const datasources = result.current;

    /**
     * Should get datasources
     */
    expect(getDatasourcesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        alerting: false,
        annotations: false,
        dashboard: false,
        logs: false,
        metrics: false,
        mixed: false,
        tracing: false,
        variables: true,
      })
    );

    expect(datasources).toEqual([
      {
        name: 'abc',
      },
      {
        name: 'cba',
      },
    ]);
  });

  it('Should return datasources without grafana', async () => {
    const getDatasourcesMock = jest.fn(async (props) => {
      const datasourceList = [
        {
          name: 'abc',
        },
        {
          name: 'cba',
        },
        {
          name: '--Grafana--',
          uid: 'grafana',
        },
      ];

      if (props.filter) {
        return datasourceList.filter((datasource) => props.filter(datasource));
      }

      return datasourceList;
    });

    jest.mocked(getDataSourceInstanceList).mockImplementationOnce(getDatasourcesMock as any);

    const { result } = renderHook(() => useDatasources());

    await waitFor(() => expect(result.current).toHaveLength(2));

    const datasources = result.current;

    /**
     * Should get datasources
     */
    expect(getDatasourcesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        alerting: false,
        annotations: false,
        dashboard: false,
        logs: false,
        metrics: false,
        mixed: false,
        tracing: false,
        variables: true,
      })
    );

    expect(datasources).toEqual([
      {
        name: 'abc',
      },
      {
        name: 'cba',
      },
    ]);
  });
});
