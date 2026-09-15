import { RowData } from '@tanstack/react-table';

import { ColumnMeta as ColumnMetaOptions, TablePaginationConfig } from '../types';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> extends ColumnMetaOptions {}

  interface TableMeta<TData extends RowData> {
    /**
     * Pagination settings used when applying query column filters.
     * @type {TablePaginationConfig}
     */
    pagination?: TablePaginationConfig;
  }

  interface FilterMeta {
    from?: number;
    to?: number;
  }
}
