import { SignalStore } from "../SignalStore";
import { Cols } from "../types";
import Composer from "./Composer";
import Dataframe from "./Dataframe";
import Partition from "./Partition";

export default class Wrangler<T extends Cols> {
  partitions: Partition<T>[];

  constructor(
    public data: Dataframe<T>,
    public store: SignalStore<any, any>,
    public composer: Composer<any, any, any>
  ) {
    this.partitions = [];
  }
}
