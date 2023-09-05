import { Accessor, createMemo } from "solid-js";
import { just } from "../funs";
import { Expanse } from "./Expanse";
import { Scale } from "./Scale";

export class ScaleDiscrete<T extends string | number> implements Scale<T> {
  values: Accessor<T[]>;

  constructor(
    values: Accessor<T[]>,
    public codomain: Expanse,
    public norm: Expanse
  ) {
    this.values = createMemo(values);
  }

  static default = () => {
    return new ScaleDiscrete(just([]), Expanse.default(), Expanse.default());
  };

  setValues = (values: Accessor<T[]>) => {
    this.values = createMemo(values);
    return this;
  };

  setCodomain = (codomain: Expanse) => {
    this.codomain = codomain;
    return this;
  };

  setNorm = (norm: Expanse) => {
    this.norm = norm;
    return this;
  };

  pushforward = (x: T) => {
    const { codomain, norm } = this;
    const values = this.values();
    const pct = (values.indexOf(x) + 1) / (values.length + 1);
    return Math.floor(codomain.unnormalize(norm.unnormalize(pct)));
  };

  pullback = (x: number) => {
    const { codomain, norm } = this;
    const values = this.values();
    const index = Math.ceil(
      norm.normalize(codomain.normalize(x)) * (values.length + 1) - 1
    );
    return values[index];
  };
}
