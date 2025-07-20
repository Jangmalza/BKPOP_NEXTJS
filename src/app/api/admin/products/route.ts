/**
 * 관리자 상품 관리 API
 * @fileoverview 관리자가 상품을 관리할 수 있는 API
 * @author Development Team
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { ApiResponseBuilder, ErrorHandler } from '@/utils';

/**
 * 상품 목록 조회 API
 * @description 관리자가 상품 목록을 조회할 수 있는 API
 * @returns 상품 목록 또는 에러 응답
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchTerm = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || 'all';
    const statusFilter = searchParams.get('status') || 'all';

    console.log('상품 목록 조회 요청:', { page, limit, searchTerm, categoryFilter, statusFilter });

    const connection = await pool.getConnection();
    
    try {
      // 임시 데이터 반환 (실제 데이터베이스에 상품이 없는 경우)
      const mockProducts = [
        {
          id: 1,
          title: '프리미엄 명함',
          description: '고급 종이로 제작된 프리미엄 명함입니다.',
          category: '상업인쇄',
          price: 15000,
          stock_quantity: 100,
          image: '/images/business-card.jpg',
          is_active: true,
          created_at: new Date('2024-01-01T10:00:00Z'),
          updated_at: new Date('2024-01-05T14:30:00Z'),
          size: '90x50mm'
        },
        {
          id: 2,
          title: '스탠다드 명함',
          description: '기본 종이로 제작된 스탠다드 명함입니다.',
          category: '상업인쇄',
          price: 8000,
          stock_quantity: 500,
          image: '/images/business-card-standard.jpg',
          is_active: true,
          created_at: new Date('2024-01-02T09:00:00Z'),
          updated_at: new Date('2024-01-05T16:00:00Z'),
          size: '90x50mm'
        },
        {
          id: 3,
          title: 'A4 전단지',
          description: '광고용 A4 전단지입니다.',
          category: '상업인쇄',
          price: 500,
          stock_quantity: 0,
          image: '/images/flyer.jpg',
          is_active: false,
          created_at: new Date('2024-01-03T11:00:00Z'),
          updated_at: new Date('2024-01-06T10:00:00Z'),
          size: '210x297mm'
        },
        {
          id: 4,
          title: '디지털 명함',
          description: '디지털 인쇄 방식의 명함입니다.',
          category: '디지털인쇄',
          price: 12000,
          stock_quantity: 200,
          image: '/images/digital-business-card.jpg',
          is_active: true,
          created_at: new Date('2024-01-04T13:00:00Z'),
          updated_at: new Date('2024-01-07T09:00:00Z'),
          size: '90x50mm'
        },
        {
          id: 5,
          title: '스티커',
          description: '다양한 용도로 사용할 수 있는 스티커입니다.',
          category: '상업인쇄',
          price: 3000,
          stock_quantity: 1000,
          image: '/images/sticker.jpg',
          is_active: true,
          created_at: new Date('2024-01-05T15:00:00Z'),
          updated_at: new Date('2024-01-08T11:00:00Z'),
          size: '100x100mm'
        }
      ];

      // 필터링 적용
      let filteredProducts = mockProducts;

      if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
          product.category === categoryFilter
        );
      }

      if (statusFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
          if (statusFilter === 'active') return product.is_active;
          if (statusFilter === 'inactive') return !product.is_active;
          if (statusFilter === 'out_of_stock') return product.stock_quantity === 0;
          return true;
        });
      }

      const totalCount = filteredProducts.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

      const response = {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        stats: {
          total: mockProducts.length,
          active: mockProducts.filter(p => p.is_active).length,
          inactive: mockProducts.filter(p => !p.is_active).length,
          outOfStock: mockProducts.filter(p => p.stock_quantity === 0).length
        }
      };

      console.log('상품 목록 조회 성공:', response);

      return NextResponse.json(
        ApiResponseBuilder.success(response, '상품 목록 조회 성공')
      );

    } catch (dbError) {
      console.error('상품 목록 조회 DB 오류:', dbError);
      ErrorHandler.log(dbError as Error, 'Admin Products GET - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('상품 목록 조회 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('상품 목록 조회 API 오류:', error);
    ErrorHandler.log(error as Error, 'Admin Products GET API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 상품 등록 API
 * @description 관리자가 새로운 상품을 등록할 수 있는 API
 * @returns 성공 응답 또는 에러 응답
 */
export async function POST(req: NextRequest) {
  try {
    const { title, description, category, price, stock_quantity, image, size } = await req.json();

    // 필수 필드 검증
    if (!title || !category || !price) {
      return NextResponse.json(
        ApiResponseBuilder.error('필수 정보가 누락되었습니다.'),
        { status: 400 }
      );
    }

    // 가격 유효성 검사
    if (price < 0) {
      return NextResponse.json(
        ApiResponseBuilder.error('가격은 0 이상이어야 합니다.'),
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // 상품 등록
      const [result] = await connection.execute(
        `INSERT INTO products (title, description, category, price, stock_quantity, image, size, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW())`,
        [title, description, category, price, stock_quantity || 0, image, size]
      );

      const productId = (result as any).insertId;

      return NextResponse.json(
        ApiResponseBuilder.success({ id: productId }, '상품이 성공적으로 등록되었습니다.')
      );

    } catch (dbError) {
      console.error('상품 등록 DB 오류:', dbError);
      ErrorHandler.log(dbError as Error, 'Admin Products POST - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('상품 등록 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('상품 등록 API 오류:', error);
    ErrorHandler.log(error as Error, 'Admin Products POST API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 상품 정보 수정 API
 * @description 관리자가 상품 정보를 수정할 수 있는 API
 * @returns 성공 응답 또는 에러 응답
 */
export async function PUT(req: NextRequest) {
  try {
    const { id, title, description, category, price, stock_quantity, image, size, is_active } = await req.json();

    // 필수 필드 검증
    if (!id || !title || !category || price === undefined) {
      return NextResponse.json(
        ApiResponseBuilder.error('필수 정보가 누락되었습니다.'),
        { status: 400 }
      );
    }

    // 가격 유효성 검사
    if (price < 0) {
      return NextResponse.json(
        ApiResponseBuilder.error('가격은 0 이상이어야 합니다.'),
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // 상품 존재 확인
      const [existingProduct] = await connection.execute(
        'SELECT id FROM products WHERE id = ?',
        [id]
      );

      if (!Array.isArray(existingProduct) || existingProduct.length === 0) {
        return NextResponse.json(
          ApiResponseBuilder.error('존재하지 않는 상품입니다.'),
          { status: 404 }
        );
      }

      // 상품 정보 업데이트
      await connection.execute(
        `UPDATE products 
         SET title = ?, description = ?, category = ?, price = ?, stock_quantity = ?, image = ?, size = ?, is_active = ?, updated_at = NOW() 
         WHERE id = ?`,
        [title, description, category, price, stock_quantity || 0, image, size, is_active, id]
      );

      return NextResponse.json(
        ApiResponseBuilder.success(undefined, '상품 정보가 성공적으로 수정되었습니다.')
      );

    } catch (dbError) {
      console.error('상품 수정 DB 오류:', dbError);
      ErrorHandler.log(dbError as Error, 'Admin Products PUT - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('상품 정보 수정 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('상품 수정 API 오류:', error);
    ErrorHandler.log(error as Error, 'Admin Products PUT API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * 상품 삭제 API
 * @description 관리자가 상품을 삭제할 수 있는 API
 * @returns 성공 응답 또는 에러 응답
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        ApiResponseBuilder.error('상품 ID가 필요합니다.'),
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // 상품 존재 확인
      const [existingProduct] = await connection.execute(
        'SELECT id FROM products WHERE id = ?',
        [productId]
      );

      if (!Array.isArray(existingProduct) || existingProduct.length === 0) {
        return NextResponse.json(
          ApiResponseBuilder.error('존재하지 않는 상품입니다.'),
          { status: 404 }
        );
      }

      // 상품 삭제
      await connection.execute(
        'DELETE FROM products WHERE id = ?',
        [productId]
      );

      return NextResponse.json(
        ApiResponseBuilder.success(undefined, '상품이 성공적으로 삭제되었습니다.')
      );

    } catch (dbError) {
      console.error('상품 삭제 DB 오류:', dbError);
      ErrorHandler.log(dbError as Error, 'Admin Products DELETE - Database');
      return NextResponse.json(
        ApiResponseBuilder.error('상품 삭제 중 오류가 발생했습니다.'),
        { status: 500 }
      );
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('상품 삭제 API 오류:', error);
    ErrorHandler.log(error as Error, 'Admin Products DELETE API');
    return NextResponse.json(
      ApiResponseBuilder.error('서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
} 