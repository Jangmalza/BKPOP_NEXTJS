/**
 * 데이터베이스 쿼리 최적화 유틸리티
 * @fileoverview 데이터베이스 쿼리 최적화 및 캐싱 관련 유틸리티
 * @author Development Team
 * @version 1.0.0
 */

import { pool } from './database';
import { ErrorHandler } from '@/utils';

/**
 * 캐시 인터페이스
 */
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * 메모리 캐시 클래스
 */
class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private maxSize: number = 1000;

  /**
   * 캐시에서 데이터 조회
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // TTL 확인
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * 캐시에 데이터 저장
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // 최대 크기 초과 시 오래된 항목 제거
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * 캐시에서 데이터 삭제
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 패턴에 맞는 캐시 키 삭제
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 캐시 전체 삭제
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 캐시 통계
   */
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

/**
 * 전역 캐시 인스턴스
 */
export const cache = new MemoryCache();

/**
 * 쿼리 최적화 클래스
 */
export class QueryOptimizer {
  /**
   * 캐시된 쿼리 실행
   */
  static async executeWithCache<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    // 캐시에서 확인
    const cachedResult = cache.get<T>(queryKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      // 쿼리 실행
      const result = await queryFn();
      
      // 캐시에 저장
      cache.set(queryKey, result, ttl);
      
      return result;
    } catch (error) {
      ErrorHandler.log(error as Error, 'QueryOptimizer.executeWithCache');
      throw error;
    }
  }

  /**
   * 페이지네이션된 쿼리 실행
   */
  static async executePagedQuery<T>(
    baseQuery: string,
    countQuery: string,
    params: any[],
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: T[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const connection = await pool.getConnection();
    
    try {
      const offset = (page - 1) * pageSize;
      
      // 총 개수 조회
      const [countResult] = await connection.execute(countQuery, params);
      const total = (countResult as any)[0]?.count || 0;
      
      // 데이터 조회
      const pagedQuery = `${baseQuery} LIMIT ${pageSize} OFFSET ${offset}`;
      const [dataResult] = await connection.execute(pagedQuery, params);
      
      return {
        data: dataResult as T[],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } finally {
      connection.release();
    }
  }

  /**
   * 배치 쿼리 실행
   */
  static async executeBatch<T>(
    queries: Array<{ query: string; params: any[] }>
  ): Promise<T[]> {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const results: T[] = [];
      
      for (const { query, params } of queries) {
        const [result] = await connection.execute(query, params);
        results.push(result as T);
      }
      
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 쿼리 성능 모니터링
   */
  static async executeWithMonitoring<T>(
    queryName: string,
    queryFn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await queryFn();
      const duration = Date.now() - startTime;
      
      // 성능 로그 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Query Performance] ${queryName}: ${duration}ms`);
        
        // 느린 쿼리 경고
        if (duration > 1000) {
          console.warn(`[Slow Query] ${queryName} took ${duration}ms`);
        }
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[Query Error] ${queryName} failed after ${duration}ms:`, error);
      throw error;
    }
  }

  /**
   * 인덱스 최적화 제안
   */
  static async analyzeQuery(query: string): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const connection = await pool.getConnection();
    
    try {
      // EXPLAIN 실행
      const [explainResult] = await connection.execute(`EXPLAIN ${query}`);
      
      console.log('[Query Analysis]:', explainResult);
      
      // 최적화 제안 로직 (간단한 예시)
      const rows = explainResult as any[];
      for (const row of rows) {
        if (row.key === null && row.rows > 1000) {
          console.warn('[Optimization Suggestion]: Consider adding an index for table:', row.table);
        }
      }
    } catch (error) {
      console.error('[Query Analysis Error]:', error);
    } finally {
      connection.release();
    }
  }
}

/**
 * 일반적인 쿼리 패턴들
 */
export class CommonQueries {
  /**
   * 사용자 목록 조회 (페이지네이션)
   */
  static async getUsers(page: number = 1, pageSize: number = 10, search?: string) {
    const cacheKey = `users:${page}:${pageSize}:${search || ''}`;
    
    return QueryOptimizer.executeWithCache(
      cacheKey,
      async () => {
        let whereClause = '';
        let params: any[] = [];
        
        if (search) {
          whereClause = 'WHERE name LIKE ? OR email LIKE ?';
          params = [`%${search}%`, `%${search}%`];
        }
        
        const baseQuery = `
          SELECT id, name, email, phone, role, created_at, updated_at 
          FROM users 
          ${whereClause}
          ORDER BY created_at DESC
        `;
        
        const countQuery = `
          SELECT COUNT(*) as count 
          FROM users 
          ${whereClause}
        `;
        
        return QueryOptimizer.executePagedQuery(
          baseQuery,
          countQuery,
          params,
          page,
          pageSize
        );
      },
      2 * 60 * 1000 // 2분 캐시
    );
  }

  /**
   * 상품 목록 조회 (카테고리별)
   */
  static async getProducts(categoryId?: number, page: number = 1, pageSize: number = 10) {
    const cacheKey = `products:${categoryId || 'all'}:${page}:${pageSize}`;
    
    return QueryOptimizer.executeWithCache(
      cacheKey,
      async () => {
        let whereClause = 'WHERE is_active = 1';
        let params: any[] = [];
        
        if (categoryId) {
          whereClause += ' AND category_id = ?';
          params.push(categoryId);
        }
        
        const baseQuery = `
          SELECT p.*, c.name as category_name 
          FROM products p 
          LEFT JOIN categories c ON p.category_id = c.id 
          ${whereClause}
          ORDER BY p.sort_order ASC, p.created_at DESC
        `;
        
        const countQuery = `
          SELECT COUNT(*) as count 
          FROM products p 
          ${whereClause}
        `;
        
        return QueryOptimizer.executePagedQuery(
          baseQuery,
          countQuery,
          params,
          page,
          pageSize
        );
      },
      5 * 60 * 1000 // 5분 캐시
    );
  }

  /**
   * 통계 데이터 조회
   */
  static async getStats() {
    const cacheKey = 'admin:stats';
    
    return QueryOptimizer.executeWithCache(
      cacheKey,
      async () => {
        const connection = await pool.getConnection();
        
        try {
          const queries = [
            { query: 'SELECT COUNT(*) as total FROM users', params: [] },
            { query: 'SELECT COUNT(*) as total FROM products WHERE is_active = 1', params: [] },
            { query: 'SELECT COUNT(*) as total FROM orders', params: [] },
            { query: 'SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status = "completed"', params: [] },
          ];
          
          const results = await QueryOptimizer.executeBatch(queries);
          
          return {
            totalUsers: (results[0] as any)[0]?.total || 0,
            totalProducts: (results[1] as any)[0]?.total || 0,
            totalOrders: (results[2] as any)[0]?.total || 0,
            totalRevenue: (results[3] as any)[0]?.total || 0,
          };
        } finally {
          connection.release();
        }
      },
      1 * 60 * 1000 // 1분 캐시
    );
  }
}

/**
 * 캐시 무효화 헬퍼
 */
export class CacheInvalidator {
  /**
   * 사용자 관련 캐시 무효화
   */
  static invalidateUserCache(userId?: number) {
    if (userId) {
      cache.delete(`user:${userId}`);
    }
    cache.deletePattern('users:.*');
  }

  /**
   * 상품 관련 캐시 무효화
   */
  static invalidateProductCache(productId?: number, categoryId?: number) {
    if (productId) {
      cache.delete(`product:${productId}`);
    }
    if (categoryId) {
      cache.deletePattern(`products:${categoryId}:.*`);
    }
    cache.deletePattern('products:.*');
  }

  /**
   * 통계 캐시 무효화
   */
  static invalidateStatsCache() {
    cache.deletePattern('admin:stats.*');
  }
}

/**
 * 쿼리 빌더 헬퍼
 */
export class QueryBuilder {
  /**
   * 동적 WHERE 절 생성
   */
  static buildWhereClause(conditions: Record<string, any>): { 
    whereClause: string; 
    params: any[] 
  } {
    const whereParts: string[] = [];
    const params: any[] = [];
    
    for (const [field, value] of Object.entries(conditions)) {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          whereParts.push(`${field} IN (${value.map(() => '?').join(', ')})`);
          params.push(...value);
        } else if (typeof value === 'string' && value.includes('%')) {
          whereParts.push(`${field} LIKE ?`);
          params.push(value);
        } else {
          whereParts.push(`${field} = ?`);
          params.push(value);
        }
      }
    }
    
    return {
      whereClause: whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '',
      params,
    };
  }

  /**
   * 동적 ORDER BY 절 생성
   */
  static buildOrderClause(
    sortBy?: string, 
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    allowedFields: string[] = []
  ): string {
    if (!sortBy || !allowedFields.includes(sortBy)) {
      return '';
    }
    
    return `ORDER BY ${sortBy} ${sortOrder}`;
  }
} 