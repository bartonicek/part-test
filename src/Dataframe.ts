import { entries, keys } from "./funs";
import { DiscArray, NumArray } from "./structs/Variable";
import { Col, Cols, Row, RowOf, ScalarOf } from "./types";

type ParsedCol<T> = T extends "num" ? NumArray : DiscArray;

export class Dataframe<T extends Cols> {
  keys: (keyof T)[];

  constructor(public cols: T) {
    this.keys = keys(cols);
  }

  static parseCols = <
    U extends Record<string, "num" | "disc">,
    V extends Record<keyof U, any[]>
  >(
    cols: V,
    keyMap: U
  ) => {
    const parsedCols = {} as { [key in keyof U]: ParsedCol<U[key]> };

    for (const k of keys(keyMap)) {
      const key = k as keyof U;
      const variable = (
        keyMap[key] === "num"
          ? new NumArray(cols[key])
          : new DiscArray(cols[key])
      ) as ParsedCol<U[typeof key]>;

      parsedCols[key] = variable;
    }

    return new Dataframe(parsedCols);
  };

  static fromRow = <U extends Row>(row: U) => {
    const cols = {} as { [key in keyof U]: Col };
    for (const [k, v] of entries(row)) {
      cols[k] = v.toVariable();
    }
    return new Dataframe(cols);
  };

  col = <K extends keyof T>(key: K) => this.cols[key];
  row = (index: number) => {
    const result = {} as { [key in keyof T]: ScalarOf<T[key]> };
    for (const [k, v] of entries(this.cols)) {
      result[k] = v.ith(index) as ScalarOf<T[typeof k]>;
    }
    return result;
  };

  rowUnwrap = (index: number) => {
    const result = {} as { [key in keyof T]: any };
    for (const [k, v] of entries(this.cols)) {
      result[k] = v.ith(index).value();
    }
    return result;
  };

  select = <U extends Record<string, keyof T>>(keyMap: U) => {
    const cols = {} as { [key in keyof U]: T[U[key]] };
    for (const [k1, k2] of entries(keyMap)) cols[k1] = this.cols[k2];
    return new Dataframe(cols);
  };

  push = (row: RowOf<T>) => {
    for (const [k, v] of entries(row)) {
      this.cols[k].push(v as any);
    }
  };
}
