import { Scalar, Disc, Num } from "./structs/Scalar";
import { DiscArray, NumArray, Variable } from "./structs/Variable";

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

export type Col = NumArray | DiscArray;
export type Row = { [key in string]: Num | Disc };
export type Cols = Record<string, Col>;

export type ScalarOf<T> = T extends NumArray
  ? Num
  : T extends DiscArray
  ? Disc
  : never;

export type VariableOf<T> = T extends Num
  ? NumArray
  : T extends Disc
  ? DiscArray
  : never;

export type RowOf<T extends Record<string, Col>> = {
  [key in keyof T]: ScalarOf<T[key]>;
};
export type ColsOf<T extends Row> = {
  [key in keyof T]: VariableOf<T[key]>;
};
