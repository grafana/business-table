import { FieldType, toDataFrame } from '@grafana/data';

import { FieldSource } from '@/types';

import { getFieldBySource, getFrameBySource, resolveTableFields } from './group';

describe('Group utils', () => {
  /**
   * Columns configured while the variable was web-1
   */
  const configured: FieldSource[] = [
    { source: 'A', name: 'Time' },
    { source: 'A', name: 'usage {host="web-1"}' },
  ];

  describe('resolveTableFields', () => {
    it('Should keep an exact field match on the first frame', () => {
      const frame = toDataFrame({
        refId: 'A',
        fields: [
          { name: 'Time', type: FieldType.time, values: [1] },
          { name: 'usage {host="web-1"}', type: FieldType.number, values: [10] },
        ],
      });

      const resolved = resolveTableFields([frame], configured);

      expect(resolved.frame).toBe(frame);
      expect(resolved.fields.map((field) => field?.name)).toEqual(['Time', 'usage {host="web-1"}']);
    });

    it('Should follow a series renamed by a dashboard variable', () => {
      const renamed = toDataFrame({
        refId: 'A',
        fields: [
          { name: 'Time', type: FieldType.time, values: [2] },
          { name: 'usage {host="web-2"}', type: FieldType.number, values: [20] },
        ],
      });

      const resolved = resolveTableFields([renamed], configured);

      expect(resolved.fields.map((field) => field?.values[0])).toEqual([2, 20]);
    });

    it('Should skip an empty first frame and use the series that still matches', () => {
      const empty = toDataFrame({
        refId: 'A',
        fields: [{ name: 'other', type: FieldType.string, values: [] }],
      });
      const series = toDataFrame({
        refId: 'A',
        fields: [
          { name: 'Time', type: FieldType.time, values: [3] },
          { name: 'usage {host="web-2"}', type: FieldType.number, values: [30] },
        ],
      });

      const resolved = resolveTableFields([empty, series], configured);

      expect(resolved.frame).toBe(series);
      expect(resolved.fields[1]?.values[0]).toEqual(30);
    });

    it('Should map a fully renamed frame when the column count matches', () => {
      const renamed = toDataFrame({
        refId: 'A',
        fields: [
          { name: 'time', type: FieldType.time, values: [4] },
          { name: 'web-2', type: FieldType.number, values: [40] },
        ],
      });

      const resolved = resolveTableFields([renamed], [
        { source: 'A', name: 'time' },
        { source: 'A', name: 'web-1' },
      ]);

      expect(resolved.fields.map((field) => field?.name)).toEqual(['time', 'web-2']);
    });

    it('Should not guess a column when extra fields remain', () => {
      const frame = toDataFrame({
        refId: 'A',
        fields: [
          { name: 'time', type: FieldType.time, values: [5] },
          { name: 'web-2', type: FieldType.number, values: [50] },
          { name: 'host', type: FieldType.string, values: ['web-2'] },
        ],
      });

      const resolved = resolveTableFields([frame], [
        { source: 'A', name: 'time' },
        { source: 'A', name: 'web-1' },
      ]);

      expect(resolved.fields[0]?.name).toEqual('time');
      expect(resolved.fields[1]).toBeUndefined();
    });
  });

  describe('getFrameBySource', () => {
    it('Should still return the indexed frame when it has no refId', () => {
      const frame = toDataFrame({
        fields: [{ name: 'device', type: FieldType.string, values: ['a'] }],
      });

      expect(getFrameBySource([frame], { source: 0, name: 'device' })).toBe(frame);
    });
  });

  describe('getFieldBySource', () => {
    it('Should find a field after the label suffix changes', () => {
      const frame = toDataFrame({
        refId: 'A',
        fields: [{ name: 'usage {host="web-2"}', type: FieldType.number, values: [7] }],
      });

      expect(getFieldBySource([frame], { source: 'A', name: 'usage {host="web-1"}' })?.values[0]).toEqual(7);
    });
  });
});
