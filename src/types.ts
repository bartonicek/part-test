import Factor from "./structs/Factor";
import { Scalar, Disc, Num } from "./structs/Scalar";
import { DiscArray, NumArray, Variable } from "./structs/Variable";

export type Primitive = string | number | boolean;
export type Dict = Record<string, any>;

export type Fn = (...args: any[]) => any;
export type JustFn<T> = () => T;
export type ReduceFn<T, U> = (prev: U, next: T) => U;
export type MapFn<T, U> = (next: T) => U;

export type Reducer<T, U> = { reducefn: ReduceFn<T, U>; initialfn: JustFn<U> };
export type Stacker<T, U> = { stackfn: ReduceFn<T, U>; initialfn: JustFn<U> };

export type PickType<T extends Dict, V> = {
  [key in keyof T as T[key] extends V | undefined ? key : never]: T[key];
};

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
  : T extends Factor
  ? Disc
  : T extends Num
  ? Num
  : T extends Disc
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

export type KeysOfValue<T extends Dict, V> = {
  [key in keyof T]: T[key] extends V ? key : never;
}[keyof T];
export type PickByValue<T extends Dict, V> = Pick<T, KeysOfValue<T, V>>;

// export type IsNever<T> = [T] extends [never] ? true : false;

// export type IsUnion<T, U = T> = IsNever<T> extends true
//   ? false
//   : T extends U
//   ? IsNever<Exclude<U, T>> extends true
//     ? false
//     : true
//   : false;

// export type SinglePropObject<T, K = keyof T> = IsNever<K> extends true
//   ? never
//   : IsUnion<K> extends true
//   ? never
//   : T;
