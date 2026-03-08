import { Inngest } from "inngest";

// Inngest API ключи
export const inngest = new Inngest({
  id: "v0-reklama",
  eventKey: process.env.INNGEST_EVENT_KEY || "AW1fekapW7zfQJ6_L0tH2wX-NTdlMl0GPcjjsWOR4Ardr_VwM313se8UnGVa2YXntub7ga9ilHqN6mrB5oHE9A",
  signingKey: process.env.INNGEST_SIGNING_KEY || "signkey-prod-bd6b9ca373d9b1baa251a3bdd2fc88b1fc2a3f20d339c9e0fbafddb2d4e85a39",
});
