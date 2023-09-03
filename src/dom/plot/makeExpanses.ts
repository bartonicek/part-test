import { createSignal } from "solid-js";
import { just } from "../../funs";
import { Expanse } from "../../scales.ts/Expanse";
import { PlotStore } from "./makePlotStore";

export const makeExpanses = (store: PlotStore) => {
  const expanses = {
    outerHorizontal: Expanse.default(),
    innnerHorizontal: Expanse.default(),
    outerVertical: Expanse.default(),
    innerVertical: Expanse.default(),
    normX: Expanse.default(),
    normY: Expanse.default(),
  };

  return expanses;
};
