import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { 
  generateImage, 
  generateVideo, 
  generateCharacterVideo 
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateImage,
    generateVideo,
    generateCharacterVideo,
  ],
});
