import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')?.split(',')
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('presets')
      .select('*', { count: 'exact' })

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (tags && tags.length > 0) {
      query = query.contains('tags', tags)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    // Sorting (by rating desc, then usage_count desc)
    query = query.order('rating', { ascending: false })
    query = query.order('usage_count', { ascending: false })

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data: presets, error, count } = await query

    if (error) {
      console.error('Presets query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch presets' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      presets,
      total: count,
      limit,
      offset,
      hasMore: count ? offset + limit < count : false,
    })

  } catch (error: any) {
    console.error('Presets API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
