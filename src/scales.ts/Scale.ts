import { Value } from "../structs/ValueLike";

export type Scale<T> = {
  pushforward: (x: T) => number;
  pullback: (x: number) => T;
};
