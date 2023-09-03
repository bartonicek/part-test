import { Dict } from "../types";
import { Value, ValueLike, View } from "./ValueLike";
import { DiscArray, NumArray } from "./Variable";

export class Num {
  constructor(public valueLike: ValueLike<number>, private metadata?: Dict) {}

  static fromValue = (value: number, metadata?: Dict) => {
    return new Num(new Value(value), metadata);
  };

  static fromView = (array: number[], index: number, metadata?: Dict) => {
    return new Num(new View(array, index), metadata);
  };

  meta = () => this.metadata;
  value = () => this.valueLike.value();
  toVariable = () => new NumArray([this.valueLike.value()]);

  increment = () => Num.fromValue(this.value() + 1);
  decrement = () => Num.fromValue(this.value() - 1);

  add = (other: Num) => {
    return Num.fromValue(this.value() + other.value());
  };

  subtract = (other: Num) => {
    return Num.fromValue(this.value() - other.value());
  };

  times = (other: Num) => {
    return Num.fromValue(this.value() * other.value());
  };

  divideBy = (other: Num) => {
    return Num.fromValue(this.value() * other.value());
  };
}

export class Disc {
  constructor(public valueLike: ValueLike<string | number>) {}

  static fromValue = (value: string | number) => {
    return new Disc(new Value(value));
  };

  static fromView = <T extends string | number>(array: T[], index: number) => {
    return new Disc(new View(array, index));
  };

  value = () => this.valueLike.value();
  toVariable = () => new DiscArray([this.valueLike.value().toString()]);

  paste = (other: Disc) => {
    return Disc.fromValue(`${this.value()}${other.value()}`);
  };
}

export const num = (x: number) => Num.fromValue(x);
export const disc = (x: string) => Disc.fromValue(x);

export type Scalar<T> = T extends string
  ? Disc
  : T extends number
  ? Num
  : never;
