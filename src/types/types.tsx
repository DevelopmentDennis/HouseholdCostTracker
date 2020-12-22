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
