"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Plus, Video, User, Sparkles, Cat } from "lucide-react"

type Influencer = {
  id: string
  name: string
  type: "human" | "fantasy" | "animal" | "custom"
  image: string
  videoCount: number
}

const mockInfluencers: Influencer[] = [
  { id: "1", name: "Sophia", type: "human", image: "/images/influencer-1.jpg", videoCount: 24 },
  { id: "2", name: "Marcus", type: "human", image: "/images/influencer-2.jpg", videoCount: 12 },
  { id: "3", name: "Aelara", type: "fantasy", image: "/images/influencer-3.jpg", videoCount: 8 },
  { id: "4", name: "Kitsune", type: "animal", image: "/images/influencer-4.jpg", videoCount: 15 },
  { id: "5", name: "Yuki", type: "human", image: "/images/influencer-5.jpg", videoCount: 31 },
  { id: "6", name: "Nexus-7", type: "custom", image: "/images/influencer-6.jpg", videoCount: 5 },
]

const typeIcons = {
  human: User,
  fantasy: Sparkles,
  animal: Cat,
  custom: Sparkles,
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
          : "border border-[#D4A853]/10 bg-[#D4A853]/5 text-muted-foreground hover:border-[#D4A853]/20 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

function InfluencerCard({ influencer, priority = false }: { influencer: Influencer; priority?: boolean }) {
  const { t } = useI18n()
  const TypeIcon = typeIcons[influencer.type]

  return (
    <Link
      href={`/influencers/${influencer.id}/studio`}
      className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={influencer.image}
          alt={influencer.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/20 to-transparent" />
        
        {/* Type badge */}
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4A853]/20 bg-[#050507]/60 backdrop-blur-sm">
          <TypeIcon className="h-4 w-4 text-[#D4A853]" />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-semibold text-foreground">{influencer.name}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Video className="h-3.5 w-3.5" />
          <span>{influencer.videoCount} {t("influencersPage.videos")}</span>
        </div>
      </div>
    </Link>
  )
}

export function InfluencersContent() {
  const { t } = useI18n()
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const filters = [
    { id: "all", label: t("influencersPage.all") },
    { id: "human", label: t("influencersPage.human") },
    { id: "fantasy", label: t("influencersPage.fantasy") },
    { id: "animal", label: t("influencersPage.animal") },
    { id: "custom", label: t("influencersPage.custom") },
  ]

  const filteredInfluencers = activeFilter === "all"
    ? mockInfluencers
    : mockInfluencers.filter((i) => i.type === activeFilter)

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            {t("influencersPage.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("influencersPage.subtitle")}</p>
        </div>
        <Link
          href="/influencers/create"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-6 py-3 text-sm font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/15 transition-all hover:shadow-[#D4A853]/25"
        >
          <Plus className="h-4 w-4" />
          {t("influencersPage.createNew")}
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <FilterButton
            key={filter.id}
            active={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </FilterButton>
        ))}
      </div>

      {/* Grid */}
      {filteredInfluencers.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filteredInfluencers.map((influencer, index) => (
            <InfluencerCard key={influencer.id} influencer={influencer} priority={index < 6} />
          ))}
          
          {/* Create new card */}
          <Link
            href="/influencers/create"
            className="group flex aspect-[3/4] items-center justify-center rounded-2xl border-2 border-dashed border-[#D4A853]/20 bg-[#D4A853]/5 transition-all hover:border-[#D4A853]/40 hover:bg-[#D4A853]/10"
          >
            <div className="flex flex-col items-center gap-3 text-[#D4A853]/60 transition-colors group-hover:text-[#D4A853]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4A853]/20 bg-[#D4A853]/10">
                <Plus className="h-7 w-7" />
              </div>
              <span className="text-sm font-medium">{t("influencersPage.createNew")}</span>
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D4A853]/10 bg-[#D4A853]/5">
            <User className="h-10 w-10 text-[#D4A853]/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{t("influencersPage.noInfluencers")}</h3>
          <p className="mt-2 text-muted-foreground">{t("influencersPage.startCreating")}</p>
          <Link
            href="/influencers/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-6 py-3 text-sm font-semibold text-[#050507]"
          >
            <Plus className="h-4 w-4" />
            {t("influencersPage.createNew")}
          </Link>
        </div>
      )}
    </div>
  )
}
