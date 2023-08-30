import { Dataframe } from "./Dataframe";
import { Factor } from "./structs/Factor";
import { Part } from "./Part";
import "./style.css";
import { Scalar } from "./structs/Scalar";

// export const stackSymbol = Symbol("stack");

// const data1 = new Dataframe([
//   { name: "Adam", age: 28 },
//   { name: "Adam", age: 31 },
//   { name: "Nela", age: 22 },
//   { name: "Nela", age: 25 },
//   { name: "Nela", age: 27 },
// ]);

// const factor1 = Factor.from(["a", "a", "b", "c", "b", "a"]);

// console.log(factor1.indexSets);

// const part0 = new Part(data1, [0, 1, 2, 3, 4]);
// const part1 = new Part(data1, [0, 1, 2], part0);
// const part2 = new Part(data1, [3, 4], part0);

// const parts = [part0, part1, part2];
// parts.forEach((part) => {
//   part
//     .setReducer(
//       ({ s1, s2 }, { age, name }) => ({ s1: s1 + age, s2: s2 + name }),
//       () => ({ s1: 0, s2: "" })
//     )
//     .setMapfn(({ s1, s2 }) => ({ elol: s1, elololo: s2 }))
//     .setStacker(
//       (parent, part) => ({ elol: parent.elol + part.elol }),
//       () => ({ elol: 0 })
//     )
//     .update();
// });

// parts.forEach((e) => console.log(e.computed()));

const gender = ["male", "male", "female", "male", "female"];
const group = ["A", "B", "B", "A", "B"];

const gef = Factor.from(gender);
const grf = Factor.from(group);

console.log(Factor.product(gef, grf));
