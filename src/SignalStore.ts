import { Accessor, Setter, createSignal, untrack } from "solid-js";
import { Dict, MapFn } from "./types";
import { call, entries, keys } from "./funs";

export type Getters = Record<string, Accessor<any>>;
export type Setters = Record<string, Setter<any>>;

type SetterValue<T> = T extends Setter<infer U> ? U : never;
type SetterUpdateFn<T> = T extends Setter<infer U> ? (prev: U) => U : never;

// type BindOverload<G extends Getters, S extends Setters> = {
//   <K extends string, V extends any>(key: K, bindfn: () => V): SignalStore<
//     G & { [key in K]: Accessor<V> },
//     S
//   >;
//   <K extends string, V extends any>(
//     key: K,
//     bindfn: (getters: G) => V
//   ): SignalStore<
//     G & { [key in K]: Accessor<V> },
//     S & { [key in K]: Setter<V> }
//   >;
// };

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

  bind = <
    K extends string,
    V extends any,
    G extends T = T & { [key in K]: Accessor<V> },
    S extends U = U & { [key in K]: Setter<V> }
  >(
    key: K,
    bindfn: MapFn<T | never, V>
  ): SignalStore<G, S> => {
    const getters = this.getters as G;
    const setters = this.setters as S;

    if (!bindfn.length) {
      const [getter, setter] = createSignal(bindfn(getters));
      Object.defineProperty(getters, key, { value: getter });
      Object.defineProperty(setters, key, { value: setter });
      return new SignalStore(getters, setters);
    }

    Object.defineProperty(getters, key, { value: () => bindfn(getters) });
    return new SignalStore(getters, setters as S);
  };

  get = <K extends keyof T>(key: K): ReturnType<T[K]> => {
    return call(this.getters[key]);
  };

  set: SetOverload<U, keyof U> = (key, updatefn) => {
    this.setters[key](updatefn);
    return this;
  };
}
