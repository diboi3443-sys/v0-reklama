import { AppShell } from "@/components/app-shell"
import { CharacterStudioContent } from "@/components/character-studio-content"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CharacterStudioPage({ params }: PageProps) {
  const { id } = await params

  return (
    <AppShell>
      <CharacterStudioContent characterId={id} />
    </AppShell>
  )
}
