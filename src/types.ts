export type Primitive = string | number | boolean;
export type Dict = Record<string, any>;

export type JustFn<T> = () => T;
export type ReduceFn<T, U> = (prev: U, next: T) => U;
export type MapFn<T, U> = (next: T) => U;

export type Reducer<T, U> = { reducefn: ReduceFn<T, U>; initialfn: JustFn<U> };
export type Stacker<T, U> = { stackfn: ReduceFn<T, U>; initialfn: JustFn<U> };

export type SummaryNumeric = {
  n: number;
  min: number;
  max: number;
  sum: number;
};
