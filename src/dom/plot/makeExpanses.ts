import { createSignal } from "solid-js";
import { just } from "../../funs";
import { Expanse } from "../../scales.ts/Expanse";
import { PlotStore } from "./makePlotStore";

const makeExpanses = () => {
  return {
    outerH: Expanse.default(),
    outerV: Expanse.default(),
    innerH: Expanse.default(),
    innerV: Expanse.default(),
    normX: Expanse.default(),
    normY: Expanse.default(),
  };
};

export type PlotExpanses = ReturnType<typeof makeExpanses>;
export default makeExpanses;
