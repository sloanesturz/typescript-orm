import { RootField, FieldImpl } from "./fields";
import { Condition, Chunk } from "./conditions";

export type Query<A> = {
  [K in keyof A]: RootField<A, A[K]>;
};

export interface Table<R> {
  query(): Query<R>;
}

export class TableImpl<T> implements Table<T> {
  constructor(private tableName: string) {}

  query(): Query<T> {
    const that = this;

    const p = new Proxy(
      {},
      {
        get: function (target, name, receiver) {
          return new FieldImpl(name as string, that.tableName);
        },
      }
    );

    return p as Query<T>;
  }
}
