import { Accessor, Setter } from "solid-js";
import { Composer } from "./Composer";
import { Dataframe } from "./Dataframe";
import { Partition } from "./Partition";
import { SignalStore } from "./SignalStore";
import { Variable } from "./structs/Variable";
import { Col, Cols, MapFn } from "./types";

export class Wrangler<T extends Cols> {
  partitions: Partition<T>[];

  constructor(
    public data: Dataframe<T>,
    public store: SignalStore<any, any>,
    public composer: Composer<any, any, any>
  ) {
    this.partitions = [];
  }
}
