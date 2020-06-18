export interface Condition<T> {
  clause: Chunk<T>;

  and(other: Condition<T>): Condition<T>;
}

export type Chunk<R> =
  | Comparison<R, any>
  | BooleanLogic<R, any>
  | NullCheck<R, any>;

export interface Comparison<R, T> {
  __kind: "comparison";

  __comparison_type: "eq" | "gt";
  value: T;
  fieldName: string;
}

export interface NullCheck<R, T> {
  __kind: "nullcheck";

  fieldName: string;
  isNull: boolean;
}

export interface BooleanLogic<R, T> {
  __kind: "boolean";

  __boolean_type: "and" | "or";
  lhs: Chunk<R>;
  rhs: Chunk<R>;
}

export class ConditionImpl<T> implements Condition<T> {
  constructor(public clause: Chunk<T>) {}

  and(other: Condition<T>): Condition<T> {
    return new ConditionImpl<T>({
      __kind: "boolean",
      __boolean_type: "and",
      lhs: this.clause,
      rhs: other.clause,
    });
  }
}
