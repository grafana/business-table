import { LoadingState } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { renderHook } from '@testing-library/react';

import { DatasourceResponseError, useDatasourceRequest } from './useDatasourceRequest';

/**
 * Mock Grafana Runtime
 */
jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getDataSourceSrv: jest.fn(),
}));

describe('useDatasourceRequest', () => {
  /**
   * Mocks
   */
  const query = jest.fn();
  const get = jest.fn();
  const replaceVariables = jest.fn();

  beforeEach(() => {
    replaceVariables.mockImplementation((value: string) => value);
    jest.mocked(getDataSourceSrv).mockReturnValue({
      get,
    } as never);
    get.mockResolvedValue({
      query,
    });
  });

  it('Should throw response error for completed response with http error status', async () => {
    const responseError = {
      message: 'Request failed',
      status: 500,
    };
    const payload = {
      name: 'device1',
    };
    const request = {
      refId: 'A',
      body: '${payload.name}',
    };

    query.mockResolvedValue({
      state: LoadingState.Done,
      error: responseError,
    });

    const { result } = renderHook(() => useDatasourceRequest());

    const error = await result.current({
      query: request,
      datasource: 'infinity',
      replaceVariables,
      payload,
    }).catch((error) => error);

    expect(error).toBeInstanceOf(DatasourceResponseError);
    expect(error.message).toEqual(responseError.message);
    expect(error.error).toBe(responseError);
    expect(error.query).toEqual(JSON.stringify(request, null, 2));
    expect(query).toHaveBeenCalledWith({
      targets: [request],
    });
  });
});
