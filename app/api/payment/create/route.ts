import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { yookassa, YOOKASSA_ENABLED, PRICING, PaymentType, CreditPackage, SubscriptionTier } from '@/lib/yookassa'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    // Check if YooKassa is configured
    if (!YOOKASSA_ENABLED) {
      return NextResponse.json(
        { 
          error: 'Платёжная система временно недоступна. Скоро заработает! 🚀',
          mock: true 
        },
        { status: 503 }
      )
    }

    // Get authenticated user
    const authClient = await createClient()
    const { data: { session } } = await authClient.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    const userEmail = session.user.email!

    const body = await req.json()
    const { type, itemId } = body as { type: PaymentType; itemId: string }

    // Validate type and itemId
    if (!type || !itemId) {
      return NextResponse.json(
        { error: 'Missing type or itemId' },
        { status: 400 }
      )
    }

    let amount: number
    let description: string
    let metadata: any

    if (type === 'credits') {
      const pack = PRICING.credits[itemId as CreditPackage]
      if (!pack) {
        return NextResponse.json(
          { error: 'Invalid credit package' },
          { status: 400 }
        )
      }

      amount = pack.price
      description = `${pack.label} - ${pack.credits} credits`
      metadata = {
        type: 'credits',
        userId,
        credits: pack.credits,
        package: itemId,
      }
    } else if (type === 'subscription') {
      const plan = PRICING.subscriptions[itemId as SubscriptionTier]
      if (!plan) {
        return NextResponse.json(
          { error: 'Invalid subscription tier' },
          { status: 400 }
        )
      }

      amount = plan.price
      description = `Подписка ${plan.label} - 1 месяц`
      metadata = {
        type: 'subscription',
        userId,
        tier: plan.tier,
        credits: plan.credits,
        plan: itemId,
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      )
    }

    // Create payment in YooKassa
    const idempotenceKey = uuidv4()
    const payment = await yookassa.createPayment({
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      },
      capture: true,
      description,
      metadata,
      receipt: {
        customer: {
          email: userEmail,
        },
        items: [
          {
            description,
            quantity: '1',
            amount: {
              value: amount.toFixed(2),
              currency: 'RUB',
            },
            vat_code: 1, // НДС не облагается
          },
        ],
      },
    }, idempotenceKey)

    // Save payment record to database
    const { error: dbError } = await (await createClient()).from('payments').insert({
      id: payment.id,
      user_id: userId,
      amount,
      currency: 'RUB',
      status: payment.status,
      type,
      item_id: itemId,
      metadata,
      yookassa_payment_id: payment.id,
    })

    if (dbError) {
      console.error('Failed to save payment to DB:', dbError)
    }

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation?.confirmation_url,
      status: payment.status,
    })

  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    )
  }
}
