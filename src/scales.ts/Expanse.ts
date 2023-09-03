import { Accessor, Setter } from "solid-js";
import { ValueLike } from "../structs/ValueLike";
import { just, nothing } from "../funs";

export class Expanse {
  constructor(
    private lower: Accessor<number>,
    private upper: Accessor<number>
  ) {}

  static default = () => {
    return new Expanse(just(0), just(1));
  };

  setSignals = (lower: Accessor<number>, upper: Accessor<number>) => {
    this.lower = lower;
    this.upper = upper;
  };

  range = () => this.upper() - this.lower();
  normalize = (x: number) => (x - this.lower()) / this.range();
  unnormalize = (x: number) => this.lower() + x * this.range();
}

export class ExpanseSetter {
  private _setLower: Setter<number>;
  private _setUpper: Setter<number>;

  constructor(setLower: Setter<number>, setUpper: Setter<number>) {
    this._setLower = setLower;
    this._setUpper = setUpper;
  }

  setLower = (x: Parameters<typeof this._setLower>[0]) => {
    this._setLower(x);
    return this;
  };

  setUpper = (x: Parameters<typeof this._setUpper>[0]) => {
    this._setUpper(x);
    return this;
  };

  freezeLower = () => {
    this._setLower = nothing;
    return this;
  };

  freezeUpper = () => {
    this._setUpper = nothing;
    return this;
  };
}
