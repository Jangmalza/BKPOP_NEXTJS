/**
 * 장바구니 개별 아이템 API 라우트
 * @fileoverview 장바구니 개별 아이템 수정/삭제 API 엔드포인트
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
 * 장바구니 상품 수량 수정 API
 * @description 특정 장바구니 아이템의 수량을 수정합니다.
 * @param request - Next.js 요청 객체
 * @param params - 라우트 파라미터 (id)
 * @returns 성공 응답 또는 에러 응답
 * 
 * @example
 * PUT /api/cart/123
 * Body: { quantity: 3 }
 * 
 * @returns
 * {
 *   success: true,
 *   message: "장바구니가 업데이트되었습니다."
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { quantity } = await request.json();
    const cartId = params.id;

    // 필수 파라미터 검증
    if (!cartId) {
      throw new AppError(
        '장바구니 아이템 ID가 필요합니다.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    if (quantity === undefined || quantity === null) {
      throw new AppError(
        '수량 정보가 필요합니다.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // 장바구니 ID 유효성 검사
    if (!Validator.isPositiveInteger(parseInt(cartId))) {
      throw new AppError(
        '올바른 장바구니 아이템 ID를 입력해주세요.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // 수량 유효성 검사 (0 이상의 정수)
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new AppError(
        '올바른 수량을 입력해주세요. (0 이상의 정수)',
        400,
        ERROR_CODES.CART_INVALID_QUANTITY
      );
    }

    let connection;
    try {
      connection = await pool.getConnection();

      // 장바구니 아이템 존재 확인
      const [existingItem] = await connection.execute(
        'SELECT id, user_id, product_id, title FROM cart WHERE id = ?',
        [cartId]
      );

      if (Array.isArray(existingItem) && existingItem.length === 0) {
        throw new AppError(
          '존재하지 않는 장바구니 아이템입니다.',
          404,
          ERROR_CODES.CART_ITEM_NOT_FOUND
        );
      }

      if (quantity === 0) {
        // 수량이 0이면 삭제
        await connection.execute(
          'DELETE FROM cart WHERE id = ?',
          [cartId]
        );
      } else {
        // 수량 업데이트
        await connection.execute(
          'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [quantity, cartId]
        );
      }

      const response = ApiResponseBuilder.success(
        undefined,
        quantity === 0 ? '장바구니에서 상품이 제거되었습니다.' : '장바구니가 업데이트되었습니다.'
      );

      return NextResponse.json(response);

    } catch (dbError) {
      ErrorHandler.log(dbError as Error, 'Cart PUT - Database');
      throw new AppError(
        '데이터베이스 수정 중 오류가 발생했습니다.',
        500,
        ERROR_CODES.DATABASE_QUERY_ERROR
      );
    } finally {
      if (connection) connection.release();
    }

  } catch (error) {
    ErrorHandler.log(error as Error, 'Cart PUT API');
    
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
 * 장바구니 상품 삭제 API
 * @description 특정 장바구니 아이템을 삭제합니다.
 * @param request - Next.js 요청 객체
 * @param params - 라우트 파라미터 (id)
 * @returns 성공 응답 또는 에러 응답
 * 
 * @example
 * DELETE /api/cart/123
 * 
 * @returns
 * {
 *   success: true,
 *   message: "상품이 장바구니에서 삭제되었습니다."
 * }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cartId = params.id;

    // 필수 파라미터 검증
    if (!cartId) {
      throw new AppError(
        '장바구니 아이템 ID가 필요합니다.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // 장바구니 ID 유효성 검사
    if (!Validator.isPositiveInteger(parseInt(cartId))) {
      throw new AppError(
        '올바른 장바구니 아이템 ID를 입력해주세요.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    let connection;
    try {
      connection = await pool.getConnection();

      // 장바구니 아이템 존재 확인
      const [existingItem] = await connection.execute(
        'SELECT id, user_id, product_id, title FROM cart WHERE id = ?',
        [cartId]
      );

      if (Array.isArray(existingItem) && existingItem.length === 0) {
        throw new AppError(
          '존재하지 않는 장바구니 아이템입니다.',
          404,
          ERROR_CODES.CART_ITEM_NOT_FOUND
        );
      }

      // 장바구니 아이템 삭제
      const [result] = await connection.execute(
        'DELETE FROM cart WHERE id = ?',
        [cartId]
      );

      const response = ApiResponseBuilder.success(
        undefined,
        '상품이 장바구니에서 삭제되었습니다.'
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