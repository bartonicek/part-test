import { Accessor } from "solid-js";
import { just } from "../funs";
import { Expanse } from "./Expanse";
import { Value } from "../structs/ValueLike";

type Scale<T> = {
  pushforward: (x: T) => number;
  pullback: (x: number) => T;
};

export class ScaleContinuous implements Scale<number> {
  constructor(
    public domain: Expanse,
    public codomain: Expanse,
    public norm: Expanse
  ) {}

  pushforward = (x: number) => {
    const { domain, codomain, norm } = this;
    return Math.floor(
      codomain.unnormalize(norm.unnormalize(domain.normalize(x)))
    );
  };

  pullback = (x: number) => {
    const { domain, codomain, norm } = this;
    return domain.unnormalize(norm.normalize(codomain.normalize(x)));
  };
}

export class ScaleDiscrete<T extends string | number> implements Scale<T> {
  constructor(
    public values: Accessor<T[]>,
    public codomain: Expanse,
    public norm: Expanse
  ) {}

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
