import { Condition, ConditionImpl } from "./conditions";

export type RootField<A, B> = null extends B
  ? NullableField<A, B>
  : Field<A, B>;

export interface Field<R, T> {
  eq(t: T): Condition<R>;
}

export interface NullableField<R, T> extends Field<R, T> {
  isNull(): Condition<R>;
  isNotNull(): Condition<R>;
}

export class FieldImpl<R, T> implements Field<R, T>, NullableField<R, T> {
  constructor(private name: string) {}

  eq(t: T): Condition<R> {
    return new ConditionImpl<T>({
      __kind: "comparison",
      __comparison_type: "eq",
      value: t,
      fieldName: this.name,
    });
  }

  isNull(): Condition<R> {
    return new ConditionImpl<T>({
      __kind: "nullcheck",
      isNull: true,
      fieldName: this.name,
    });
  }

  isNotNull(): Condition<R> {
    return new ConditionImpl<T>({
      __kind: "nullcheck",
      isNull: false,
      fieldName: this.name,
    });
  }
}
