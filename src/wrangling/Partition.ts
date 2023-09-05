import { Accessor, createMemo } from "solid-js";
import Factor from "../structs/Factor";
import { Cols } from "../types";
import Composer from "./Composer";
import Dataframe from "./Dataframe";
import IndexMap from "./IndexMap";
import Part from "./Part";

export default class Partition<T extends Cols> {
  parts: Accessor<Record<number, Part>>;
  computed: Accessor<Dataframe<Cols>>;
  indexMap: Accessor<IndexMap>;

  constructor(
    public data: Dataframe<T>,
    public factor: Accessor<Factor>,
    public composer: Composer<any, any, any>,
    public parent?: Partition<any>
  ) {
    this.parts = createMemo(this.getParts);
    this.computed = createMemo(this.compute);
    this.indexMap = () =>
      new IndexMap(this.factor().indexArray, this.parent?.factor().indexArray);
  }

  getParts = () => {
    const factor = this.factor();

    const { data, composer } = this;
    const { indices, indexPositions, indexLabels } = factor;
    const parts: Record<number, Part> = {};

    for (const index of indices) {
      parts[index] = new Part(
        data,
        indexPositions[index],
        indexLabels[index],
        composer
      );
    }

    return parts;
  };

  compute = () => {
    const parts = Object.values(this.parts());

    const resultData = Dataframe.fromRow(parts[0].computed());
    for (let i = 1; i < parts.length; i++) resultData.push(parts[i].computed());

    return resultData;
  };
}
