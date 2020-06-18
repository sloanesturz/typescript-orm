import { RootField, FieldImpl } from "./fields";
import { Condition, Chunk } from "./conditions";

export type Query<A> = {
  [K in keyof A]: RootField<A, A[K]>;
};

export interface Repo<R> {
  query(fn: (x: Query<R>) => Condition<R>): Promise<R[]>;
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

  query(fn: (x: Query<T>) => Condition<T>): Promise<T[]> {
    const p = new Proxy(
      {},
      {
        get: function (target, name, receiver) {
          return new FieldImpl(name as string);
        },
      }
    );

    const condition = this.toString(fn(p as any).clause);

    // For now, just print out the string
    const q = `SELECT * FROM ${this.tableName} WHERE ${condition}`;
    console.log(q);

    return Promise.resolve([]);
  }
}
