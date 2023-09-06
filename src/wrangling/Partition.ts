import { Accessor, createMemo, untrack } from "solid-js";
import Factor from "../structs/Factor";
import { Cols } from "../types";
import Composer from "./Composer";
import Dataframe from "./Dataframe";
import IndexMap from "./IndexMap";
import Part from "./Part";
import { Scalar } from "../structs/Scalar";

export default class Partition<T extends Cols> {
  parts: Accessor<Record<number, Record<string, Scalar<any>>>>;
  computed: Accessor<Dataframe<Cols>>;

  constructor(
    public data: Dataframe<T>,
    public factor: Accessor<Factor>,
    public composer: Composer<any, any, any>,
    public parent?: Partition<any>
  ) {
    this.parts = createMemo(this.getParts);
    this.computed = createMemo(this.compute);
  }

  getParts = () => {
    const factor = this.factor();
    const parentFactor = untrack(this.parent?.factor ?? (() => ({})));
    const parentParts = this.parent?.parts();

    const indexMap = new IndexMap(
      factor.indexArray,
      (parentFactor as Factor)?.indexArray
    );

    const { data, composer } = this;
    const { indices, indexPositions, indexLabels } = factor;
    const parts: Record<number, Record<string, Scalar<any>>> = {};

    for (const index of indices) {
      parts[index] = new Part(
        data,
        indexPositions[index],
        indexLabels[index],
        composer,
        parentParts?.[indexMap.parentIndex(index)]
      ).compute();
    }

    return parts;
  };

  compute = () => {
    const parts = Object.values(this.parts());

    const resultData = Dataframe.fromRow(parts[0]);
    for (let i = 1; i < parts.length; i++) resultData.push(parts[i]);

    return resultData;
  };
}
