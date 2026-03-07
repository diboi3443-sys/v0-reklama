import { AppShell } from "@/components/app-shell"
import { PresetsContent } from "@/components/presets-content"

export const metadata = {
  title: "Animation Presets - v0-reklama",
  description: "400+ ready-to-use animation presets for your videos",
}

export default function PresetsPage() {
  return (
    <AppShell>
      <PresetsContent />
    </AppShell>
  )
}
