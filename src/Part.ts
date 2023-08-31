import { Accessor, createMemo } from "solid-js";
import { Dataframe } from "./Dataframe";
import { POJO, identity, secondArgument } from "./funs";
import { Cols, JustFn, MapFn, ReduceFn, Reducer, Row, RowOf } from "./types";

const stackSymbol = Symbol("stack");

type SetSecond<T, X extends Row> = T extends Part<infer A, infer _, infer C>
  ? Part<A, X, C>
  : never;
type SetThird<T, X extends Row> = T extends Part<infer A, infer B, infer _>
  ? Part<A, B, X>
  : never;

export class Part<T extends Cols, U extends Row, V extends Row> {
  reducer: Reducer<RowOf<T>, U>;
  mapfn: MapFn<U, V>;
  stacker: Reducer<Partial<V>, Partial<V>>;

  computed: Accessor<any>;

  constructor(
    public data: Dataframe<T>,
    public indices: number[],
    public parent?: Part<any, any, any>
  ) {
    this.reducer = {
      reducefn: secondArgument as ReduceFn<RowOf<T>, U>,
      initialfn: POJO as JustFn<U>,
    };
    this.mapfn = identity as MapFn<U, V>;
    this.stacker = { reducefn: secondArgument, initialfn: POJO };

    this.computed = this.compute;
  }

  update = () => {
    this.computed = createMemo(this.compute);
    return this;
  };

  setReducer = <W extends Row>(
    reducefn: ReduceFn<RowOf<T>, W>,
    initialfn: JustFn<W>
  ) => {
    this.reducer = {
      reducefn: reducefn as unknown as ReduceFn<RowOf<T>, U>,
      initialfn: initialfn as unknown as JustFn<U>,
    };
    return this as unknown as SetSecond<typeof this, W>;
  };

  setMapfn = <X extends Row>(mapfn: MapFn<U, X>) => {
    this.mapfn = mapfn as unknown as MapFn<U, V>;
    return this as unknown as SetThird<typeof this, X>;
  };

  setStacker = <Y extends Partial<V>>(
    stackfn: ReduceFn<Y, Y>,
    initialfn: JustFn<Y>
  ) => {
    this.stacker = {
      reducefn: stackfn as unknown as ReduceFn<Partial<V>, Partial<V>>,
      initialfn,
    };
    return this;
  };

  compute = () => {
    const { data, indices, parent, mapfn } = this;
    const { reducefn, initialfn } = this.reducer;

    let reduceResult = initialfn();
    for (const i of indices) {
      reduceResult = reducefn(reduceResult, data.row(i));
    }

    const mapResult = mapfn(reduceResult) as V & { [stackSymbol]: any };
    mapResult[stackSymbol] = this.stacker.initialfn();

    if (!parent) return mapResult;

    const { reducefn: stackfn } = this.stacker;

    const parentComputed = parent.computed();
    parentComputed[stackSymbol] = stackfn(
      parentComputed[stackSymbol],
      mapResult
    );
    Object.assign(mapResult, parentComputed[stackSymbol]);

    return mapResult;
  };
}
