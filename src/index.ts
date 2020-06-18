import { Repo, RepoImpl } from "./orm/repo";

interface User {
  name: string;
  id: number;
  title: string | null;
}

const repo: Repo<User> = new RepoImpl<User>("users");

// Null checks:
repo.query((row) => row.title.isNotNull());
repo.query((row) => row.name.isNull()); // this won't compile because it is non-nullable

// comparisons:
repo.query((row) => row.name.eq("sloane"));
repo.query((row) => row.name.eq(123)); // won't compile because wrong type

// ands
repo.query((row) =>
  row.name.eq("sloane").and(row.title.isNotNull()).and(row.id.eq(3))
);
