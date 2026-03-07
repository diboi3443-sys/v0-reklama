import { supabase } from '../lib/supabase'

const presets = [
  // Cinematic Presets
  {
    name: "Epic Zoom In",
    name_ru: "Эпичное приближение",
    slug: "epic-zoom-in",
    category: "cinematic",
    tags: ["zoom", "dramatic", "ad", "product"],
    description: "Dramatic slow zoom focusing attention on the subject",
    description_ru: "Драматическое медленное приближение, фокусирующее внимание на объекте",
    params: {
      cameraMotion: "zoom_in",
      speed: "slow",
      intensity: 0.7,
      duration: 5,
      easing: "ease-in-out",
    },
    preview_url: "/images/gallery-2.jpg",
    rating: 4.8,
    usage_count: 1234,
    is_featured: true,
    is_premium: false,
    min_tier: "free",
  },
  {
    name: "Dolly Out",
    name_ru: "Отъезд",
    slug: "dolly-out",
    category: "cinematic",
    tags: ["dolly", "reveal", "cinematic"],
    description: "Smooth camera pull-back revealing the scene",
    description_ru: "Плавный отъезд камеры, раскрывающий сцену",
    params: {
      cameraMotion: "dolly_out",
      speed: "medium",
      intensity: 0.8,
      duration: 6,
    },
    preview_url: "/images/gallery-3.jpg",
    rating: 4.6,
    usage_count: 987,
    is_featured: true,
    is_premium: false,
    min_tier: "free",
  },
  {
    name: "Orbit Left",
    name_ru: "Орбита влево",
    slug: "orbit-left",
    category: "cinematic",
    tags: ["orbit", "360", "product"],
    description: "Circular camera movement around the subject",
    description_ru: "Круговое движение камеры вокруг объекта",
    params: {
      cameraMotion: "orbit_left",
      speed: "medium",
      intensity: 0.9,
      duration: 8,
      angle: 180,
    },
    preview_url: "/images/gallery-4.jpg",
    rating: 4.9,
    usage_count: 2103,
    is_featured: false,
    is_premium: true,
    min_tier: "starter",
  },
  {
    name: "Crane Up",
    name_ru: "Подъём крана",
    slug: "crane-up",
    category: "cinematic",
    tags: ["crane", "vertical", "dramatic"],
    description: "Upward camera movement for grand reveals",
    description_ru: "Движение камеры вверх для грандиозных открытий",
    params: {
      cameraMotion: "crane_up",
      speed: "slow",
      intensity: 0.6,
      duration: 7,
    },
    preview_url: "/images/model-sora.jpg",
    rating: 4.7,
    usage_count: 654,
    is_featured: false,
    is_premium: true,
    min_tier: "pro",
  },

  // Social Media Presets
  {
    name: "TikTok Zoom",
    name_ru: "TikTok зум",
    slug: "tiktok-zoom",
    category: "social",
    tags: ["tiktok", "viral", "quick", "zoom"],
    description: "Fast punch-in zoom for viral content",
    description_ru: "Быстрое приближение для вирусного контента",
    params: {
      cameraMotion: "zoom_in",
      speed: "fast",
      intensity: 0.9,
      duration: 2,
      snap: true,
    },
    preview_url: "/images/gallery-5.jpg",
    rating: 4.5,
    usage_count: 3421,
    is_featured: true,
    is_premium: false,
    min_tier: "free",
  },
  {
    name: "Instagram Transition",
    name_ru: "Instagram переход",
    slug: "instagram-transition",
    category: "social",
    tags: ["instagram", "reels", "transition"],
    description: "Smooth transition effect for Instagram Reels",
    description_ru: "Плавный переход для Instagram Reels",
    params: {
      cameraMotion: "pan_right",
      speed: "medium",
      intensity: 0.7,
      duration: 3,
      blur: 0.5,
    },
    preview_url: "/images/gallery-6.jpg",
    rating: 4.6,
    usage_count: 2876,
    is_featured: false,
    is_premium: false,
    min_tier: "free",
  },
  {
    name: "Whip Pan",
    name_ru: "Быстрая панорама",
    slug: "whip-pan",
    category: "social",
    tags: ["whip", "pan", "fast", "transition"],
    description: "Ultra-fast horizontal camera movement",
    description_ru: "Сверхбыстрое горизонтальное движение камеры",
    params: {
      cameraMotion: "pan_right",
      speed: "very_fast",
      intensity: 1.0,
      duration: 1.5,
      blur: 0.8,
    },
    preview_url: "/images/gallery-8.jpg",
    rating: 4.4,
    usage_count: 1543,
    is_featured: false,
    is_premium: false,
    min_tier: "free",
  },

  // E-commerce Presets
  {
    name: "360° Product Spin",
    name_ru: "360° вращение продукта",
    slug: "360-product-spin",
    category: "ecommerce",
    tags: ["product", "360", "showcase", "spin"],
    description: "Full rotation showing all product angles",
    description_ru: "Полное вращение, показывающее все углы продукта",
    params: {
      cameraMotion: "orbit_left",
      speed: "medium",
      intensity: 1.0,
      duration: 8,
      angle: 360,
    },
    preview_url: "/images/model-kling.jpg",
    rating: 4.9,
    usage_count: 4567,
    is_featured: true,
    is_premium: false,
    min_tier: "free",
  },
  {
    name: "Feature Highlight",
    name_ru: "Подсветка функции",
    slug: "feature-highlight",
    category: "ecommerce",
    tags: ["product", "highlight", "zoom", "detail"],
    description: "Zoom in to showcase product details",
    description_ru: "Приближение для демонстрации деталей продукта",
    params: {
      cameraMotion: "zoom_in",
      speed: "slow",
      intensity: 0.8,
      duration: 4,
      focus: "center",
    },
    preview_url: "/images/gallery-1.jpg",
    rating: 4.7,
    usage_count: 2234,
    is_featured: false,
    is_premium: false,
    min_tier: "free",
  },

  // Creative Presets
  {
    name: "FPV Drone",
    name_ru: "FPV дрон",
    slug: "fpv-drone",
    category: "creative",
    tags: ["drone", "fpv", "dynamic", "action"],
    description: "First-person drone-like camera movement",
    description_ru: "Движение камеры как у дрона от первого лица",
    params: {
      cameraMotion: "fpv",
      speed: "fast",
      intensity: 1.0,
      duration: 6,
      wobble: 0.3,
    },
    preview_url: "/images/gallery-7.jpg",
    rating: 4.8,
    usage_count: 1876,
    is_featured: false,
    is_premium: true,
    min_tier: "pro",
  },
  {
    name: "Vertigo Effect",
    name_ru: "Эффект Вертиго",
    slug: "vertigo-effect",
    category: "creative",
    tags: ["vertigo", "dolly-zoom", "hitchcock", "dramatic"],
    description: "Dolly zoom creating perspective distortion",
    description_ru: "Зум с отъездом, создающий искажение перспективы",
    params: {
      cameraMotion: "vertigo",
      speed: "medium",
      intensity: 0.9,
      duration: 5,
    },
    preview_url: "/images/preset-thumb.jpg",
    rating: 4.5,
    usage_count: 567,
    is_featured: false,
    is_premium: true,
    min_tier: "pro",
  },
  {
    name: "Push In",
    name_ru: "Наезд",
    slug: "push-in",
    category: "cinematic",
    tags: ["push", "zoom", "focus", "subject"],
    description: "Forward camera movement towards subject",
    description_ru: "Движение камеры вперёд к объекту",
    params: {
      cameraMotion: "push_in",
      speed: "medium",
      intensity: 0.7,
      duration: 5,
    },
    preview_url: "/images/model-veo.jpg",
    rating: 4.6,
    usage_count: 1345,
    is_featured: true,
    is_premium: false,
    min_tier: "free",
  },
]

async function seedPresets() {
  console.log('🌱 Seeding presets...')

  for (const preset of presets) {
    const { error } = await supabase
      .from('presets')
      .upsert(preset, {
        onConflict: 'slug',
        ignoreDuplicates: false,
      })

    if (error) {
      console.error(`❌ Failed to seed preset "${preset.name}":`, error.message)
    } else {
      console.log(`✅ Seeded: ${preset.name}`)
    }
  }

  console.log(`\n🎉 Seeded ${presets.length} presets!`)
}

// Run if executed directly
if (require.main === module) {
  seedPresets()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seed failed:', error)
      process.exit(1)
    })
}

export { seedPresets, presets }
