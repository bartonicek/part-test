import { ScaleContinuous } from "../../scales.ts/ScaleContinuous";
import { ScalePlaceholder } from "../../scales.ts/ScalePlaceholder";

const makeScales = () => {
  return {
    innerX: new ScalePlaceholder(),
    innerY: new ScalePlaceholder(),
    outerX: new ScalePlaceholder(),
    outerY: new ScalePlaceholder(),
  };
};

export default makeScales;
export type PlotScales = ReturnType<typeof makeScales>;
