import { Accessor, createMemo } from "solid-js";
import Composer from "./Composer";
import Dataframe from "./Dataframe";
import { flow, unwrapAll } from "../funs";

const stackSymbol = Symbol("stack");

export default class Part {
  computed: Accessor<any>;

  constructor(
    public data: Dataframe<any>,
    public indices: Set<number>,
    public labels: Record<string, any>,
    public composer: Composer<any, any, any>,
    public parent?: Record<string | number | symbol, any>
  ) {
    this.computed = this.compute;
  }

  compute = () => {
    const { reduce, map, stack } = this;
    return flow(reduce, map, stack)();
  };

  reduce = () => {
    if (!this.composer.state.reduced) return this.data;

    const { data, indices } = this;
    const { reducefn, initialfn } = this.composer.reducer;

    let reduceResult = initialfn();
    for (const i of indices) {
      reduceResult = reducefn(reduceResult, data.row(i));
    }

    return reduceResult;
  };

  map = (reduceResult: ReturnType<typeof this.reduce>) => {
    if (!this.composer.state.mapped) return reduceResult;

    const { labels } = this;
    const { mapfn, stacker } = this.composer;

    const mapResult = mapfn(
      Object.assign(reduceResult, labels, { parent: this.parent })
    );
    mapResult[stackSymbol] = stacker.initialfn();

    return mapResult;
  };

  stack = (mapResult: ReturnType<typeof this.map>) => {
    if (!(this.composer.state.stacked && this.parent)) return mapResult;

    const { stacker } = this.composer;
    const parentComputed = this.parent;

    parentComputed[stackSymbol] = stacker.reducefn(
      parentComputed[stackSymbol],
      mapResult
    );

    Object.assign(mapResult, parentComputed[stackSymbol]);

    return mapResult;
  };
}
