import { Numeric } from "./Variable";

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
  constructor(private valueLike: ValueLike<number>) {}

  static fromValue = (value: number) => new ScalarNumeric(new Value(value));
  static fromView = (array: number[], index: number) => {
    return new ScalarNumeric(new View(array, index));
  };

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
  constructor(private valueLike: ValueLike<string | number>) {}

  static fromValue = (value: string | number) => {
    return new ScalarDiscrete(new Value(value));
  };

  static fromView = <T extends string | number>(array: T[], index: number) => {
    return new ScalarDiscrete(new View(array, index));
  };

  value = () => this.valueLike.value();

  paste = (other: ScalarDiscrete) => {
    return ScalarDiscrete.fromValue(`${this.value()}${other.value()}`);
  };
}

export type Scalar<T> = T extends string
  ? ScalarDiscrete
  : T extends number
  ? ScalarNumeric
  : never;
