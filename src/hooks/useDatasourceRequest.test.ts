import { LoadingState } from '@grafana/data';
import { getDataSourceInstance } from '@grafana/plugin-compat/datasources';

import { renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import { DatasourceResponseError, useDatasourceRequest } from './useDatasourceRequest';

/**
 * Mock @grafana/plugin-compat/datasources
 */
jest.mock('@grafana/plugin-compat/datasources', () => ({
  getDataSourceInstance: jest.fn(),
}));

describe('useDatasourceRequest', () => {
  /**
   * Replace Variables
   */
  const replaceVariables = jest.fn((str: string) => str);

  /**
   * Default Request
   */
  const request = {
    query: { sql: 'select 1' },
    datasource: 'postgres',
    replaceVariables: replaceVariables as any,
    payload: { id: 1 },
  };

  /**
   * Mock datasource with a query implementation
   */
  const mockDatasource = (query: jest.Mock) => {
    jest.mocked(getDataSourceInstance).mockResolvedValue({ query } as any);
  };

  beforeEach(() => {
    replaceVariables.mockImplementation((str: string) => str);
  });

  it('Should return promise result', async () => {
    const response = { state: LoadingState.Done, data: [] };
    const query = jest.fn(() => Promise.resolve(response));
    mockDatasource(query);

    const { result } = renderHook(() => useDatasourceRequest());

    await expect(result.current(request)).resolves.toEqual(response);

    expect(getDataSourceInstance).toHaveBeenCalledWith('postgres');
    expect(query).toHaveBeenCalledWith({ targets: [{ sql: 'select 1' }] });
    expect(replaceVariables).toHaveBeenCalledWith(JSON.stringify(request.query, null, 2), {
      payload: { value: request.payload },
    });
  });

  it('Should return observable result', async () => {
    const response = { state: LoadingState.Done, data: [] };
    const query = jest.fn(() => of(response));
    mockDatasource(query);

    const { result } = renderHook(() => useDatasourceRequest());

    await expect(result.current(request)).resolves.toEqual(response);
  });

  it('Should throw DatasourceResponseError if response has error state', async () => {
    const responseError = new Error('Query failed');
    const query = jest.fn(() => of({ state: LoadingState.Error, data: [], errors: [responseError] }));
    mockDatasource(query);

    const { result } = renderHook(() => useDatasourceRequest());

    const promise = result.current(request);

    await expect(promise).rejects.toBeInstanceOf(DatasourceResponseError);
    await expect(promise).rejects.toMatchObject({
      message: 'Query failed',
      error: responseError,
      query: JSON.stringify(request.query, null, 2),
    });
  });

  it('Should throw DatasourceResponseError if JSON is invalid after interpolation', async () => {
    const query = jest.fn();
    mockDatasource(query);
    replaceVariables.mockImplementation(() => '{ invalid');

    const { result } = renderHook(() => useDatasourceRequest());

    const promise = result.current(request);

    await expect(promise).rejects.toBeInstanceOf(DatasourceResponseError);
    await expect(promise).rejects.toMatchObject({
      message: 'Invalid JSON after variable interpolation',
      query: '{ invalid',
    });
    expect(query).not.toHaveBeenCalled();
  });
});
