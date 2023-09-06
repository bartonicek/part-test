import { Accessor, Setter, createEffect, createSignal } from "solid-js";
import { Getters, Setters, SignalStore } from "./SignalStore";
import {
  entries,
  firstKey,
  firstProp,
  getData,
  isPrimitive,
  keys,
  nothing,
  unwrapAll,
} from "./funs";
import { Num, disc, num } from "./structs/Scalar";
import "./style.css";
import Composer from "./wrangling/Composer";
import Dataframe from "./wrangling/Dataframe";
import Marker, { Group } from "./wrangling/Marker";
import Wrangler from "./wrangling/Wrangler";
import Scene from "./dom/scene/Scene";
import Factor from "./structs/Factor";
import { Dict, Fn, PickByValue, PickType, Primitive } from "./types";
import DataStore from "./DataStore";

const mpg = await getData("./testData/mpg.json");
const dataMpg = Dataframe.parseCols(mpg, {
  hwy: "num",
  manufacturer: "disc",
}).select({ var2: "manufacturer", var1: "hwy" });
// createEffect(() => {
//   console.log(dataMpg.signal().rowUnwrap(0));
// });
// dataMpg.push({ hwy: num(500), manufacturer: disc("audi") });
// dataMpg.push({ hwy: num(500), manufacturer: disc("audi") });

const store = DataStore.fromDataSignal(dataMpg.signal)
  .bind({ width: num(5), anchor: num(0) })
  .bind({
    bins: ({ var1, width, anchor }) => var1().bin(width(), anchor()),
  });

const composer1 = Composer.default<{ var1: Num }>()
  .setReducer(
    ({ sum1 }, { var1 }) => ({ sum1: sum1.add(var1) }),
    () => ({ sum1: num(0) })
  )
  .setMapfn(({ sum1, binMin, binMax }) => ({
    y0: num(0),
    y1: sum1,
    x0: binMin,
    x1: binMax,
  }))
  .setStacker(
    (parent, part) => ({ y1: parent.y1.add(part.y1) }),
    () => ({ y1: num(0) })
  );

const wrangler1 = new Wrangler(dataMpg, store.getters, composer1).partitionBy(
  ({ whole, bins }) => [whole, bins]
);

console.log(wrangler1.partitions[1].computed().unwrapRows());
