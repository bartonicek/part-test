import { sortStrings, summarizeNumeric } from "../funs";
import { SummaryNumeric } from "../types";
import { Factor } from "./Factor";
import { Scalar, Disc, Num } from "./Scalar";

export type Variable<T> = {
  meta: Record<string, any>;
  ith: (index: number) => Scalar<T>;
  push: (scalar: Scalar<T>) => void;
};

export class NumArray implements Variable<number> {
  meta: SummaryNumeric;

  constructor(private array: number[]) {
    this.meta = summarizeNumeric(array);
  }

  ith = (index: number) => Num.fromValue(this.array[index]);

  push = (scalar: Num) => {
    const value = scalar.value();
    this.meta.n++;
    this.meta.min = Math.min(this.meta.min, value);
    this.meta.max = Math.max(this.meta.max, value);
    this.meta.sum += value;
    this.array.push(value);
  };
}

export class DiscArray implements Variable<string> {
  meta: Record<string, any>;

  constructor(private array: string[]) {
    this.meta = { levels: sortStrings(Array.from(new Set(array))) };
  }

  ith = (index: number) => Disc.fromValue(this.array[index]);

  push = (scalar: Disc) => {
    const value = scalar.value().toString();
    if (this.meta.levels.indexOf(value) === -1) this.meta.levels.push(value);
    this.array.push(value);
  };

  toFactor = () => Factor.from(this.array);
}
