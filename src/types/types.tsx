export type Transaction = {
  amount: number;
  createdAt: Date;
  tag: string;
  id?: number;
};

export type GraphFormat = {
  x: string;
  y: number;
};

export type LegendFormat = {
  name: string;
};

export type RecurringTransaction = {
  amount: number;
  description: string;
  id?: number;
};

export const sliceColors = [
  '#66ad33',
  '#f0e68c',
  '#8b4513',
  '#9acd32',
  '#252b29',
  '#ebdc22',
  '#5e665c',
  '#337bc0',
  '#f07632',
  '#434293',
  '#e31c13',
  '#96276d',
  '#f2aa58',
  '#e85f29',
];
