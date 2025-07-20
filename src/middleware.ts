/**
 * Next.js 미들웨어
 * @fileoverview API 보안 및 인증 미들웨어
 * @author Development Team
 * @version 1.0.0
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

/**
 * 보호된 API 경로 목록
 */
const protectedAdminRoutes = [
  '/api/admin/users',
  '/api/admin/products',
  '/api/admin/orders',
  '/api/admin/analytics',
  '/api/admin/stats',
];

/**
 * 미들웨어 함수
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 관리자 API 경로 보호
  if (protectedAdminRoutes.some(route => pathname.startsWith(route))) {
    return handleAdminAuth(request);
  }

  // CORS 헤더 추가
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-User-Email'
  );

  return response;
}

/**
 * 관리자 인증 처리
 */
function handleAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const userEmail = request.headers.get('X-User-Email');

  // 개발 환경에서는 헤더 기반 인증 허용
  if (process.env.NODE_ENV === 'development' && userEmail) {
    return NextResponse.next();
  }

  // JWT 토큰 검증
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (payload) {
      // 토큰이 유효한 경우 요청 헤더에 사용자 정보 추가
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('X-User-ID', payload.userId);
      requestHeaders.set('X-User-Email', payload.email);
      requestHeaders.set('X-User-Role', payload.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  // 인증 실패
  return NextResponse.json(
    { success: false, message: '인증이 필요합니다.' },
    { status: 401 }
  );
}

/**
 * 미들웨어 실행 조건
 */
export const config = {
  matcher: [
    // API 경로에 대해서만 실행
    '/api/:path*',
    // 관리자 경로에 대해서만 실행
    '/admin/:path*',
  ],
}; 