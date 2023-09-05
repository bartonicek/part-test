import { Expanse } from "./Expanse";
import { Scale } from "./Scale";

export class ScaleContinuous implements Scale<number> {
  constructor(
    public domain: Expanse,
    public codomain: Expanse,
    public norm: Expanse
  ) {}

  static default = () => {
    return new ScaleContinuous(
      Expanse.default(),
      Expanse.default(),
      Expanse.default()
    );
  };

  setDomain = (domain: Expanse) => {
    this.domain = domain;
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
