/**
 * 관리자 사용자 관리 API
 * @fileoverview 관리자가 사용자를 관리할 수 있는 API
 * @author Development Team
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { ApiResponseBuilder, ErrorHandler, Validator } from '@/utils';

/**
 * 사용자 목록 조회 API
 * @description 관리자가 사용자 목록을 조회할 수 있는 API
 * @returns 사용자 목록 또는 에러 응답
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchTerm = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || 'all';
    const statusFilter = searchParams.get('status') || 'all';

    const connection = await pool.getConnection();
    
    try {
      let baseQuery = `
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          role, 
          created_at, 
          updated_at,
          (SELECT COUNT(*) FROM cart WHERE user_id = users.id) as cart_items_count
        FROM users
      `;
      
      const conditions = [];
      const params = [];

      // 검색 조건
      if (searchTerm) {
        conditions.push('(name LIKE ? OR email LIKE ?)');
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }

      // 역할 필터
      if (roleFilter !== 'all') {
        conditions.push('role = ?');
        params.push(roleFilter);
      }

      // WHERE 조건 추가
      if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
      }

      // 전체 개수 조회
      const countQuery = `SELECT COUNT(*) as total FROM users` + 
        (conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '');
      
      const [countResult] = await connection.execute(countQuery, params);
      const totalCount = (countResult as any)[0].total;

      // 페이지네이션 적용
      const offset = (page - 1) * limit;
      baseQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [users] = await connection.execute(baseQuery, params);

      // 추가 통계 정보
      const [statsResult] = await connection.execute(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
          COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admins,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_30d
        FROM users
      `);
      
      const stats = (statsResult as any)[0];

      const response = {
        users,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        },
        stats: {
          total: stats.total,
          regularUsers: stats.regular_users,
          admins: stats.admins,
          superAdmins: stats.super_admins,
          newUsers30d: stats.new_users_30d
        }
      };

      return NextResponse.json(
        ApiResponseBuilder.success(response, '사용자 목록 조회 성공')
      );

    } catch (dbError) {
      ErrorHandler.log(dbError as Error, 'Admin Users GET - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('사용자 목록 조회 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    ErrorHandler.log(error as Error, 'Admin Users GET API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 사용자 정보 수정 API
 * @description 관리자가 사용자 정보를 수정할 수 있는 API
 * @returns 성공 응답 또는 에러 응답
 */
export async function PUT(req: NextRequest) {
  try {
    const { userId, name, email, phone, role } = await req.json();

    // 필수 필드 검증
    if (!userId || !name || !email) {
      return NextResponse.json(
        ApiResponseBuilder.error('필수 정보가 누락되었습니다.'),
        { status: 400 }
      );
    }

    // 이메일 유효성 검사
    if (!Validator.isValidEmail(email)) {
      return NextResponse.json(
        ApiResponseBuilder.error('올바른 이메일 형식이 아닙니다.'),
        { status: 400 }
      );
    }

    // 전화번호 유효성 검사 (있는 경우)
    if (phone && !Validator.isValidPhone(phone)) {
      return NextResponse.json(
        ApiResponseBuilder.error('올바른 전화번호 형식이 아닙니다.'),
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // 사용자 존재 확인
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );

      if (!Array.isArray(existingUser) || existingUser.length === 0) {
        return NextResponse.json(
          ApiResponseBuilder.error('존재하지 않는 사용자입니다.'),
          { status: 404 }
        );
      }

      // 이메일 중복 확인 (현재 사용자 제외)
      const [emailCheck] = await connection.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (Array.isArray(emailCheck) && emailCheck.length > 0) {
        return NextResponse.json(
          ApiResponseBuilder.error('이미 사용 중인 이메일입니다.'),
          { status: 409 }
        );
      }

      // 사용자 정보 업데이트
      await connection.execute(
        'UPDATE users SET name = ?, email = ?, phone = ?, role = ?, updated_at = NOW() WHERE id = ?',
        [name, email, phone, role, userId]
      );

      return NextResponse.json(
        ApiResponseBuilder.success(undefined, '사용자 정보가 성공적으로 수정되었습니다.')
      );

    } catch (dbError) {
      ErrorHandler.log(dbError as Error, 'Admin Users PUT - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('사용자 정보 수정 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    ErrorHandler.log(error as Error, 'Admin Users PUT API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 사용자 삭제 API
 * @description 관리자가 사용자를 삭제할 수 있는 API
 * @returns 성공 응답 또는 에러 응답
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        ApiResponseBuilder.error('사용자 ID가 필요합니다.'),
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // 사용자 존재 확인
      const [existingUser] = await connection.execute(
        'SELECT id, role FROM users WHERE id = ?',
        [userId]
      );

      if (!Array.isArray(existingUser) || existingUser.length === 0) {
        return NextResponse.json(
          ApiResponseBuilder.error('존재하지 않는 사용자입니다.'),
          { status: 404 }
        );
      }

      const user = (existingUser as any)[0];

      // 슈퍼 관리자는 삭제할 수 없음
      if (user.role === 'super_admin') {
        return NextResponse.json(
          ApiResponseBuilder.error('슈퍼 관리자는 삭제할 수 없습니다.'),
          { status: 403 }
        );
      }

      // 사용자 삭제 (CASCADE로 관련 데이터도 자동 삭제)
      await connection.execute(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );

      return NextResponse.json(
        ApiResponseBuilder.success(undefined, '사용자가 성공적으로 삭제되었습니다.')
      );

    } catch (dbError) {
      ErrorHandler.log(dbError as Error, 'Admin Users DELETE - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('사용자 삭제 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    ErrorHandler.log(error as Error, 'Admin Users DELETE API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
} 