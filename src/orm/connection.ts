import { Condition, Chunk } from "./conditions";

interface Connection {
  execute<T>(condition: Condition<T>): Promise<T[]>;
}

export class ConnectionImpl {
  private asString<T>(c: Chunk<T>): string {
    if (c.__kind == "comparison") {
      if (c.__comparison_type === "eq") {
        return `${c.fieldName} = ${c.value}`;
      } else {
        return `${c.fieldName} > ${c.value}`;
      }
    } else if (c.__kind === "boolean") {
      if (c.__boolean_type === "or") {
        return `${this.asString(c.lhs)} OR ${this.asString(c.rhs)}`;
      } else if (c.__boolean_type === "and") {
        return `${this.asString(c.lhs)} AND ${this.asString(c.rhs)}`;
      }
    }
    return ""; // can't happen
  }

  execute<T>(condition: Condition<T>): Promise<T[]> {
    const where = this.asString(condition.clause);
    const query = `select * from ${condition.tableName} where ${where}`;
    console.log(query);
    return Promise.resolve([]);
  }
}
