import { Accessor, createMemo } from "solid-js";
import { Dataframe } from "./Dataframe";
import { POJO, identity, secondArgument } from "./funs";
import { stackSymbol } from "./main";
import { JustFn, MapFn, ReduceFn, Reducer, Stacker } from "./types";

export class Part {
  data: Dataframe;
  parent?: Part;
  indices: number[];

  reducer: Reducer<any, any>;
  mapfn: MapFn<any, any>;
  stacker: Stacker<any, any>;

  computed: Accessor<any>;

  constructor(data: Dataframe, indices: number[], parent?: Part) {
    this.data = data;
    this.parent = parent;
    this.indices = indices;

    this.mapfn = identity;
    this.reducer = { reducefn: secondArgument, initialfn: POJO };
    this.stacker = { stackfn: secondArgument, initialfn: POJO };

    this.computed = this.compute;
  }

  update = () => {
    this.computed = createMemo(this.compute);
    return this;
  };

  setReducer = (reducefn: ReduceFn<any, any>, initialfn: JustFn<any>) => {
    this.reducer = { reducefn, initialfn };
    return this;
  };

  setMapfn = (mapfn: MapFn<any, any>) => {
    this.mapfn = mapfn;
    return this;
  };

  setStacker = (stackfn: ReduceFn<any, any>, initialfn: JustFn<any>) => {
    this.stacker = { stackfn, initialfn };
    return this;
  };

  compute = () => {
    const { data, indices, parent, mapfn } = this;
    const { reducefn, initialfn } = this.reducer;

    let result = initialfn();
    for (const i of indices) result = reducefn(result, data.row(i));

    result = mapfn(result);
    result[stackSymbol] = this.stacker.initialfn();

    if (!parent) return result;

    const { stackfn } = this.stacker;

    const parentComputed = parent.computed();
    parentComputed[stackSymbol] = stackfn(parentComputed[stackSymbol], result);
    Object.assign(result, parentComputed[stackSymbol]);

    return result;
  };
}
