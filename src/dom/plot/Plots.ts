import html from "solid-js/html";
import { PlotStore, makePlotStore } from "./makePlotStore";
import { onResize } from "./plotEventHandlers";
import { Expanse } from "../../scales.ts/Expanse";
import { just, keys } from "../../funs";

const expanseKeys = [
  "outerHorizontal",
  "innerHorizontal",
  "outerVertical",
  "innerVertical",
  "dataX",
  "dataY",
  "normX",
  "normY",
] as const;
type ExpanseKeys = (typeof expanseKeys)[number];

export class Plot {
  container: HTMLDivElement;
  store: PlotStore;
  expanses: { [key in ExpanseKeys]: Expanse };

  constructor() {
    this.container = html`<div></div>` as HTMLDivElement;
    const store = makePlotStore();
    this.store = store;

    this.container.addEventListener("resize", onResize(this));

    const expanses = {} as { [key in ExpanseKeys]: Expanse };
    for (const key of expanseKeys) expanses[key] = Expanse.default();

    expanses.outerHorizontal.setSignals(just(0), store.width);
    expanses.innerHorizontal.setSignals(just(0), store.innerWidth);
    expanses.outerVertical.setSignals(just(0), store.height);
    expanses.innerVertical.setSignals(just(0), store.innerHeight);
    expanses.normX.setSignals(store.normXLower, store.normXUppper);
    expanses.normY.setSignals(store.normYLower, store.normYUpper);

    this.expanses = expanses;
  }
}
