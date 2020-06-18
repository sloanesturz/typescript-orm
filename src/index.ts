import { Table, TableImpl } from "./orm/table";
import { ConnectionImpl } from "./orm/connection";

interface User {
  name: string;
  id: number;
  title: string | null;
}

const Users: Table<User> = new TableImpl<User>("users");
const connection = new ConnectionImpl();

// Null checks:
connection.execute(Users.query().title.isNotNull());
// connection.execute(Users.query().name.isNotNull()); // this won't compile because it is non-nullable

// comparisons:
connection.execute(Users.query().name.eq("sloane"));
// connection.execute(Users.query().name.eq(123)); // won't compile because wrong type

// ands
connection.execute(
  Users.query().name.eq("sloane").and(Users.query().title.isNotNull())
);
