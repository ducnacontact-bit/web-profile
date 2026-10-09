// @ts-check
import { module } from "@prisma/composer";
import myProfileService from "./service.mjs";

export default module("my-profile", ({ provision }) => {
  provision(myProfileService, { id: "myprofile" });
});
