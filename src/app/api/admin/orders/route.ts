/**
 * 관리자 주문 관리 API
 * @fileoverview 관리자가 주문을 관리할 수 있는 API
 * @author Development Team
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { ApiResponseBuilder, ErrorHandler } from '@/utils';

/**
 * 주문 목록 조회 API
 * @description 관리자가 주문 목록을 조회할 수 있는 API
 * @returns 주문 목록 또는 에러 응답
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchTerm = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || 'all';
    const paymentFilter = searchParams.get('payment') || 'all';

    console.log('주문 목록 조회 요청:', { page, limit, searchTerm, statusFilter, paymentFilter });

    const connection = await pool.getConnection();
    
    try {
      // 임시 데이터 반환 (실제 데이터베이스에 주문이 없는 경우)
      const mockOrders = [
        {
          id: '1',
          order_number: 'ORD-2024-001',
          customer_name: '김철수',
          customer_email: 'kim@example.com',
          customer_phone: '010-1234-5678',
          total_amount: 25000,
          status: 'pending',
          payment_status: 'completed',
          created_at: '2024-01-10T10:30:00',
          updated_at: '2024-01-10T10:30:00',
          products: [
            { id: 1, title: '프리미엄 명함', quantity: 1, price: 15000 },
            { id: 2, title: 'A4 전단지', quantity: 20, price: 500 }
          ]
        },
        {
          id: '2',
          order_number: 'ORD-2024-002',
          customer_name: '이영희',
          customer_email: 'lee@example.com',
          customer_phone: '010-2345-6789',
          total_amount: 45000,
          status: 'processing',
          payment_status: 'completed',
          created_at: '2024-01-09T14:20:00',
          updated_at: '2024-01-10T09:15:00',
          products: [
            { id: 3, title: '디지털 명함', quantity: 3, price: 12000 },
            { id: 4, title: '스티커', quantity: 3, price: 3000 }
          ]
        },
        {
          id: '3',
          order_number: 'ORD-2024-003',
          customer_name: '박민수',
          customer_email: 'park@example.com',
          customer_phone: '010-3456-7890',
          total_amount: 8000,
          status: 'shipped',
          payment_status: 'completed',
          created_at: '2024-01-08T16:45:00',
          updated_at: '2024-01-10T11:00:00',
          products: [
            { id: 2, title: '스탠다드 명함', quantity: 1, price: 8000 }
          ]
        },
        {
          id: '4',
          order_number: 'ORD-2024-004',
          customer_name: '최지은',
          customer_email: 'choi@example.com',
          customer_phone: '010-4567-8901',
          total_amount: 36000,
          status: 'delivered',
          payment_status: 'completed',
          created_at: '2024-01-07T11:30:00',
          updated_at: '2024-01-09T14:20:00',
          products: [
            { id: 1, title: '프리미엄 명함', quantity: 2, price: 15000 },
            { id: 5, title: '스티커', quantity: 2, price: 3000 }
          ]
        },
        {
          id: '5',
          order_number: 'ORD-2024-005',
          customer_name: '정태윤',
          customer_email: 'jung@example.com',
          customer_phone: '010-5678-9012',
          total_amount: 12000,
          status: 'cancelled',
          payment_status: 'failed',
          created_at: '2024-01-06T13:15:00',
          updated_at: '2024-01-06T15:30:00',
          products: [
            { id: 4, title: '디지털 명함', quantity: 1, price: 12000 }
          ]
        },
        {
          id: '6',
          order_number: 'ORD-2024-006',
          customer_name: '홍길동',
          customer_email: 'hong@example.com',
          customer_phone: '010-9876-5432',
          total_amount: 22000,
          status: 'confirmed',
          payment_status: 'completed',
          created_at: '2024-01-11T09:00:00',
          updated_at: '2024-01-11T10:30:00',
          products: [
            { id: 1, title: '프리미엄 명함', quantity: 1, price: 15000 },
            { id: 5, title: '스티커', quantity: 1, price: 3000 },
            { id: 2, title: 'A4 전단지', quantity: 8, price: 500 }
          ]
        }
      ];

      // 필터링 적용
      let filteredOrders = mockOrders;

      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
      }

      if (paymentFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.payment_status === paymentFilter);
      }

      const totalCount = filteredOrders.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);

      const response = {
        orders: paginatedOrders,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        stats: {
          total: mockOrders.length,
          pending: mockOrders.filter(o => o.status === 'pending').length,
          processing: mockOrders.filter(o => o.status === 'processing').length,
          shipped: mockOrders.filter(o => o.status === 'shipped').length,
          delivered: mockOrders.filter(o => o.status === 'delivered').length,
          cancelled: mockOrders.filter(o => o.status === 'cancelled').length,
          totalRevenue: mockOrders.reduce((sum, order) => sum + order.total_amount, 0)
        }
      };

      console.log('주문 목록 조회 성공:', response);

      return NextResponse.json(
        ApiResponseBuilder.success(response, '주문 목록 조회 성공')
      );

    } catch (dbError) {
      console.error('주문 목록 조회 DB 오류:', dbError);
      ErrorHandler.log(dbError as Error, 'Admin Orders GET - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('주문 목록 조회 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('주문 목록 조회 API 오류:', error);
    ErrorHandler.log(error as Error, 'Admin Orders GET API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 주문 상태 변경 API
 * @description 관리자가 주문 상태를 변경할 수 있는 API
 * @returns 성공 응답 또는 에러 응답
 */
export async function PUT(req: NextRequest) {
  try {
    const { orderId, status, payment_status } = await req.json();

    // 필수 필드 검증
    if (!orderId || !status) {
      return NextResponse.json(
        ApiResponseBuilder.error('주문 ID와 상태 정보가 필요합니다.'),
        { status: 400 }
      );
    }

    // 상태 유효성 검사
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        ApiResponseBuilder.error('올바르지 않은 주문 상태입니다.'),
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // 주문 존재 확인
      const [existingOrder] = await connection.execute(
        'SELECT id FROM orders WHERE id = ?',
        [orderId]
      );

      if (!Array.isArray(existingOrder) || existingOrder.length === 0) {
        return NextResponse.json(
          ApiResponseBuilder.error('존재하지 않는 주문입니다.'),
          { status: 404 }
        );
      }

      // 주문 상태 업데이트
      await connection.execute(
        'UPDATE orders SET status = ?, payment_status = ?, updated_at = NOW() WHERE id = ?',
        [status, payment_status, orderId]
      );

      return NextResponse.json(
        ApiResponseBuilder.success(undefined, '주문 상태가 성공적으로 변경되었습니다.')
      );

    } catch (dbError) {
      console.error('주문 상태 변경 DB 오류:', dbError);
      ErrorHandler.log(dbError as Error, 'Admin Orders PUT - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('주문 상태 변경 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('주문 상태 변경 API 오류:', error);
    ErrorHandler.log(error as Error, 'Admin Orders PUT API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 주문 삭제 API
 * @description 관리자가 주문을 삭제할 수 있는 API
 * @returns 성공 응답 또는 에러 응답
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        ApiResponseBuilder.error('주문 ID가 필요합니다.'),
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // 주문 존재 확인
      const [existingOrder] = await connection.execute(
        'SELECT id, status FROM orders WHERE id = ?',
        [orderId]
      );

      if (!Array.isArray(existingOrder) || existingOrder.length === 0) {
        return NextResponse.json(
          ApiResponseBuilder.error('존재하지 않는 주문입니다.'),
          { status: 404 }
        );
      }

      const order = (existingOrder as any)[0];

      // 배송 완료된 주문은 삭제할 수 없음
      if (order.status === 'delivered') {
        return NextResponse.json(
          ApiResponseBuilder.error('배송 완료된 주문은 삭제할 수 없습니다.'),
          { status: 403 }
        );
      }

      // 주문 삭제 (CASCADE로 관련 데이터도 자동 삭제)
      await connection.execute(
        'DELETE FROM orders WHERE id = ?',
        [orderId]
      );

      return NextResponse.json(
        ApiResponseBuilder.success(undefined, '주문이 성공적으로 삭제되었습니다.')
      );

    } catch (dbError) {
      console.error('주문 삭제 DB 오류:', dbError);
      ErrorHandler.log(dbError as Error, 'Admin Orders DELETE - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('주문 삭제 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('주문 삭제 API 오류:', error);
    ErrorHandler.log(error as Error, 'Admin Orders DELETE API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
} 