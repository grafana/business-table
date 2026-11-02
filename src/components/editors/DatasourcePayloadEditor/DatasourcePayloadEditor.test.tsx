import { getDataSourceInstance } from '@grafana/plugin-compat/datasources';
import { getTemplateSrv } from '@grafana/runtime';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createSelector, getJestSelectors } from '@/utils/test-selectors';
import React from 'react';

import { TEST_IDS } from '@/constants';

import { DatasourcePayloadEditor } from './DatasourcePayloadEditor';

/**
 * Props
 */
type Props = React.ComponentProps<typeof DatasourcePayloadEditor>;

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getTemplateSrv: jest.fn(),
}));

/**
 * Mock @grafana/plugin-compat/datasources
 */
jest.mock('@grafana/plugin-compat/datasources', () => ({
  getDataSourceInstance: jest.fn(),
}));

/**
 * In Test Ids
 */
const inTestIds = {
  queryEditor: createSelector('data-testid query-editor'),
};

describe('DatasourcePayloadEditor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors({
    ...TEST_IDS.payloadEditor,
    ...inTestIds,
  });
  const selectors = getSelectors(screen);

  /**
   * Get component
   */
  const getComponent = (props: Partial<Props>) => {
    return <DatasourcePayloadEditor {...(props as any)} />;
  };

  beforeEach(() => {
    jest.mocked(getTemplateSrv).mockReturnValue({
      replace: jest.fn((str) => str),
    } as never);
  });

  it('Should show loading message', async () => {
    await act(async () => render(getComponent({})));

    expect(selectors.loadingMessage()).toBeInTheDocument();
  });

  it('Should show error message', async () => {
    const getDataSourceInstanceMock = jest.fn(async () => ({
      name: 'postgresName',
      uid: 'postgres',
      components: {},
    }));
    jest.mocked(getDataSourceInstance).mockImplementation(getDataSourceInstanceMock as any);

    await act(async () =>
      render(
        getComponent({
          datasourceUid: 'postgres',
        })
      )
    );

    expect(selectors.errorMessage()).toBeInTheDocument();
  });

  it('Should show query editor', async () => {
    /**
     * Data Source Mock
     */
    const getDataSourceInstanceMock = jest.fn(async () => ({
      name: 'postgresName',
      uid: 'postgres',
      components: {
        QueryEditor: jest.fn(({ onChange, query }) => (
          <input
            {...inTestIds.queryEditor.apply()}
            value={query?.name || ''}
            onChange={(event) =>
              onChange({
                name: event.target.value,
              })
            }
          />
        )),
      },
    }));
    jest.mocked(getDataSourceInstance).mockImplementation(getDataSourceInstanceMock as any);

    /**
     * On Change
     */
    const onChange = jest.fn();

    await act(async () =>
      render(
        getComponent({
          datasourceUid: 'postgres',
          onChange,
          value: {
            name: 'bye',
          },
        })
      )
    );

    expect(selectors.queryEditor()).toBeInTheDocument();
    expect(selectors.queryEditor()).toHaveValue('bye');

    /**
     * Change query
     */
    fireEvent.change(selectors.queryEditor(), { target: { value: 'hello' } });

    /**
     * Check updated value
     */
    expect(selectors.queryEditor()).toHaveValue('hello');

    /**
     * Run auto save timer
     */
    await act(async () => jest.runOnlyPendingTimersAsync());

    /**
     * Check if saved
     */
    expect(onChange).toHaveBeenCalledWith({
      name: 'hello',
    });
  });

  it('Should clear query if different data source type', async () => {
    /**
     * Data Source Mock
     */

    const getDataSourceInstanceMock = jest.fn(async () => ({
      type: 'grafana-postgres',
      name: 'postgresName',
      uid: 'postgres',
      components: {
        QueryEditor: jest.fn(({ onChange, query }) => (
          <input
            {...inTestIds.queryEditor.apply()}
            value={query?.name || ''}
            onChange={(event) =>
              onChange({
                name: event.target.value,
              })
            }
          />
        )),
      },
    }));
    jest.mocked(getDataSourceInstance).mockImplementation(getDataSourceInstanceMock as any);

    /**
     * On Change
     */
    const onChange = jest.fn();

    const { rerender } = await act(async () =>
      render(
        getComponent({
          datasourceUid: 'postgres',
          onChange,
          value: {
            name: 'hello',
          },
        })
      )
    );

    expect(selectors.queryEditor()).toBeInTheDocument();

    /**
     * Check if value reset
     */
    expect(selectors.queryEditor()).toHaveValue('hello');

    /**
     * Data Source Mock
     */
    jest.mocked(getDataSourceInstance).mockImplementation(
      jest.fn(async () => ({
        type: 'business-input',
        name: 'postgresName',
        uid: 'postgres1',
        components: {
          QueryEditor: jest.fn(({ onChange, query }) => (
            <input
              {...inTestIds.queryEditor.apply()}
              value={query?.name || ''}
              onChange={(event) =>
                onChange({
                  name: event.target.value,
                })
              }
            />
          )),
        },
      })) as any
    );

    /**
     * Rerender with new datasource
     */
    await act(async () =>
      rerender(
        getComponent({
          datasourceUid: 'postgres1',
          onChange,
          value: {
            name: 'hello',
          },
        })
      )
    );

    /**
     * Check if value reset
     */
    expect(selectors.queryEditor()).toHaveValue('');

    /**
     * Run auto save timer
     */
    await act(async () => jest.runOnlyPendingTimersAsync());

    /**
     * Check if saved
     */
    expect(onChange).toHaveBeenCalledWith({});
  });

  it('Should keep query if same data source type', async () => {
    /**
     * Data Source Mock
     */

    const getDataSourceInstanceMock = jest.fn(async () => ({
      type: 'grafana-postgres',
      name: 'postgresName',
      uid: 'postgres',
      components: {
        QueryEditor: jest.fn(({ onChange, query }) => (
          <input
            {...inTestIds.queryEditor.apply()}
            value={query?.name || ''}
            onChange={(event) =>
              onChange({
                name: event.target.value,
              })
            }
          />
        )),
      },
    }));
    jest.mocked(getDataSourceInstance).mockImplementation(getDataSourceInstanceMock as any);

    /**
     * On Change
     */
    const onChange = jest.fn();

    const { rerender } = await act(async () =>
      render(
        getComponent({
          datasourceUid: 'postgres',
          onChange,
          value: {
            name: 'hello',
          },
        })
      )
    );

    expect(selectors.queryEditor()).toBeInTheDocument();

    /**
     * Check if value reset
     */
    expect(selectors.queryEditor()).toHaveValue('hello');

    /**
     * Data Source Mock
     */
    jest.mocked(getDataSourceInstance).mockImplementation(
      jest.fn(async () => ({
        type: 'grafana-postgres',
        name: 'postgresName',
        uid: 'postgres1',
        components: {
          QueryEditor: jest.fn(({ onChange, query }) => (
            <input
              {...inTestIds.queryEditor.apply()}
              value={query?.name || ''}
              onChange={(event) =>
                onChange({
                  name: event.target.value,
                })
              }
            />
          )),
        },
      })) as any
    );

    /**
     * Rerender with new datasource
     */
    await act(async () =>
      rerender(
        getComponent({
          datasourceUid: 'postgres1',
          onChange,
          value: {
            name: 'hello',
          },
        })
      )
    );

    /**
     * Check if value reset
     */
    expect(selectors.queryEditor()).toHaveValue('hello');

    /**
     * Run auto save timer
     */
    await act(async () => jest.runOnlyPendingTimersAsync());

    /**
     * Check if saved
     */
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should show error if unable to get datasource', async () => {
    /**
     * Data Source Mock
     */
    const getDataSourceInstanceMock = jest.fn(async () => null);
    jest.mocked(getDataSourceInstance).mockImplementation(getDataSourceInstanceMock as any);

    await act(async () =>
      render(
        getComponent({
          datasourceUid: 'postgres',
        })
      )
    );

    expect(selectors.errorMessage()).toBeInTheDocument();
  });

  it('Should show error if loading datasource fails', async () => {
    jest.mocked(getDataSourceInstance).mockRejectedValue(new Error('Datasource not found'));

    await act(async () =>
      render(
        getComponent({
          datasourceUid: 'missing',
        })
      )
    );

    expect(selectors.loadingMessage(true)).not.toBeInTheDocument();
    expect(selectors.errorMessage()).toBeInTheDocument();
    expect(selectors.errorMessage()).toHaveTextContent('Datasource not found');
  });
});
