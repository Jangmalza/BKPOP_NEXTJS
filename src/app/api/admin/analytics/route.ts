/**
 * 관리자 통계 분석 API
 * @fileoverview 관리자 통계 분석 - 매출, 주문, 사용자 통계와 차트 데이터
 * @author Development Team
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { ApiResponseBuilder, ErrorHandler } from '@/utils';

/**
 * 통계 분석 데이터 조회 API
 * @description 관리자 통계 분석 페이지에서 사용할 데이터를 조회합니다.
 * @returns 통계 분석 데이터 또는 에러 응답
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateRange = searchParams.get('dateRange') || '30days';

    console.log('통계 분석 데이터 조회 요청:', { dateRange });

    const connection = await pool.getConnection();
    
    try {
      // 기본 통계 조회
      const [statsResult] = await connection.execute(`
        SELECT 
          COUNT(*) as totalUsers,
          COUNT(CASE WHEN role = 'user' THEN 1 END) as activeUsers,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as weeklyNewUsers,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as monthlyNewUsers
        FROM users
      `);
      
      const stats = (statsResult as any)[0];

      // 임시 데이터 (실제 환경에서는 주문 데이터를 사용)
      const mockAnalyticsData = {
        overview: {
          totalRevenue: 12500000,
          totalOrders: 856,
          totalUsers: stats.totalUsers,
          averageOrderValue: 14602,
          revenueGrowth: 15.2,
          orderGrowth: 8.7,
          userGrowth: 12.3
        },
        revenueChart: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
          data: [1800000, 2200000, 1900000, 2800000, 2400000, 3200000, 2900000]
        },
        orderChart: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
          data: [120, 150, 135, 180, 165, 210, 195]
        },
        categoryStats: [
          { category: '상업인쇄', revenue: 5200000, orders: 342, percentage: 41.6 },
          { category: '디지털인쇄', revenue: 3100000, orders: 198, percentage: 24.8 },
          { category: '대형인쇄', revenue: 2800000, orders: 156, percentage: 22.4 },
          { category: '패키지', revenue: 900000, orders: 87, percentage: 7.2 },
          { category: '기타', revenue: 500000, orders: 73, percentage: 4.0 }
        ],
        topProducts: [
          { id: 1, name: '프리미엄 명함', revenue: 2100000, orders: 140, quantity: 140 },
          { id: 2, name: '디지털 명함', revenue: 1800000, orders: 150, quantity: 150 },
          { id: 3, name: 'A4 전단지', revenue: 1200000, orders: 200, quantity: 2400 },
          { id: 4, name: '스티커', revenue: 900000, orders: 300, quantity: 300 },
          { id: 5, name: '대형 배너', revenue: 800000, orders: 45, quantity: 45 }
        ],
        userStats: {
          newUsers: stats.monthlyNewUsers,
          activeUsers: stats.activeUsers,
          returningUsers: Math.floor(stats.activeUsers * 0.3),
          userRetentionRate: 67.5
        },
        salesTrend: {
          labels: ['1주차', '2주차', '3주차', '4주차'],
          data: [725000, 680000, 820000, 775000]
        },
        topRegions: [
          { region: '서울', orders: 245, revenue: 3675000, percentage: 28.6 },
          { region: '경기', orders: 198, revenue: 2970000, percentage: 23.1 },
          { region: '부산', orders: 156, revenue: 2340000, percentage: 18.2 },
          { region: '대구', orders: 89, revenue: 1335000, percentage: 10.4 },
          { region: '기타', orders: 168, revenue: 2180000, percentage: 19.7 }
        ],
        customerAcquisition: {
          labels: ['검색', '직접 방문', '소셜미디어', '광고', '추천'],
          data: [35, 25, 15, 15, 10]
        }
      };

      // 날짜 범위에 따른 데이터 조정
      if (dateRange === '7days') {
        mockAnalyticsData.overview.totalRevenue = Math.floor(mockAnalyticsData.overview.totalRevenue * 0.25);
        mockAnalyticsData.overview.totalOrders = Math.floor(mockAnalyticsData.overview.totalOrders * 0.25);
        mockAnalyticsData.revenueChart.labels = ['월', '화', '수', '목', '금', '토', '일'];
        mockAnalyticsData.revenueChart.data = [420000, 380000, 450000, 520000, 480000, 390000, 310000];
      } else if (dateRange === '90days') {
        mockAnalyticsData.overview.totalRevenue = Math.floor(mockAnalyticsData.overview.totalRevenue * 3);
        mockAnalyticsData.overview.totalOrders = Math.floor(mockAnalyticsData.overview.totalOrders * 3);
        mockAnalyticsData.revenueChart.labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        mockAnalyticsData.revenueChart.data = [1800000, 2200000, 1900000, 2800000, 2400000, 3200000, 2900000, 3100000, 2700000, 2950000, 3300000, 3500000];
      }

      console.log('통계 분석 데이터 조회 성공');

      return NextResponse.json(
        ApiResponseBuilder.success(mockAnalyticsData, '통계 분석 데이터 조회 성공')
      );

    } catch (dbError) {
      console.error('통계 분석 데이터 조회 DB 오류:', dbError);
      ErrorHandler.log(dbError as Error, 'Admin Analytics GET - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('통계 분석 데이터 조회 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('통계 분석 데이터 조회 API 오류:', error);
    ErrorHandler.log(error as Error, 'Admin Analytics GET API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 실시간 통계 데이터 조회 API
 * @description 실시간 통계 데이터를 조회합니다.
 * @returns 실시간 통계 데이터 또는 에러 응답
 */
export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();

    console.log('실시간 통계 데이터 조회 요청:', { type });

    const connection = await pool.getConnection();
    
    try {
      let realTimeData = {};

      switch (type) {
        case 'sales':
          realTimeData = {
            todayRevenue: 850000,
            todayOrders: 32,
            hourlyRevenue: [
              { hour: '00', revenue: 15000 },
              { hour: '01', revenue: 8000 },
              { hour: '02', revenue: 12000 },
              { hour: '03', revenue: 25000 },
              { hour: '04', revenue: 45000 },
              { hour: '05', revenue: 35000 },
              { hour: '06', revenue: 55000 },
              { hour: '07', revenue: 65000 },
              { hour: '08', revenue: 75000 },
              { hour: '09', revenue: 85000 },
              { hour: '10', revenue: 95000 },
              { hour: '11', revenue: 105000 },
              { hour: '12', revenue: 120000 },
              { hour: '13', revenue: 85000 },
              { hour: '14', revenue: 65000 },
              { hour: '15', revenue: 45000 },
              { hour: '16', revenue: 35000 },
              { hour: '17', revenue: 25000 },
              { hour: '18', revenue: 15000 },
              { hour: '19', revenue: 12000 },
              { hour: '20', revenue: 8000 },
              { hour: '21', revenue: 5000 },
              { hour: '22', revenue: 3000 },
              { hour: '23', revenue: 2000 }
            ]
          };
          break;
        case 'orders':
          realTimeData = {
            pendingOrders: 15,
            processingOrders: 8,
            recentOrders: [
              { id: 'ORD-001', customer: '김철수', amount: 25000, time: '2분 전' },
              { id: 'ORD-002', customer: '이영희', amount: 45000, time: '5분 전' },
              { id: 'ORD-003', customer: '박민수', amount: 15000, time: '12분 전' },
              { id: 'ORD-004', customer: '최지은', amount: 35000, time: '18분 전' },
              { id: 'ORD-005', customer: '정태윤', amount: 22000, time: '25분 전' }
            ]
          };
          break;
        case 'users':
          realTimeData = {
            onlineUsers: 45,
            newSignups: 12,
            activeUsers: [
              { name: '김철수', activity: '상품 조회', time: '1분 전' },
              { name: '이영희', activity: '장바구니 추가', time: '3분 전' },
              { name: '박민수', activity: '주문 완료', time: '5분 전' },
              { name: '최지은', activity: '회원가입', time: '8분 전' },
              { name: '정태윤', activity: '상품 검색', time: '12분 전' }
            ]
          };
          break;
        default:
          realTimeData = { error: '지원하지 않는 타입입니다.' };
      }

      console.log('실시간 통계 데이터 조회 성공');

      return NextResponse.json(
        ApiResponseBuilder.success(realTimeData, '실시간 통계 데이터 조회 성공')
      );

    } catch (dbError) {
      console.error('실시간 통계 데이터 조회 DB 오류:', dbError);
      ErrorHandler.log(dbError as Error, 'Admin Analytics POST - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('실시간 통계 데이터 조회 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('실시간 통계 데이터 조회 API 오류:', error);
    ErrorHandler.log(error as Error, 'Admin Analytics POST API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
} 