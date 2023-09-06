import { Accessor, untrack } from "solid-js";
import { Getters, Setters, SignalStore } from "./SignalStore";
import { entries, firstProp, keys } from "./funs";
import { Cols, Dict, ScalarOf } from "./types";
import Factor from "./structs/Factor";
import Dataframe from "./wrangling/Dataframe";

export default class DataStore<
  T extends Getters,
  U extends Setters
> extends SignalStore<T, U> {
  constructor(getters: T, setters: U) {
    super(getters, setters);
    return this;
  }

  static fromDataSignal = <V extends Accessor<Dataframe<any>>>(signal: V) => {
    type U = V extends Accessor<Dataframe<infer D>> ? D : never;
    const getters = {} as { [key in keyof U]: Accessor<U[key]> };

    const data = untrack(signal) as Dataframe<U>;
    for (const k of keys(data.cols as typeof getters)) {
      getters[k] = () => signal().cols[k];
    }

    const getters2 = getters as typeof getters & { whole: Accessor<Factor> };
    getters2.whole = () => Factor.mono(data.meta.n);

    return new DataStore(getters2, {});
  };

  ith = (index: number) => {
    const result = {} as { [key in keyof T]: ScalarOf<ReturnType<T[key]>> };
    for (const [k, v] of entries(this.getters)) {
      result[k] = untrack(v).ith(index);
    }
    return result;
  };
}
