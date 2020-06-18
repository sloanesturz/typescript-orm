export interface Query<T> {}

type Chunk<R> = Comparison<R, any> | BooleanLogic<R, any>;

interface ConditionI<T> {
  clause: Chunk<T>;

  and(other: ConditionI<T>): ConditionI<T>;
}

export interface Comparison<R, T> {
  __kind: "comparison";

  __comparison_type: "eq" | "gt";
  value: T;
  fieldName: string;
}

export interface BooleanLogic<R, T> {
  __kind: "boolean";

  __boolean_type: "and" | "or";
  lhs: Chunk<R>;
  rhs: Chunk<R>;
}

class ConditionImpl<T> implements ConditionI<T> {
  constructor(public clause: Chunk<T>) {}

  and(other: ConditionI<T>): ConditionI<T> {
    return new ConditionImpl<T>({
      __kind: "boolean",
      __boolean_type: "and",
      lhs: this.clause,
      rhs: other.clause,
    });
  }
}

export interface Repo<R> {
  query(fn: (x: Query<R> & S1<R>) => ConditionI<R>): Promise<R[]>;
}

export interface Field<R, T> {
  eq(t: T): ConditionI<R>;
}

export type S1<A> = {
  [K in keyof A]: Field<A, A[K]>;
};

class FieldImpl<R, T> implements Field<R, T> {
  constructor(private name: string) {}

  eq(t: T): ConditionI<R> {
    return new ConditionImpl<T>({
      __kind: "comparison",
      __comparison_type: "eq",
      value: t,
      fieldName: this.name,
    });
  }
}

export class RepoImpl<T> implements Repo<T> {
  constructor(private tableName: string) {}

  private toString(c: Chunk<T>): string {
    if (c.__kind == "comparison") {
      if (c.__comparison_type === "eq") {
        return `${c.fieldName} = ${c.value}`;
      } else {
        return `${c.fieldName} > ${c.value}`;
      }
    } else if (c.__kind === "boolean") {
      if (c.__boolean_type === "or") {
        return `${this.toString(c.lhs)} OR ${this.toString(c.rhs)}`;
      } else if (c.__boolean_type === "and") {
        return `${this.toString(c.lhs)} AND ${this.toString(c.rhs)}`;
      }
    }
    return ""; // can't happen
  }

  query(fn: (x: Query<T> & S1<T>) => ConditionI<T>): Promise<T[]> {
    const p = new Proxy(
      {},
      {
        get: function (target, name, receiver) {
          return new FieldImpl(name as string);
        },
      }
    );

    const condition = this.toString(fn(p as any).clause);

    const q = `SELECT * FROM ${this.tableName} WHERE ${condition}`;
    console.log(q);

    return Promise.resolve([]);
  }
}
