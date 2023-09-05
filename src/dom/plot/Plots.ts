import html from "solid-js/html";
import { just } from "../../funs";
import makeExpanses, { PlotExpanses } from "./makeExpanses";
import makePlotStore, { PlotStore } from "./makePlotStore";
import makeScales, { PlotScales } from "./makeScales";
import { onResize } from "./plotEventHandlers";
import Scene from "../scene/Scene";

export default class Plot {
  scene?: Scene;
  container: HTMLDivElement;
  contexts: Record<string | number, CanvasRenderingContext2D>;

  store: PlotStore;
  expanses: PlotExpanses;
  scales: PlotScales;

  constructor() {
    this.container = html`<div
      class="plotscape-container"
    ></div>` as HTMLDivElement;
    this.container.addEventListener("resize", onResize(this));
    this.contexts = {};

    const store = makePlotStore();
    this.store = store;

    const expanses = makeExpanses();
    this.expanses = expanses;

    expanses.outerH.setSignals(just(0), store.width);
    expanses.outerV.setSignals(just(0), store.height);
    expanses.innerH.setSignals(store.innerLeft, store.innerRight);
    expanses.innerV.setSignals(store.innerBottom, store.innerTop);
    expanses.normX.setSignals(store.normXLower, store.normXUppper);
    expanses.normY.setSignals(store.normYLower, store.normYUpper);

    const scales = makeScales();
    this.scales = scales;

    scales.outerX.setCodomain(expanses.outerH).setNorm(expanses.normX);
    scales.outerY.setCodomain(expanses.outerV).setNorm(expanses.normY);
    scales.innerX.setCodomain(expanses.innerH).setNorm(expanses.normX);
    scales.innerY.setCodomain(expanses.innerV).setNorm(expanses.normY);
  }

  registerScene = (scene: Scene) => {
    this.scene = scene;
    this.scene.app.appendChild(this.container);
    return this;
  };

  activate = () => {
    this.store.setActive(true);
    this.container.classList.add("active");
  };

  deactivate = () => {
    this.store.setActive(false);
    this.container.classList.remove("active");
    // clear(this.contexts.user);
  };
}
