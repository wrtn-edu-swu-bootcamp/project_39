import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 인증이 필요한 경로는 여기서 체크
        if (req.nextUrl.pathname.startsWith('/api/')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/api/:path*'],
}
