import { Accessor } from "solid-js";
import Plot from "../plot/Plots";
import Dataframe from "../../wrangling/Dataframe";
import makeSceneStore, { SceneStore } from "./makeSceneStore";
import { Group } from "../../wrangling/Marker";

export default class Scene {
  nPlots: number;
  nCols: number;
  nRows: number;

  plots: Plot[];

  store: SceneStore;
  keyActions: Record<string, () => void>;

  constructor(
    public app: HTMLDivElement,
    public data: Accessor<Dataframe<any>>
  ) {
    this.nPlots = 0;
    this.nCols = 0;
    this.nRows = 0;

    this.plots = [];
    this.app.classList.add("plotscape-scene");

    this.store = makeSceneStore();
    this.keyActions = {
      Digit1: () => this.store.setGroup(Group.Group2),
      Digit2: () => this.store.setGroup(Group.Group3),
      Digit3: () => this.store.setGroup(Group.Group4),
    };

    // createEffect(() => {
    //   this.app.addEventListener("mousedown", onMousedown(this));
    //   window.addEventListener("keydown", onKeyDown(this));
    //   window.addEventListener("keyup", onKeyUp(this));
    //   window.addEventListener("dblclick", onDoubleClick(this));
    // });
  }

  setRowsCols = (rows: number, cols: number) => {
    document.documentElement.style.setProperty("--ncols", cols.toString());
    document.documentElement.style.setProperty("--nrows", rows.toString());
  };

  pushPlot = (plot: Plot) => {
    this.plots.push(plot.registerScene(this));

    this.nPlots++;
    this.nCols = Math.ceil(Math.sqrt(this.nPlots));
    this.nRows = Math.ceil(this.nPlots / this.nCols);

    this.setRowsCols(this.nRows, this.nCols);
  };
}
