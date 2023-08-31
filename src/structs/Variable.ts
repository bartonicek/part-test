import { summarizeNumeric } from "../funs";
import { SummaryNumeric } from "../types";
import { Factor } from "./Factor";
import { Scalar, ScalarDiscrete, ScalarNumeric } from "./Scalar";

export type Variable<T> = {
  meta: Record<string, any>;
  ith: (index: number) => Scalar<T>;
  push: (scalar: Scalar<T>) => void;
};

export class Numeric implements Variable<number> {
  meta: SummaryNumeric;

  constructor(private array: number[]) {
    this.meta = summarizeNumeric(array);
  }

  ith = (index: number) => ScalarNumeric.fromValue(this.array[index]);

  push = (scalar: ScalarNumeric) => {
    const value = scalar.value();
    this.meta.n++;
    this.meta.min = Math.min(this.meta.min, value);
    this.meta.max = Math.max(this.meta.max, value);
    this.meta.sum += value;
    this.array.push(value);
  };
}

export class Discrete implements Variable<string> {
  meta: Record<string, any>;

  constructor(private array: string[]) {
    this.meta = {};
  }

  ith = (index: number) => ScalarDiscrete.fromValue(this.array[index]);

  push = (scalar: ScalarDiscrete) => {
    this.array.push(scalar.value().toString());
  };

  toFactor = () => Factor.from(this.array);
}
