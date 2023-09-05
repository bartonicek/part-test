import { Accessor } from "solid-js";
import { Scale } from "./Scale";
import { ScaleContinuous } from "./ScaleContinuous";
import { ScaleDiscrete } from "./ScaleDiscrete";
import { Expanse } from "./Expanse";

export class ScalePlaceholder implements Scale<any> {
  codomain?: Expanse;
  norm?: Expanse;

  constructor() {}

  setValues = <T extends string | number>(values: Accessor<T[]>) => {
    return new ScaleDiscrete(
      values,
      this.codomain ?? Expanse.default(),
      this.norm ?? Expanse.default()
    );
  };

  setDomain = (domain: Expanse) => {
    return new ScaleContinuous(
      domain,
      this.codomain ?? Expanse.default(),
      this.norm ?? Expanse.default()
    );
  };

  setCodomain = (codomain: Expanse) => {
    this.codomain = codomain;
    return this;
  };

  setNorm = (norm: Expanse) => {
    this.norm = norm;
    return this;
  };

  pushforward = (x: any) => 0;
  pullback = (x: number) => undefined;
}
