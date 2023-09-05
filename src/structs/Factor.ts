import { diff, disjointUnion, minMax, sortStrings } from "../funs";
import { Primitive } from "../types";
import { Disc, disc, num } from "./Scalar";
import { Variable } from "./Variable";

export default class Factor implements Variable<string> {
  constructor(
    public indices: Set<number>,
    public indexArray: number[],
    public indexPositions: Record<number, Set<number>>,
    public indexLabels: Record<number, Record<string, any>>,
    public meta: Record<string, Primitive | Primitive[]>
  ) {}

  ith = (index: number) => {
    return Disc.fromValue(this.indexArray[index]);
  };

  push = (scalar: Disc) => {};

  static from = <T extends string | number>(array: T[], levels?: T[]) => {
    levels = levels ?? Array.from(new Set(array));
    const levs = levels.map((x) => x.toString());
    sortStrings(levs);

    const indices = new Set<number>();
    const indexArray: number[] = [];
    const indexPositons = {} as Record<number, Set<number>>;
    const indexLabels = {} as Record<number, Record<string, any>>;
    const labelIndexMap: Record<string, number> = {};

    let k = 0;

    for (const v of levs.values()) {
      if (!(v in labelIndexMap)) {
        labelIndexMap[v] = k;
        indices.add(k);
        k++;
      }
      const index = labelIndexMap[v];
      indexLabels[index] = { level: disc(v) };
      indexPositons[index] = new Set();
    }

    for (let i = 0; i < array.length; i++) {
      const index = labelIndexMap[array[i].toString()];
      indexPositons[index].add(i);
      indexArray.push(index);
    }

    const meta = { levels: levs };

    return new Factor(indices, indexArray, indexPositons, indexLabels, meta);
  };

  static bin = (
    array: number[],
    options?: { width?: number; anchor?: number }
  ) => {
    const [min, max] = minMax(array);

    let { width, anchor } = options ?? {};
    const nbins = width ? Math.ceil((max - min) / width) + 1 : 10;
    width = options?.width ?? (max - min) / (nbins - 1);
    anchor = options?.anchor ?? min;

    const breakMin = min - width + ((anchor - min) % width);
    const breakMax = max + width - ((max - anchor) % width);

    let indices = new Set<number>();
    const indexArray: number[] = [];
    const indexPositions = {} as Record<number, Set<number>>;
    const indexLabels = {} as Record<number, Record<string, any>>;

    const breaks = Array(nbins + 1);
    [breaks[0], breaks[breaks.length - 1]] = [breakMin, breakMax];

    for (let j = 0; j < breaks.length; j++) {
      breaks[j] = breakMin + j * width;

      if (j < 1) continue;
      indexPositions[j - 1] = new Set();
      indexLabels[j - 1] = {
        binMin: num(breaks[j - 1]),
        binMax: num(breaks[j]),
      };
    }

    for (let i = 0; i < array.length; i++) {
      const index = breaks.findIndex((br) => br >= array[i]) - 1;
      indices.add(index);
      indexArray.push(index);
      indexPositions[index].add(i);
    }

    const meta = { breaks };
    indices = new Set(Array.from(indices).sort(diff));

    return new Factor(indices, indexArray, indexPositions, indexLabels, meta);
  };

  static product = <T extends Factor, U extends Factor>(
    factor1: T,
    factor2: U,
    unionOpts?: { keepSecond?: Set<string> }
  ) => {
    const meta = disjointUnion(factor1.meta, factor2.meta, unionOpts);

    const { indexArray: f1is, indexLabels: f1labs } = factor1;
    const { indexArray: f2is, indexLabels: f2labs } = factor2;

    const indices = new Set<number>();
    const indexArray: number[] = [];
    const indexPositions = {} as Record<number, Set<number>>;
    const indexLabels = {} as Record<number, Record<string, any>>;

    for (let i = 0; i < factor1.indexArray.length; i++) {
      const [f1i, f2i] = [f1is[i], f2is[i]];
      const combinedIndex = parseInt([f1i, f2i].join("0"), 10);

      if (!(combinedIndex in indexPositions)) {
        indexPositions[combinedIndex] = new Set();
      }

      if (!(combinedIndex in indexLabels)) {
        const combinedLabel = disjointUnion(f1labs[f1i], f2labs[f2i]);
        indexLabels[combinedIndex] = combinedLabel;
      }

      indexPositions[combinedIndex].add(i);
      indices.add(combinedIndex);
      indexArray.push(combinedIndex);
    }

    return new Factor(indices, indexArray, indexPositions, indexLabels, meta);
  };
}
