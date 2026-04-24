import { RowData } from '@tanstack/react-table';

import { ColumnMeta as ColumnMetaOptions } from '../types';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> extends ColumnMetaOptions {}

  interface FilterMeta {
    from?: number;
    to?: number;
  }
}
