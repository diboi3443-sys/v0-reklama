import { Inngest } from "inngest";

// Inngest API ключи
// Получить можно на https://app.inngest.com/
export const inngest = new Inngest({
  id: "v0-reklama",
  eventKey: process.env.INNGEST_EVENT_KEY,
  // Для продакшна на Vercel добавь signingKey:
  signingKey: process.env.INNGEST_SIGNING_KEY || "a_o-Gz2tWM6NJ39AWUBpfkpHvu2acgXRftiQDsfxL_eZrQmsAiikAKQYeCNJnUl_q5eamhP_h_CkVGAhQXAtAg",
});
