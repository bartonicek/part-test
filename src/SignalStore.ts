import { Accessor, Setter, createSignal, untrack } from "solid-js";
import { Dict, Fn, MapFn, PickByValue, Primitive, ScalarOf } from "./types";
import { call, entries, isPrimitive, isScalar, keys } from "./funs";
import { Scalar } from "./structs/Scalar";

export type Getters = Record<string, Accessor<any>>;
export type Setters = Record<string, Setter<any>>;

type SetterValue<T> = T extends Setter<infer U> ? U : never;
type SetterUpdateFn<T> = T extends Setter<infer U> ? (prev: U) => U : never;

type SetOverload<U extends Setters, K extends keyof U> = {
  (key: K, value: SetterValue<U[K]>): SignalStore<any, any>;
  (key: K, setfn: SetterUpdateFn<U[K]>): SignalStore<any, any>;
};

export class SignalStore<T extends Getters, U extends Setters> {
  constructor(public getters: T, public setters: U) {}

  static fromSignal = <V extends Accessor<Dict>>(signal: V) => {
    type U = V extends Accessor<infer D> ? D : never;
    const getters = {} as { [key in keyof U]: Accessor<U[key]> };

    const once = untrack(signal) as U;
    for (const k of keys(once)) getters[k] = () => (signal() as U)[k];
    return new SignalStore(getters, {});
  };

  static fromDict = <V extends Dict>(dict: V) => {
    const getters = {} as { [key in keyof V]: Accessor<V[key]> };
    for (const [k, v] of Object.entries(dict)) getters[k as keyof V] = () => v;
    return new SignalStore(getters, {});
  };

  bind = <V extends Record<string, Scalar<any> | ((getters: T) => any)>>(
    bindobj: V
  ) => {
    const getters = this.getters as Getters;
    const setters = this.setters as Setters;

    for (const [k, v] of entries(bindobj)) {
      const key = k as string;
      if (isScalar(v)) {
        const [getter, setter] = createSignal(v);
        getters[key] = getter;
        setters[key] = setter;
      } else {
        getters[key] = () => v(this.getters);
      }
    }

    return new SignalStore(
      getters as T & {
        [key in keyof V]: V[key] extends Fn
          ? Accessor<ReturnType<V[key]>>
          : Accessor<V[key]>;
      },
      setters as T & PickByValue<V, Primitive>
    );
  };

  get = <K extends keyof T>(key: K): ReturnType<T[K]> => {
    return call(this.getters[key]);
  };

  set: SetOverload<U, keyof U> = (key, updatefn) => {
    this.setters[key](updatefn);
    return this;
  };
}
