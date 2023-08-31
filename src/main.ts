import { Dataframe } from "./Dataframe";
import { Factor } from "./structs/Factor";
import { Part } from "./Part";
import "./style.css";
import { Scalar, num, str } from "./structs/Scalar";
import { Discrete, Numeric } from "./structs/Variable";
import { ScalarOf } from "./types";
import { entries, keys, values } from "./funs";
import { Partition } from "./Partition";

const data1 = new Dataframe({
  gender: new Discrete(["m", "m", "f", "f", "m", "f"]),
  income: new Numeric([100, 200, 150, 300, 400, 200]),
  age: new Numeric([29, 30, 37, 21, 32, 35]),
});

const f = () => Factor.from(["m", "m", "f", "f", "m", "f"]);

console.log(f().indices);

const partition1 = new Partition(data1, f);
const data2 = partition1.compute();

console.log(data2.rowUnwrapped(2));

// const c = data1.cols;
// const row1 = data1.row(0);

// const part0 = new Part(data1, [0, 1, 2, 3, 4]);
// const part1 = new Part(data1, [0, 1, 2], part0);
// const part2 = new Part(data1, [3, 4], part0);

// const parts = [part0, part1, part2];
// parts.forEach((part) => {
//   part
//     .setReducer(
//       ({ s1 }, { age }) => ({
//         s1: s1.add(age),
//       }),
//       () => ({ s1: num(0) })
//     )
//     .setMapfn(({ s1 }) => ({ x0: s1 }))
//     .setStacker(
//       (parent, part) => ({ x0: parent.x0.add(part.x0) }),
//       () => ({ x0: num(0) })
//     )
//     .update();
// });

// const x = part0;

// for (const part of parts) {
//   for (const val of values(part.computed())) console.log(val.value());
// }

// const gender = ["male", "male", "female", "male", "female"];
// const group = ["A", "B", "B", "A", "B"];

// const gef = Factor.from(gender);
// const grf = Factor.from(group);

// console.log(Factor.product(gef, grf));
