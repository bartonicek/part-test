import { Accessor } from "solid-js";

export type ValueLike<T> = { value: () => T };

export class Value<T> implements ValueLike<T> {
  constructor(private val: T) {}
  static of = <T extends any>(val: T) => new Value(val);
  value = () => this.val;
}

export class View<T> implements ValueLike<T> {
  constructor(private arr: T[], private index: number) {}
  static of = <T extends any>(arr: T[], index: number) => new View(arr, index);
  value = () => this.arr[this.index];
}

export class Signal<T> implements ValueLike<T> {
  constructor(private accessor: Accessor<T>) {}
  static of = <T extends any>(accessor: Accessor<T>) => new Signal(accessor);
  value = () => this.accessor();
}
