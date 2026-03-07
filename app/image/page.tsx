import { AppShell } from "@/components/app-shell"
import { ImageContentV2 } from "@/components/image-content-v2"

export const metadata = {
  title: "Image Generator - v0-reklama",
  description: "Generate stunning images with AI",
}

export default function ImagePage() {
  return (
    <AppShell>
      <ImageContentV2 />
    </AppShell>
  )
}
