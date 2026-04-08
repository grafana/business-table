import { DataQueryResponse, InterpolateFunction, LoadingState } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';

import { useCallback } from 'react';
import { lastValueFrom } from 'rxjs';

/**
 * Datasource Response Error
 */
export class DatasourceResponseError {
  readonly error: unknown;
  readonly message: string;

  constructor(error: unknown, target: string) {
    this.error = error;
    this.message = target;
  }
}

/**
 * Use Datasource Request
 */
export const useDatasourceRequest = () => {
  return useCallback(
    async ({
      query,
      datasource,
      replaceVariables,
      payload,
    }: {
      query: unknown;
      datasource: string;
      replaceVariables: InterpolateFunction;
      payload: unknown;
    }): Promise<DataQueryResponse> => {
      const ds = await getDataSourceSrv().get(datasource);
      const replaced = replaceVariables(JSON.stringify(query, null, 2), { payload: { value: payload } });

      try {
        const parsed = JSON.parse(replaced);
        const result = (ds as unknown as { query: (opts: { targets: unknown[] }) => unknown }).query({
          targets: [parsed],
        });

        const validate = (response: DataQueryResponse): DataQueryResponse => {
          if (response.state && response.state === LoadingState.Error) {
            throw response?.errors?.[0] || response;
          }
          return response;
        };

        if (result instanceof Promise) {
          return await (result as Promise<DataQueryResponse>).then(validate);
        }

        return await lastValueFrom(result as import('rxjs').Observable<DataQueryResponse>).then(validate);
      } catch (error) {
        throw new DatasourceResponseError(error, replaced);
      }
    },
    []
  );
};
