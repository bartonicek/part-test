import { Accessor, Setter } from "solid-js";
import { Getters, Setters, SignalStore } from "../SignalStore";
import Factor from "../structs/Factor";
import { Cols, PickType } from "../types";
import Composer from "./Composer";
import Dataframe from "./Dataframe";
import Partition from "./Partition";

export default class Wrangler<T extends Cols, U extends Getters> {
  partitions: Partition<any>[];

  constructor(
    public data: Dataframe<T>,
    public getters: U,
    public composer: Composer<any, any, any>
  ) {
    this.partitions = [];
  }

  partitionBy = (
    selectfn: (factors: PickType<U, Accessor<Factor>>) => Accessor<Factor>[]
  ) => {
    const { data, getters, composer } = this;
    const factors = selectfn(getters);
    let partition;

    for (const factor of factors) {
      partition = new Partition(data, factor, composer, partition);
      this.partitions.push(partition);
    }
    return this;
  };

  parts = (index: number) => this.partitions[index].computed();
}
