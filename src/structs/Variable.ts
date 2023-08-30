import { summarizeNumeric } from "../funs";
import { SummaryNumeric } from "../types";
import { Factor } from "./Factor";
import { Scalar, ScalarDiscrete, ScalarNumeric } from "./Scalar";

export type Variable<T> = {
  meta: Record<string, any>;
  ith: (index: number) => Scalar<T>;
};

export class Numeric implements Variable<number> {
  meta: SummaryNumeric;

  constructor(private array: number[]) {
    this.meta = summarizeNumeric(array);
  }

  ith = (index: number) => ScalarNumeric.fromValue(this.array[index]);
}

export class Discrete implements Variable<string> {
  meta: Record<string, any>;

  constructor(private array: string[]) {
    this.meta = {};
  }

  ith = (index: number) => ScalarDiscrete.fromValue(this.array[index]);

  toFactor = () => Factor.from(this.array);
}
