export interface Query<T> {}

type Condition<R> = Comparison<R, any>;

export interface Comparison<R, T> {
  __kind: "comparison";

  __comparison_type: "eq" | "gt";
  value: T;
  fieldName: string;
}

export interface Repo<R> {
  query(fn: (x: Query<R> & S1<R>) => Condition<R>): Promise<R[]>;
}

export interface Field<R, T> {
  eq(t: T): Comparison<R, T>;
}

export type S1<A> = {
  [K in keyof A]: Field<A, A[K]>;
};

class FieldImpl<R, T> implements Field<R, T> {
  constructor(private name: string) {}

  eq(t: T): Comparison<R, T> {
    return {
      __kind: "comparison",
      __comparison_type: "eq",
      value: t,
      fieldName: this.name,
    };
  }
}

export class RepoImpl<T> implements Repo<T> {
  constructor(private tableName: string) {}

  private toString(c: Condition<T>): string {
    if (c.__kind == "comparison") {
      if (c.__comparison_type === "eq") {
        return `${c.fieldName} = ${c.value}`;
      } else {
        return `${c.fieldName} > ${c.value}`;
      }
    }
    return ""; // not possible
  }

  query(fn: (x: Query<T> & S1<T>) => Condition<T>): Promise<T[]> {
    const p = new Proxy(
      {},
      {
        get: function (target, name, receiver) {
          return new FieldImpl(name as string);
        },
      }
    );

    const condition = this.toString(fn(p as any));

    const q = `SELECT * FROM ${this.tableName} WHERE ${condition}`;
    console.log(q);

    return Promise.resolve([]);
  }
}
