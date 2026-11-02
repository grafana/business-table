import { DataSourceApi } from '@grafana/data';
import { getDataSourceInstance } from '@grafana/plugin-compat/datasources';
import { getTemplateSrv } from '@grafana/runtime';
import { DataQuery } from '@grafana/schema';
import { Alert, LoadingPlaceholder } from '@grafana/ui';
import React, { useCallback, useEffect, useState } from 'react';

import { TEST_IDS } from '@/constants';
import { useAutoSave } from '@/hooks';
import { EditorProps } from '@/types';

/**
 * Properties
 */
interface Props extends EditorProps<unknown> {
  /**
   * Data Source Name
   *
   * @type {string}
   */
  datasourceUid: string;
}

/**
 * Payload Editor
 */
export const DatasourcePayloadEditor: React.FC<Props> = ({ value, onChange, datasourceUid }) => {
  /**
   * Template Service
   */
  const templateService = getTemplateSrv();

  /**
   * Data Source
   */
  const [datasource, setDatasource] = useState<DataSourceApi>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Query Auto Save
   */
  const { startTimer, removeTimer } = useAutoSave();
  const [query, setQuery] = useState(value);
  const [isChanged, setIsChanged] = useState(false);

  /**
   * On Change Query
   */
  const onChangeQuery = useCallback((query: unknown) => {
    setQuery(query);
    setIsChanged(true);
  }, []);

  /**
   * On Run query
   */
  const onRunQuery = useCallback(() => null, []);

  /**
   * Save Updates
   */
  const onSaveUpdates = useCallback(() => {
    onChange(query);
    setIsChanged(false);
  }, [onChange, query]);

  /**
   * Load Query Editor
   */
  useEffect(() => {
    const getDataSource = async (datasourceUid: string) => {
      setIsLoading(true);

      const ds = await getDataSourceInstance(datasourceUid);

      setIsLoading(false);

      return ds;
    };

    const checkDatasourceType = async () => {
      const loadedDatasource = datasource;
      const replacedDatasourceUid = templateService.replace(datasourceUid);

      try {
        /**
         * Reset query if new datasource type
         */
        if (loadedDatasource && loadedDatasource.uid !== replacedDatasourceUid) {
          const currentDatasource = await getDataSource(replacedDatasourceUid);

          if (loadedDatasource.type !== currentDatasource.type) {
            onChangeQuery({});
          }

          setLoadError(null);
          setDatasource(currentDatasource);
        }

        /**
         * Load data source
         */
        if (replacedDatasourceUid && !datasource) {
          const currentDatasource = await getDataSource(replacedDatasourceUid);

          setLoadError(null);
          setDatasource(currentDatasource);
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : `${error}`);
        setIsLoading(false);
      }
    };

    checkDatasourceType();
  }, [datasourceUid, datasource, onChangeQuery, templateService]);

  /**
   * Auto Save Timer
   */
  useEffect(() => {
    if (isChanged) {
      startTimer(onSaveUpdates);
    } else {
      removeTimer();
    }

    return () => {
      removeTimer();
    };
  }, [startTimer, isChanged, onSaveUpdates, removeTimer]);

  if (isLoading) {
    return (
      <Alert severity="info" title="Please Wait" {...TEST_IDS.payloadEditor.loadingMessage.apply()}>
        <LoadingPlaceholder text="Loading..." />
      </Alert>
    );
  }

  /**
   * Unable to load data source
   */
  if (loadError) {
    return (
      <Alert title="Unable to load data source" severity="error" {...TEST_IDS.payloadEditor.errorMessage.apply()}>
        {loadError}
      </Alert>
    );
  }

  /**
   * No editor or data source
   */
  if (!datasource || !datasource.components?.QueryEditor) {
    return <Alert title="No Query Editor" severity="error" {...TEST_IDS.payloadEditor.errorMessage.apply()} />;
  }

  /**
   * Query Editor
   */
  const Editor = datasource.components.QueryEditor;

  return <Editor datasource={datasource} query={query as DataQuery} onChange={onChangeQuery} onRunQuery={onRunQuery} />;
};
