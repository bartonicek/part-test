import { createSignal } from "solid-js";
import { Composer } from "./Composer";
import { Dataframe } from "./Dataframe";
import { Partition } from "./Partition";
import { SignalStore } from "./SignalStore";
import { Wrangler } from "./Wrangler";
import { getData, keys } from "./funs";
import { Factor } from "./structs/Factor";
import { Num, disc, num } from "./structs/Scalar";
import { DiscArray, NumArray } from "./structs/Variable";
import "./style.css";
import { Expanse, ExpanseSetter } from "./scales.ts/Expanse";
import { Signal } from "./structs/ValueLike";
import { ScaleContinuous, ScaleDiscrete } from "./scales.ts/Scale";
import { Plot } from "./dom/Plots";

const mpg = await getData("./testData/mpg.json");
const dataMpg = Dataframe.parseCols(mpg, {
  hwy: "num",
  manufacturer: "disc",
});

const store = SignalStore.fromDict(dataMpg.cols);
const composer1 = Composer.default<{ var2: Num }>()
  .setReducer(
    ({ sum1 }, { var2 }) => ({ sum1: sum1.add(var2) }),
    () => ({ sum1: num(0) })
  )
  .setMapfn(({ sum1, level }) => ({ y1: sum1, x0: level }))
  .setStacker(
    (parent, part) => ({ y1: parent.y1.add(part.y1) }),
    () => ({ y1: num(0) })
  );

const wrangler1 = new Wrangler(
  dataMpg.select({ var1: "manufacturer", var2: "hwy" }),
  store,
  composer1
);

const [lwr, setLwr] = createSignal(0);
const [upr, setUpr] = createSignal(100);

const [lwr2, setLwr2] = createSignal(0.1);
const [upr2, setUpr2] = createSignal(0.9);

const [lwr3, setLwr3] = createSignal(0);
const [upr3, setUpr3] = createSignal(500);

const domain = new Expanse(lwr, upr);
const codomain = new Expanse(lwr3, upr3);
const expand = new Expanse(lwr2, upr2);

const scale1 = new ScaleContinuous(domain, codomain, expand);

const [gender, setGender] = createSignal(["m", "f"]);

const scale2 = new ScaleDiscrete(gender, codomain, expand);

const expandSetter = new ExpanseSetter(setLwr2, setUpr2);
expandSetter.freezeLower();

console.log(expand.range());
expandSetter.setLower(-0.1);
console.log(expand.range());

const f = { a: 1, b: 2, 3: 4 };
const keys1 = keys(f);

for (const key of keys(f)) f[key] = 0;
