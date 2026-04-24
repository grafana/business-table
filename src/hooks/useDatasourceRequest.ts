import { DataQueryResponse, InterpolateFunction, LoadingState } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';

import { useCallback } from 'react';
import { lastValueFrom } from 'rxjs';

/**
 * Datasource Response Error
 */
export class DatasourceResponseError extends Error {
  readonly error: unknown;
  readonly query: string;

  constructor(error: unknown, query: string) {
    super(error instanceof Error ? error.message : String(error));
    this.name = 'DatasourceResponseError';
    this.error = error;
    this.query = query;
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

      let parsed: unknown;
      try {
        parsed = JSON.parse(replaced);
      } catch {
        throw new DatasourceResponseError(new SyntaxError(`Invalid JSON after variable interpolation`), replaced);
      }

      try {
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
