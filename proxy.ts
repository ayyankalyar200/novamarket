import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // ========================================
  // CHECK: Banned user block
  // ========================================
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_banned')
      .eq('id', user.id)
      .single()

    if (profile?.is_banned) {
      // Allow ONLY banned page aur auth pages
      const allowedPaths = ['/banned', '/login', '/signup']
      if (!allowedPaths.some(p => pathname.startsWith(p))) {
        const url = request.nextUrl.clone()
        url.pathname = '/banned'
        return NextResponse.redirect(url)
      }
    }

    // ========================================
    // Seller-only routes
    // ========================================
    if (pathname.startsWith('/dashboard/seller')) {
      const role = profile?.role || 'buyer'
      if (role !== 'seller' && role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }

    // ========================================
    // Admin-only routes
    // ========================================
    if (pathname.startsWith('/admin')) {
      const role = profile?.role || 'buyer'
      if (role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }
  }

  // ========================================
  // Auth required routes
  // ========================================
  const authRequiredPaths = [
    '/dashboard',
    '/profile',
    '/orders',
    '/wishlist',
    '/sell',
    '/cart',
    '/checkout',
    '/become-seller',
    '/admin',
  ]

  const isAuthRequired = authRequiredPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (isAuthRequired && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // ========================================
  // Logged-in users - block auth pages
  // ========================================
  if (
    user &&
    (pathname === '/login' ||
      pathname === '/signup' ||
      pathname === '/forgot-password')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
