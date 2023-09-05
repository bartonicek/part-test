import { createEffect, createSignal } from "solid-js";
import { SignalStore } from "./SignalStore";
import { getData } from "./funs";
import { Num, disc, num } from "./structs/Scalar";
import "./style.css";
import Composer from "./wrangling/Composer";
import Dataframe from "./wrangling/Dataframe";
import Marker, { Group } from "./wrangling/Marker";
import Wrangler from "./wrangling/Wrangler";
import Scene from "./dom/scene/Scene";

const mpg = await getData("./testData/mpg.json");
const dataMpg = Dataframe.parseCols(mpg, {
  hwy: "num",
  manufacturer: "disc",
});

const store = SignalStore.fromSignal(dataMpg.colSignal);
createEffect(() => {
  console.log(store.getters.hwy());
});

dataMpg.push({ hwy: num(500), manufacturer: disc("audi") });
dataMpg.push({ hwy: num(500), manufacturer: disc("audi") });

// const store = SignalStore.fromDict(dataMpg.cols);
// const composer1 = Composer.default<{ var2: Num }>()
//   .setReducer(
//     ({ sum1 }, { var2 }) => ({ sum1: sum1.add(var2) }),
//     () => ({ sum1: num(0) })
//   )
//   .setMapfn(({ sum1, level }) => ({ y1: sum1, x0: level }))
//   .setStacker(
//     (parent, part) => ({ y1: parent.y1.add(part.y1) }),
//     () => ({ y1: num(0) })
//   );

// const wrangler1 = new Wrangler(
//   dataMpg.select({ var1: "manufacturer", var2: "hwy" }),
//   store,
//   composer1
// );

// const app = document.querySelector("#app") as HTMLDivElement;
// // const scene1 = new Scene(app, () => dataMpg);

// // const n = () => 10;
// // const [cases, setCases] = createSignal([] as number[]);
// // const [group, setGroup] = createSignal(1);

// // const marker1 = new Marker(n, cases, group);
