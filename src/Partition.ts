import { Accessor } from "solid-js";
import { Dataframe } from "./Dataframe";
import { Cols } from "./types";
import { Factor } from "./structs/Factor";
import { Part } from "./Part";
import { Composer } from "./Composer";

export class Partition<T extends Cols> {
  constructor(
    public data: Dataframe<T>,
    public factor: Accessor<Factor>,
    public composer: Composer<any, any, any>,
    public parent?: Partition<any>
  ) {}

  compute = () => {
    const { data, composer } = this;
    const factor = this.factor();

    const indices = Array.from(factor.indices);

    const firstRowCases = factor.indexPositions[indices[0]];
    let part = new Part(data, firstRowCases, composer);
    const resultData = Dataframe.fromRow(part.compute());

    for (let i = 1; i < indices.length; i++) {
      part = new Part(data, factor.indexPositions[indices[i]], composer);
      resultData.push(part.compute());
    }

    return resultData;
  };
}
