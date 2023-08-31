import { Accessor, createMemo } from "solid-js";
import { Dataframe } from "./Dataframe";
import { POJO, identity, secondArgument } from "./funs";
import { Cols, JustFn, MapFn, ReduceFn, Reducer, Row, RowOf } from "./types";
import { Composer } from "./Composer";

const stackSymbol = Symbol("stack");

type SetSecond<T, X extends Row> = T extends Part<infer A, infer _, infer C>
  ? Part<A, X, C>
  : never;
type SetThird<T, X extends Row> = T extends Part<infer A, infer B, infer _>
  ? Part<A, B, X>
  : never;

export class Part<T extends Cols, U extends Row, V extends Row> {
  computed: Accessor<any>;

  constructor(
    public data: Dataframe<T>,
    public indices: number[],
    public composer: Composer<any, any, any>,
    public parent?: Part<any, any, any>
  ) {
    this.computed = this.compute;
  }

  update = () => {
    this.computed = createMemo(this.compute);
    return this;
  };

  compute = () => {
    const { data, indices, parent } = this;
    const { reducer, mapfn, stacker } = this.composer;

    const { reducefn, initialfn } = reducer;

    let reduceResult = initialfn();
    for (const i of indices) {
      reduceResult = reducefn(reduceResult, data.row(i));
    }

    const mapResult = mapfn(reduceResult) as V & { [stackSymbol]: any };
    mapResult[stackSymbol] = stacker.initialfn();

    if (!parent) return mapResult;

    const parentComputed = parent.computed();
    parentComputed[stackSymbol] = stacker.reducefn(
      parentComputed[stackSymbol],
      mapResult
    );
    Object.assign(mapResult, parentComputed[stackSymbol]);

    return mapResult;
  };
}
