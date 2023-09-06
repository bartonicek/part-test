import {
  Accessor,
  Setter,
  createEffect,
  createSignal,
  untrack,
} from "solid-js";
import Factor from "../structs/Factor";

export const Group = {
  Group1T: 4,
  Group2T: 3,
  Group3T: 2,
  Group4T: 1,
  Group1: 132,
  Group2: 131,
  Group3: 130,
  Group4: 129,
} as const;

export const GroupLabels = {
  4: { group: 1, transient: true },
  3: { group: 2, transient: true },
  2: { group: 3, transient: true },
  1: { group: 4, transient: true },
  132: { group: 1, transient: false },
  131: { group: 2, transient: false },
  130: { group: 3, transient: false },
  129: { group: 4, transient: false },
} as const;

const groups = [4, 3, 2, 1, 132, 131, 130, 129];
const transientGroups = [4, 3, 2, 1];

const indices = new Set(groups);
const indexPositions = {
  4: new Set<number>(),
  3: new Set<number>(),
  2: new Set<number>(),
  1: new Set<number>(),
  132: new Set<number>(),
  131: new Set<number>(),
  130: new Set<number>(),
  129: new Set<number>(),
};

const transient = (x: number) => x & ~128;
const removeTransient = (x: number) => x | 128;

export default class Marker {
  indexArray: Accessor<number[]>;
  setIndexArray: Setter<number[]>;
  factor: Accessor<Factor>;

  transientCases: Set<number>;
  indexPositions: Record<number, Set<number>>;

  constructor(
    public n: Accessor<number>,
    public cases: Accessor<number[]>,
    public group: Accessor<number>
  ) {
    const [indexArray, setIndexArray] = createSignal(
      Array(this.n()).fill(Group.Group1)
    );
    this.indexArray = indexArray;
    this.setIndexArray = setIndexArray;

    this.transientCases = new Set();
    this.indexPositions = indexPositions;
    this.indexPositions[Group.Group1] = new Set(
      Array.from(Array(n()), (_, i) => i)
    );

    this.cases = cases;
    this.group = group;
    this.factor = () => {
      return new Factor(indices, indexArray(), indexPositions, GroupLabels, {});
    };

    createEffect(() => {
      const { indexPositions, transientCases } = this;
      const [cases, group] = [this.cases(), untrack(this.group)];
      const indexArray = [...untrack(this.indexArray)];

      if (!cases.length) return;

      for (const group of groups) {
        for (const i of cases) indexPositions[group].delete(i);
      }

      if (group === 1) {
        transientCases.clear();

        for (const i of cases) {
          const index = transient(indexArray[i]);
          indexArray[i] = index;
          indexPositions[index].add(i);
          transientCases.add(i);
        }
      } else {
        for (const i of cases) {
          indexArray[i] = group;
          indexPositions[group].add(i);
        }
      }

      this.setIndexArray(indexArray);
    });
  }

  clearAll = () => {
    const n = untrack(this.n);
    for (const group of groups) this.indexPositions[group].clear();
    for (let i = 0; i < n; i++) this.indexPositions[Group.Group1].add(i);
    this.setIndexArray(Array(this.n()).fill(Group.Group1));
  };

  clearTransient = () => {
    const { indexPositions, transientCases } = this;
    const indexArray = [...untrack(this.indexArray)];

    for (const group of transientGroups) indexPositions[group].clear();

    for (const i of transientCases) {
      indexArray[i] = removeTransient(indexArray[i]);
      indexPositions[Group.Group1].add(i);
    }

    this.setIndexArray(indexArray);
  };
}
