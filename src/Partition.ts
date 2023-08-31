import { Accessor } from "solid-js";
import { Dataframe } from "./Dataframe";
import { Cols } from "./types";
import { Factor } from "./structs/Factor";
import { Part } from "./Part";

export class Partition<T extends Cols> {
  constructor(
    public data: Dataframe<T>,
    public factor: Accessor<Factor>,
    public parent?: Partition<any>
  ) {}

  compute = () => {
    const factor = this.factor();

    const indices = Array.from(factor.indices);

    const firstRowCases = factor.indexPositions[indices[0]];
    let part = new Part(this.data, firstRowCases);
    const data = Dataframe.fromRow(part.computed());

    for (let i = 1; i < indices.length; i++) {
      part = new Part(this.data, factor.indexPositions[indices[i]]);
      data.push(part.computed());
    }

    return data;
  };
}
