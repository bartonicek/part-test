import { POJO, identity, secondArgument } from "./funs";
import { Cols, JustFn, MapFn, ReduceFn, Reducer, Row, RowOf } from "./types";

export class Composer<T extends Row, U = Row, V = Partial<Row>> {
  constructor(
    public reducer: Reducer<T, U>,
    public mapfn: MapFn<U, V>,
    public stacker: Reducer<V, V>
  ) {}

  static default = () => {
    return new Composer(
      { reducefn: secondArgument, initialfn: POJO },
      identity,
      { reducefn: secondArgument, initialfn: POJO }
    );
  };

  setReducer = <U2 extends Row>(
    reducefn: ReduceFn<T, U2>,
    initialfn: JustFn<U2>
  ) => {
    return new Composer(
      { reducefn: reducefn as any, initialfn: initialfn as any },
      this.mapfn,
      this.stacker
    ) as unknown as Composer<T, U2, V>;
  };

  setMapfn = <V2 extends Row>(mapfn: MapFn<U, V2>) => {
    return new Composer(
      this.reducer,
      mapfn as any,
      this.stacker
    ) as unknown as Composer<T, U, V2>;
  };

  setStacker = <V3 extends Partial<V>>(
    stackfn: ReduceFn<V3, V3>,
    initialfn: JustFn<V3>
  ) => {
    return new Composer(this.reducer, this.mapfn, {
      reducefn: stackfn as any,
      initialfn: initialfn as any,
    }) as unknown as Composer<T, U, V3>;
  };
}
