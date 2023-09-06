import { Disc, Num, Scalar } from "./structs/Scalar";
import { Dict, Primitive } from "./types";

// Basic meta functions
export const nothing = () => undefined;
export const just = (x: any) => () => x;
export const call = (fn: Function) => fn();
export const identity = <T>(x: T) => x;
export const secondArgument = <T>(x: any, y: T) => y;
export const POJO = () => ({});
export const flow = (...fns: Function[]) => {
  return (x?: any) => fns.reduce((res, nextFn) => nextFn(res), x);
};

// Unary functions
export const toInt = (x: string) => parseInt(x, 10);
export const isPrimitive = (x: any): x is Primitive => {
  return ["number", "string", "boolean"].includes(typeof x);
};
export const isScalar = (x: any): x is Scalar<any> => {
  return x instanceof Num || x instanceof Disc;
};
export const unwrap = <T>(x: Scalar<T>) => x.value();

// Binary functions
export const diff = (x: number, y: number) => x - y;
export const sum = (x: number, y: number) => x + y;

// Array functions
export const minMax = (x: number[]) => {
  return x.reduce(
    ([min, max], e) => [Math.min(min, e), Math.max(max, e)],
    [Infinity, -Infinity]
  );
};
export const summarizeNumeric = (x: number[]) => {
  const result = { n: x.length, min: Infinity, max: -Infinity, sum: 0 };

  for (const v of x) {
    result.min = Math.min(result.min, v);
    result.max = Math.max(result.max, v);
    result.sum += v;
  }

  return result;
};

export const getData = async (path: string) => {
  const result = await fetch(path);
  return await result.json();
};

const collatorOpts = { numeric: true, sensitivity: "base" } as const;
const collator = new Intl.Collator(undefined, collatorOpts);
export const sortStrings = (x: string[]) => x.sort(collator.compare);

// Object functions
export const keys = <T extends Dict, K extends keyof T>(x: T) => {
  return Object.keys(x) as K[];
};
export const values = <T extends Dict, K extends keyof T>(x: T) => {
  return Object.values(x) as T[K][];
};
export const entries = <T extends Dict, K extends keyof T>(x: T) => {
  return Object.entries(x) as { [key in K]: [key, T[key]] }[K][];
};
export const firstKey = <T extends Dict>(x: T) => Object.keys(x)[0] as keyof T;
export const firstProp = <T extends Dict>(x: T) => x[firstKey(x)];

export const unwrapAll = <T extends Record<string, Scalar<any>>>(x: T) => {
  const result = {} as Dict;
  for (const [k, v] of entries(x)) {
    if (!v?.value) continue;
    result[k as string] = v.value();
  }
  return result;
};

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
