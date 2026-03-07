import { YooCheckout } from '@a2seven/yoo-checkout'

// YooKassa is optional for now (will be configured later)
const YOOKASSA_ENABLED = !!(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY)

export const yookassa = YOOKASSA_ENABLED
  ? new YooCheckout({
      shopId: process.env.YOOKASSA_SHOP_ID!,
      secretKey: process.env.YOOKASSA_SECRET_KEY!,
    })
  : null

export { YOOKASSA_ENABLED }

// Pricing tiers (in rubles)
export const PRICING = {
  credits: {
    small: {
      credits: 50,
      price: 490, // ₽
      label: 'Пакет S',
      description: '50 генераций',
    },
    medium: {
      credits: 150,
      price: 1290, // ₽
      label: 'Пакет M',
      description: '150 генераций',
      popular: true,
    },
    large: {
      credits: 500,
      price: 3990, // ₽
      label: 'Пакет L',
      description: '500 генераций',
    },
  },
  subscriptions: {
    starter: {
      tier: 'starter',
      price: 990, // ₽/месяц
      credits: 100, // monthly allocation
      label: 'СТАРТ',
      features: [
        '100 генераций в месяц',
        'Full HD качество',
        'Без watermark',
        'Доступ к пресетам',
      ],
    },
    pro: {
      tier: 'pro',
      price: 2990, // ₽/месяц
      credits: 500,
      label: 'ПРО',
      features: [
        '500 генераций в месяц',
        '4K качество',
        'API доступ',
        'Приоритетная очередь',
        'Premium пресеты',
      ],
      popular: true,
    },
    studio: {
      tier: 'studio',
      price: 9990, // ₽/месяц
      credits: 2000,
      label: 'СТУДИЯ',
      features: [
        '2000 генераций в месяц',
        '4K качество',
        'API доступ',
        'Приоритетная поддержка',
        'Все пресеты',
        'Белый label',
      ],
    },
  },
}

export type PaymentType = 'credits' | 'subscription'
export type CreditPackage = keyof typeof PRICING.credits
export type SubscriptionTier = keyof typeof PRICING.subscriptions
