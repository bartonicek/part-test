import { toInt } from "../../funs";
import Plot from "./Plots";

export const onResize = (plot: Plot) => () => {
  const { setWidth, setHeight } = plot.store;
  setWidth(toInt(getComputedStyle(plot.container)["width"]));
  setHeight(toInt(getComputedStyle(plot.container)["height"]));
  // plot.representations.forEach((representation) => representation.draw());
  // plot.decorations.forEach((decoration) => decoration.draw());
};
