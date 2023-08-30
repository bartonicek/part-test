import { Dict } from "./types";

export const identity = <T>(x: T) => x;
export const secondArgument = <T>(x: any, y: T) => y;
export const POJO = () => ({});

export const diff = (x: number, y: number) => x - y;

export const minMax = (x: number[]) => {
  return x.reduce(
    ([min, max], e) => [Math.min(min, e), Math.max(max, e)],
    [Infinity, -Infinity]
  );
};
export const summarizeNumeric = (x: number[]) => {
  const result = { n: x.length, min: Infinity, max: -Infinity, sum: 0 };

  for (const v of x.values()) {
    result.min = Math.min(result.min, v);
    result.max = Math.max(result.max, v);
    result.sum += v;
  }

  return result;
};

const collatorOpts = { numeric: true, sensitivity: "base" } as const;
const collator = new Intl.Collator(undefined, collatorOpts);
export const sortStrings = (x: string[]) => x.sort(collator.compare);

export const disjointUnion = <T extends Dict, U extends Dict>(
  object1: T,
  object2: U,
  options?: { keepSecond?: Set<string> }
): T & U => {
  const result = {} as T & U;

  for (const [key, value] of Object.entries(object1)) {
    if (options?.keepSecond?.has(key)) continue;
    result[key as keyof T] = value;
  }

  for (const [key, value] of Object.entries(object2)) {
    if (key in result) {
      const name = key.match(/[a-zA-Z]+/g)?.[0] ?? "default";
      const number = parseInt(key.match(/\d+$/)?.[0] ?? "0", 10);

      const oldKey = (name + number) as keyof U;
      const newKey = (name + (number + 1)) as keyof U;

      result[oldKey] = result[key];
      result[newKey] = value;
      delete result[key];

      continue;
    }

    result[key as keyof U] = value;
  }

  return result;
};
