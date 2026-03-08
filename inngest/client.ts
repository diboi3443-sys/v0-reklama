import { Inngest } from "inngest";

// Inngest API ключи
// Получить можно на https://app.inngest.com/
export const inngest = new Inngest({
  id: "v0-reklama",
  // Используем EVENT_KEY если есть, иначе SIGNING_KEY (для dev)
  eventKey: process.env.INNGEST_EVENT_KEY || process.env.INNGEST_SIGNING_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
