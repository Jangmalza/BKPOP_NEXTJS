/**
 * 장바구니 API 라우트
 * @fileoverview 장바구니 관련 API 엔드포인트
 * @author Development Team
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { 
  AppError, 
  ERROR_CODES, 
  ApiResponseBuilder, 
  ErrorHandler,
  Validator
} from '@/utils';

/**
 * 장바구니 조회 API
 * @description 특정 사용자의 장바구니 아이템 목록을 조회합니다.
 * @param request - Next.js 요청 객체
 * @returns 장바구니 아이템 목록 또는 에러 응답
 * 
 * @example
 * GET /api/cart?userId=1
 * 
 * @returns
 * {
 *   success: true,
 *   message: "장바구니 조회 성공",
 *   data: { items: CartItem[] }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // 필수 파라미터 검증
    if (!userId) {
      throw new AppError(
        '사용자 ID가 필요합니다.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // 사용자 ID 유효성 검사
    if (!Validator.isPositiveInteger(parseInt(userId))) {
      throw new AppError(
        '올바른 사용자 ID를 입력해주세요.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    let connection;
    try {
      connection = await pool.getConnection();
      
      // 사용자 존재 확인
      const [userCheck] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );
      
      if (Array.isArray(userCheck) && userCheck.length === 0) {
        throw new AppError(
          '존재하지 않는 사용자입니다.',
          404,
          ERROR_CODES.USER_NOT_FOUND
        );
      }

      // 장바구니 조회
      const [cartItems] = await connection.execute(
        'SELECT * FROM cart WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );

      const response = ApiResponseBuilder.success(
        { items: cartItems },
        '장바구니 조회 성공'
      );

      return NextResponse.json(response);

    } catch (dbError) {
      ErrorHandler.log(dbError as Error, 'Cart GET - Database');
      throw new AppError(
        '데이터베이스 조회 중 오류가 발생했습니다.',
        500,
        ERROR_CODES.DATABASE_QUERY_ERROR
      );
    } finally {
      if (connection) connection.release();
    }

  } catch (error) {
    ErrorHandler.log(error as Error, 'Cart GET API');
    
    if (error instanceof AppError) {
      return NextResponse.json(
        ErrorHandler.toApiResponse(error),
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 장바구니 상품 추가 API
 * @description 사용자의 장바구니에 상품을 추가합니다.
 * @param request - Next.js 요청 객체
 * @returns 성공 응답 또는 에러 응답
 * 
 * @example
 * POST /api/cart
 * Body: {
 *   userId: 1,
 *   productId: 10,
 *   title: "명함",
 *   image: "/images/card.jpg",
 *   size: "90x50mm",
 *   price: 10000,
 *   quantity: 2
 * }
 * 
 * @returns
 * {
 *   success: true,
 *   message: "장바구니에 상품이 추가되었습니다."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { userId, productId, title, image, size, price, quantity } = requestBody;

    // 필수 필드 검증
    const requiredFields = { userId, productId, title, price };
    const missingFields = Validator.validateRequiredFields(requiredFields);
    
    if (missingFields.length > 0) {
      throw new AppError(
        `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // 데이터 유효성 검사
    if (!Validator.isPositiveInteger(userId)) {
      throw new AppError(
        '올바른 사용자 ID를 입력해주세요.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    if (!Validator.isPositiveInteger(productId)) {
      throw new AppError(
        '올바른 상품 ID를 입력해주세요.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    if (!Validator.isPositiveInteger(price)) {
      throw new AppError(
        '올바른 가격을 입력해주세요.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const itemQuantity = quantity || 1;
    if (!Validator.isPositiveInteger(itemQuantity)) {
      throw new AppError(
        '올바른 수량을 입력해주세요.',
        400,
        ERROR_CODES.CART_INVALID_QUANTITY
      );
    }

    let connection;
    try {
      connection = await pool.getConnection();
      
      // 사용자 존재 확인
      const [userCheck] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );
      
      if (Array.isArray(userCheck) && userCheck.length === 0) {
        throw new AppError(
          '존재하지 않는 사용자입니다.',
          404,
          ERROR_CODES.USER_NOT_FOUND
        );
      }

      // 이미 장바구니에 있는 상품인지 확인
      const [existingItems] = await connection.execute(
        'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      if (Array.isArray(existingItems) && existingItems.length > 0) {
        // 기존 상품이 있으면 수량 증가
        await connection.execute(
          'UPDATE cart SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?',
          [itemQuantity, userId, productId]
        );
      } else {
        // 새로운 상품 추가
        await connection.execute(
          'INSERT INTO cart (user_id, product_id, title, image, size, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [userId, productId, title, image, size, price, itemQuantity]
        );
      }

      const response = ApiResponseBuilder.success(
        undefined,
        '장바구니에 상품이 추가되었습니다.'
      );

      return NextResponse.json(response);

    } catch (dbError) {
      ErrorHandler.log(dbError as Error, 'Cart POST - Database');
      throw new AppError(
        '데이터베이스 저장 중 오류가 발생했습니다.',
        500,
        ERROR_CODES.DATABASE_QUERY_ERROR
      );
    } finally {
      if (connection) connection.release();
    }

  } catch (error) {
    ErrorHandler.log(error as Error, 'Cart POST API');
    
    if (error instanceof AppError) {
      return NextResponse.json(
        ErrorHandler.toApiResponse(error),
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 장바구니 전체 비우기 API
 * @description 특정 사용자의 장바구니를 전체 비웁니다.
 * @param request - Next.js 요청 객체
 * @returns 성공 응답 또는 에러 응답
 * 
 * @example
 * DELETE /api/cart?userId=1
 * 
 * @returns
 * {
 *   success: true,
 *   message: "장바구니가 비워졌습니다."
 * }
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // 필수 파라미터 검증
    if (!userId) {
      throw new AppError(
        '사용자 ID가 필요합니다.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // 사용자 ID 유효성 검사
    if (!Validator.isPositiveInteger(parseInt(userId))) {
      throw new AppError(
        '올바른 사용자 ID를 입력해주세요.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    let connection;
    try {
      connection = await pool.getConnection();
      
      // 사용자 존재 확인
      const [userCheck] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );
      
      if (Array.isArray(userCheck) && userCheck.length === 0) {
        throw new AppError(
          '존재하지 않는 사용자입니다.',
          404,
          ERROR_CODES.USER_NOT_FOUND
        );
      }

      // 장바구니 비우기
      await connection.execute(
        'DELETE FROM cart WHERE user_id = ?',
        [userId]
      );

      const response = ApiResponseBuilder.success(
        undefined,
        '장바구니가 비워졌습니다.'
      );

      return NextResponse.json(response);

    } catch (dbError) {
      ErrorHandler.log(dbError as Error, 'Cart DELETE - Database');
      throw new AppError(
        '데이터베이스 삭제 중 오류가 발생했습니다.',
        500,
        ERROR_CODES.DATABASE_QUERY_ERROR
      );
    } finally {
      if (connection) connection.release();
    }

  } catch (error) {
    ErrorHandler.log(error as Error, 'Cart DELETE API');
    
    if (error instanceof AppError) {
      return NextResponse.json(
        ErrorHandler.toApiResponse(error),
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
} 