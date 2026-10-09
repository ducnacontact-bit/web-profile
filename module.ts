import { module } from "@prisma/composer";
import { rawPostgres } from "@prisma/composer-prisma-cloud";
import nextjsService from "service.mjs";

export default module("web-profile", ({ provision }) => {
  const db = provision(rawPostgres({ name: "database" }));
  provision(nextjsService, { deps: { db } });
});
