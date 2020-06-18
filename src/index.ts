import { Repo, RepoImpl } from "./SloaneOrm";

interface User {
  name: string;
  id: number;
  title?: string;
}

function Test(r: Repo<User>) {
  r.query((row) => row.id.eq(1));
}

Test(new RepoImpl<User>("users"));
