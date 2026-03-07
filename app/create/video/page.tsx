import { AppShell } from "@/components/app-shell"
import { VideoContentV2 } from "@/components/video-content-v2"

export const metadata = {
  title: "Video Generator - v0-reklama",
  description: "Create cinematic AI videos with presets",
}

export default function VideoPage() {
  return (
    <AppShell>
      <VideoContentV2 />
    </AppShell>
  )
}
