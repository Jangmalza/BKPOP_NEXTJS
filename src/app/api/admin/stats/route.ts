/**
 * 관리자 대시보드 통계 API
 * @fileoverview 관리자 대시보드에서 사용할 통계 데이터 API
 * @author Development Team
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { checkAdminAuth } from '@/lib/adminAuth';
import { ApiResponseBuilder, ErrorHandler } from '@/utils';
import { AdminStats } from '@/types';

/**
 * 관리자 대시보드 통계 조회 API
 * @description 관리자 대시보드에 필요한 각종 통계 데이터를 조회합니다.
 * @returns 통계 데이터 또는 에러 응답
 */
export async function GET(req: NextRequest) {
  try {
    // 관리자 권한 확인 (임시로 헤더 체크 건너뛰기)
    // const adminUser = await checkAdminAuth(req, 'admin');
    // if (!adminUser) {
    //   return NextResponse.json(
    //     ApiResponseBuilder.error('관리자 권한이 필요합니다.'),
    //     { status: 401 }
    //   );
    // }

    const connection = await pool.getConnection();
    
    try {
      // 1. 총 사용자 수
      const [totalUsersResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM users'
      );
      const totalUsers = (totalUsersResult as any)[0].total;

      // 2. 오늘 신규 사용자 수
      const [todayUsersResult] = await connection.execute(
        'SELECT COUNT(*) as today FROM users WHERE DATE(created_at) = CURDATE()'
      );
      const todayNewUsers = (todayUsersResult as any)[0].today;

      // 3. 총 주문 수 (현재 orders 테이블이 없으므로 임시로 0)
      const totalOrders = 0;
      const todayOrders = 0;

      // 4. 총 상품 수 (현재 products 테이블이 없으므로 임시로 0)
      const totalProducts = 0;

      // 5. 총 매출 (현재 주문 데이터가 없으므로 임시로 0)
      const totalRevenue = 0;
      const monthlyRevenue = 0;
      const revenueGrowth = 0;

      // 6. 활성 사용자 수 (role이 user인 사용자)
      const [activeUsersResult] = await connection.execute(
        'SELECT COUNT(*) as active FROM users WHERE role = "user"'
      );
      const activeUsers = (activeUsersResult as any)[0].active;

      // 7. 관리자 수
      const [adminUsersResult] = await connection.execute(
        'SELECT COUNT(*) as admins FROM users WHERE role IN ("admin", "super_admin")'
      );
      const adminUsers = (adminUsersResult as any)[0].admins;

      // 8. 최근 30일 신규 사용자 수
      const [recentUsersResult] = await connection.execute(
        'SELECT COUNT(*) as recent FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
      );
      const recentUsers = (recentUsersResult as any)[0].recent;

      // 9. 장바구니 데이터 (현재 cart 테이블 존재)
      const [cartStatsResult] = await connection.execute(
        'SELECT COUNT(*) as totalItems, COUNT(DISTINCT user_id) as uniqueUsers FROM cart'
      );
      const cartStats = (cartStatsResult as any)[0];

      // 10. 사용자 가입 추세 (최근 7일)
      const [userTrendResult] = await connection.execute(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM users 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `);
      const userTrend = userTrendResult;

      const stats: AdminStats = {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        todayNewUsers,
        todayOrders,
        monthlyRevenue,
        revenueGrowth
      };

      const additionalStats = {
        activeUsers,
        adminUsers,
        recentUsers: recentUsers,
        cartStats: {
          totalItems: cartStats.totalItems,
          uniqueUsers: cartStats.uniqueUsers
        },
        userTrend
      };

      return NextResponse.json(
        ApiResponseBuilder.success(
          { ...stats, ...additionalStats },
          '관리자 통계 조회 성공'
        )
      );

    } catch (dbError) {
      ErrorHandler.log(dbError as Error, 'Admin Stats API - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('데이터베이스 조회 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    ErrorHandler.log(error as Error, 'Admin Stats API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
} 