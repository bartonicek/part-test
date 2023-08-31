import { entries } from "./funs";
import { Cols, Row, RowOf, ScalarOf } from "./types";

export class Dataframe<T extends Cols> {
  constructor(public cols: T) {}

  static fromRow = <U extends Row>(row: Row) => {
    const cols = {} as Cols;
    for (const [k, v] of entries(row)) {
      cols[k] = v.toVariable();
    }
    return new Dataframe(cols);
  };

  row = (index: number) => {
    const result = {} as { [key in keyof T]: ScalarOf<T[key]> };
    for (const [k, v] of entries(this.cols)) {
      result[k] = v.ith(index) as ScalarOf<T[typeof k]>;
    }
    return result;
  };

  rowUnwrapped = (index: number) => {
    const result = {} as { [key in keyof T]: any };
    for (const [k, v] of entries(this.cols)) {
      result[k] = v.ith(index).value();
    }
    return result;
  };

  push = (row: RowOf<T>) => {
    for (const [k, v] of entries(row)) {
      this.cols[k].push(v as any);
    }
  };
}
