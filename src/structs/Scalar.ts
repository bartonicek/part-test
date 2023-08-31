import { Dict } from "../types";
import { Discrete, Numeric } from "./Variable";

class Value<T> {
  constructor(private val: T) {}
  value = () => this.val;
}

class View<T> {
  constructor(private arr: T[], private index: number) {}
  value = () => this.arr[this.index];
}

type ValueLike<T> = Value<T> | View<T>;

export class ScalarNumeric {
  constructor(public valueLike: ValueLike<number>, private metadata?: Dict) {}

  static fromValue = (value: number, metadata?: Dict) => {
    return new ScalarNumeric(new Value(value), metadata);
  };

  static fromView = (array: number[], index: number, metadata?: Dict) => {
    return new ScalarNumeric(new View(array, index), metadata);
  };

  meta = () => this.metadata;
  value = () => this.valueLike.value();
  toVariable = () => new Numeric([this.valueLike.value()]);

  add = (other: ScalarNumeric) => {
    return ScalarNumeric.fromValue(this.value() + other.value());
  };

  subtract = (other: ScalarNumeric) => {
    return ScalarNumeric.fromValue(this.value() - other.value());
  };

  times = (other: ScalarNumeric) => {
    return ScalarNumeric.fromValue(this.value() * other.value());
  };

  divideBy = (other: ScalarNumeric) => {
    return ScalarNumeric.fromValue(this.value() * other.value());
  };
}

export class ScalarDiscrete {
  constructor(public valueLike: ValueLike<string | number>) {}

  static fromValue = (value: string | number) => {
    return new ScalarDiscrete(new Value(value));
  };

  static fromView = <T extends string | number>(array: T[], index: number) => {
    return new ScalarDiscrete(new View(array, index));
  };

  value = () => this.valueLike.value();
  toVariable = () => new Discrete([this.valueLike.value().toString()]);

  paste = (other: ScalarDiscrete) => {
    return ScalarDiscrete.fromValue(`${this.value()}${other.value()}`);
  };
}

export const num = (x: number) => ScalarNumeric.fromValue(x);
export const str = (x: string) => ScalarDiscrete.fromValue(x);

export type Scalar<T> = T extends string
  ? ScalarDiscrete
  : T extends number
  ? ScalarNumeric
  : never;
