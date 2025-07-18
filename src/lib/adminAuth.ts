/**
 * 관리자 권한 검증 미들웨어
 * @fileoverview 서버 사이드에서 관리자 권한을 검증하는 미들웨어
 * @author Development Team
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { AppError, ERROR_CODES, ApiResponseBuilder } from '@/utils';
import { UserRole } from '@/types';

/**
 * 관리자 권한 검증 함수
 * @param email - 사용자 이메일
 * @param requiredRole - 필요한 권한 레벨
 * @returns 사용자 정보 또는 null
 */
export async function verifyAdminPermission(
  email: string,
  requiredRole: UserRole = 'admin'
): Promise<any | null> {
  try {
    if (!email) {
      throw new AppError('사용자 이메일이 필요합니다.', 401, ERROR_CODES.UNAUTHORIZED);
    }

    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE email = ?',
      [email]
    );
    connection.release();

    if (!Array.isArray(users) || users.length === 0) {
      throw new AppError('존재하지 않는 사용자입니다.', 404, ERROR_CODES.USER_NOT_FOUND);
    }

    const user = users[0] as any;

    // 권한 레벨 확인
    const roleHierarchy: Record<UserRole, number> = {
      'user': 0,
      'admin': 1,
      'super_admin': 2
    };

    const userLevel = roleHierarchy[user.role as UserRole];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      throw new AppError('관리자 권한이 필요합니다.', 403, ERROR_CODES.FORBIDDEN);
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('권한 검증 중 오류가 발생했습니다.', 500, ERROR_CODES.UNKNOWN_ERROR);
  }
}

/**
 * 관리자 권한 검증 미들웨어 래퍼
 * @param handler - 실제 API 핸들러
 * @param requiredRole - 필요한 권한 레벨
 * @returns 래핑된 핸들러
 */
export function withAdminAuth(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
  requiredRole: UserRole = 'admin'
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // 요청 헤더에서 사용자 정보 추출 (실제 프로덕션에서는 JWT 토큰 사용)
      const userEmail = req.headers.get('X-User-Email');
      
      if (!userEmail) {
        return NextResponse.json(
          ApiResponseBuilder.error('로그인이 필요합니다.', ERROR_CODES.UNAUTHORIZED),
          { status: 401 }
        );
      }

      const user = await verifyAdminPermission(userEmail, requiredRole);
      
      // 관리자 권한이 확인되면 원래 핸들러 실행
      return await handler(req, user);
      
    } catch (error) {
      console.error('관리자 권한 검증 오류:', error);
      
      if (error instanceof AppError) {
        return NextResponse.json(
          ApiResponseBuilder.error(error.message, error.errorCode),
          { status: error.statusCode }
        );
      }
      
      return NextResponse.json(
        ApiResponseBuilder.error('서버 오류가 발생했습니다.', ERROR_CODES.UNKNOWN_ERROR),
        { status: 500 }
      );
    }
  };
}

/**
 * 간단한 관리자 권한 검증 (헤더 기반)
 * @param req - NextRequest 객체
 * @param requiredRole - 필요한 권한 레벨
 * @returns 사용자 정보 또는 null
 */
export async function checkAdminAuth(
  req: NextRequest,
  requiredRole: UserRole = 'admin'
): Promise<any | null> {
  try {
    const userEmail = req.headers.get('X-User-Email');
    
    if (!userEmail) {
      return null;
    }

    return await verifyAdminPermission(userEmail, requiredRole);
    
  } catch (error) {
    console.error('관리자 권한 확인 오류:', error);
    return null;
  }
} 