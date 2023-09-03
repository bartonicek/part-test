import { POJO, identity, secondArgument } from "./funs";
import { Disc, Num } from "./structs/Scalar";
import { JustFn, MapFn, ReduceFn, Reducer, Row } from "./types";

type FactorScalar = {
  level: Disc;
  binMin: Num;
  binMax: Num;
  [key: `level${number}`]: Disc;
  [key: `binMin${number}`]: Num;
  [key: `binMax${number}`]: Num;
};

const identityReducer = { reducefn: secondArgument, initialfn: POJO };
const noOp = {
  reduced: false,
  mapped: false,
  stacked: false,
};

export class Composer<T extends Row, U = Row, V = Partial<Row>> {
  constructor(
    public reducer: Reducer<T, U>,
    public mapfn: MapFn<U, V>,
    public stacker: Reducer<V, V>,
    public state: { reduced: boolean; mapped: boolean; stacked: boolean }
  ) {}

  static default = <T extends Row>() => {
    return new Composer<T>(identityReducer, identity, identityReducer, noOp);
  };

  setReducer = <U2 extends Row>(
    reducefn: ReduceFn<T, U2>,
    initialfn: JustFn<U2>
  ) => {
    return new Composer(
      { reducefn: reducefn as any, initialfn: initialfn as any },
      this.mapfn,
      this.stacker,
      { ...this.state, ...{ reduced: true } }
    ) as unknown as Composer<T, U2, V>;
  };

  setMapfn = <V2 extends Row>(mapfn: MapFn<U & FactorScalar, V2>) => {
    return new Composer(this.reducer, mapfn as any, this.stacker, {
      ...this.state,
      ...{ mapped: true },
    }) as unknown as Composer<T, U, V2>;
  };

  setStacker = <V3 extends Partial<V>>(
    stackfn: ReduceFn<V3, V3>,
    initialfn: JustFn<V3>
  ) => {
    return new Composer(
      this.reducer,
      this.mapfn,
      {
        reducefn: stackfn as any,
        initialfn: initialfn as any,
      },
      { ...this.state, ...{ stacked: true } }
    ) as unknown as Composer<T, U, V3>;
  };
}
