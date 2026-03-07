import { AppShell } from "@/components/app-shell"
import { VideoContentV2 } from "@/components/video-content-v2"
import { Suspense } from "react"

export const metadata = {
  title: "Video Generator - v0-reklama",
  description: "Create cinematic AI videos with presets",
}

// Force dynamic rendering (component uses useSearchParams)
export const dynamic = 'force-dynamic'

export default function VideoPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-[#f0ece4]/60">Загрузка...</div>
        </div>
      }>
        <VideoContentV2 />
      </Suspense>
    </AppShell>
  )
}
