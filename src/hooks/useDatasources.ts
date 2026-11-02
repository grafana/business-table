import { getDataSourceInstanceList } from '@grafana/plugin-compat/datasources';
import { useEffect, useState } from 'react';

/**
 * Datasource List Item
 * Structural subset of `DataSourceInstanceListItem`, which is not exported by `@grafana/data` 12.4.
 */
export interface DatasourceListItem {
  /**
   * UID
   *
   * @type {string}
   */
  uid: string;

  /**
   * Name
   *
   * @type {string}
   */
  name: string;
}

/**
 * Use Datasource
 */
export const useDatasources = () => {
  const [datasources, setDatasources] = useState<DatasourceListItem[]>([]);

  /**
   * Get Datasources
   */
  useEffect(() => {
    /**
     * Ignore results after unmount
     */
    let cancelled = false;

    const fetchData = async () => {
      /**
       * Get list of datasources
       */
      const dsList: DatasourceListItem[] = await getDataSourceInstanceList({
        alerting: false,
        tracing: false,
        metrics: false,
        logs: false,
        dashboard: false,
        mixed: false,
        variables: true,
        annotations: false,
        filter: (dataSource: DatasourceListItem) => {
          /**
           * Exclude grafana datasource (--Grafana--)
           */
          return dataSource.uid !== 'grafana';
        },
      });

      if (!cancelled) {
        setDatasources(dsList);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return datasources;
};
