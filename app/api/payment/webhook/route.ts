import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { yookassa, PRICING } from '@/lib/yookassa'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, object } = body

    // Verify this is a YooKassa webhook
    // In production, verify signature from headers
    const signature = req.headers.get('authorization')
    // TODO: Verify signature

    if (event === 'payment.succeeded') {
      const payment = object

      // Get payment metadata
      const metadata = payment.metadata
      const userId = metadata.userId
      const type = metadata.type

      // Update payment status in database
      await supabase
        .from('payments')
        .update({ status: 'succeeded' })
        .eq('yookassa_payment_id', payment.id)

      // Process payment based on type
      if (type === 'credits') {
        // Add credits to user
        const credits = metadata.credits
        
        await supabase.rpc('deduct_credits', {
          user_id: userId,
          amount: -credits, // Negative amount = add credits
        })

        console.log(`✅ Added ${credits} credits to user ${userId}`)

      } else if (type === 'subscription') {
        // Update user tier and add monthly credits
        const tier = metadata.tier
        const credits = metadata.credits

        // Update user tier
        await supabase
          .from('users')
          .update({ 
            tier,
            credits: supabase.raw(`credits + ${credits}`),
          })
          .eq('id', userId)

        // Create subscription record
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)

        await supabase.from('subscriptions').insert({
          user_id: userId,
          tier,
          status: 'active',
          expires_at: expiresAt.toISOString(),
        })

        console.log(`✅ Activated ${tier} subscription for user ${userId}`)
      }

      return NextResponse.json({ received: true })

    } else if (event === 'payment.canceled') {
      // Update payment status
      await supabase
        .from('payments')
        .update({ status: 'canceled' })
        .eq('yookassa_payment_id', object.id)

      return NextResponse.json({ received: true })

    } else {
      console.log(`Unhandled event: ${event}`)
      return NextResponse.json({ received: true })
    }

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Note: In App Router, body parsing is handled automatically.
// For raw body access (webhook signatures), use: await request.text() or request.arrayBuffer()
