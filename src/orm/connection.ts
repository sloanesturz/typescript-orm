import { Condition, Chunk } from "./conditions";

interface Connection {
  execute<T>(condition: Condition<T>): Promise<T[]>;
}

export class ConnectionImpl {
  private asString<T>(c: Chunk<T>): string {
    switch (c.__kind) {
      case "comparison":
        if (c.__comparison_type === "eq") {
          return `${c.fieldName} = ${c.value}`;
        } else {
          return `${c.fieldName} > ${c.value}`;
        }
      case "boolean":
        if (c.__boolean_type === "or") {
          return `${this.asString(c.lhs)} OR ${this.asString(c.rhs)}`;
        } else {
          return `${this.asString(c.lhs)} AND ${this.asString(c.rhs)}`;
        }
      case "nullcheck":
        if (c.isNull) {
          return `${c.fieldName} IS NULL`;
        } else {
          return `${c.fieldName} IS NOT NULL`;
        }
    }
  }

  execute<T>(condition: Condition<T>): Promise<T[]> {
    const where = this.asString(condition.clause);
    const query = `select * from ${condition.tableName} where ${where}`;
    console.log(query);
    return Promise.resolve([]);
  }
}
