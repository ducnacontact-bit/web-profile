// src/service.ts
import nextjs from "@prisma/composer/nextjs";
import { compute, rawPostgres } from "@prisma/composer-prisma-cloud";

export default compute({
  name: "my-profile",
  deps: { db: rawPostgres() },
  build: nextjs({ module: import.meta.url, appDir: ".." }),
});
