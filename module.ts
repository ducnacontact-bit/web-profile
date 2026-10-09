import { module } from "@prisma/composer";
import { rawPostgres } from "@prisma/composer-prisma-cloud";
import nextjsService from "./src/service.ts"; // hoặc file service dịch vụ ứng dụng của bạn

export default module("web-profile", ({ provision }) => {
  const db = provision(rawPostgres({ name: "database" }));
  provision(nextjsService, { deps: { db } });
});
