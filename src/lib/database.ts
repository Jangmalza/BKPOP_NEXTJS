/**
 * 데이터베이스 연결 및 관리
 * @fileoverview MySQL 데이터베이스 연결 풀 관리 및 초기화
 * @author Development Team
 * @version 1.0.0
 */

import mysql from 'mysql2/promise';
import { getDatabaseConfig, AppConfig } from '@/lib/config';
import { AppError, ERROR_CODES, ErrorHandler } from '@/utils';

/**
 * 데이터베이스 연결 풀
 * @description MySQL 연결 풀을 생성하고 관리
 */
export const pool = mysql.createPool(getDatabaseConfig());

/**
 * 데이터베이스 연결 테스트
 * @description 데이터베이스 연결 상태를 확인
 * @returns 연결 성공 여부
 */
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    console.log('✅ MySQL 데이터베이스 연결 성공');
    return true;
  } catch (error) {
    ErrorHandler.log(error as Error, 'Database Connection Test');
    console.error('❌ MySQL 데이터베이스 연결 실패:', error);
    return false;
  }
}

/**
 * 데이터베이스 초기화
 * @description 필요한 테이블들을 생성하고 초기 데이터를 설정
 * @throws {AppError} 데이터베이스 초기화 실패 시
 */
export async function initDatabase(): Promise<void> {
  let connection;
  
  try {
    connection = await pool.getConnection();
    const dbConfig = getDatabaseConfig();
    
    console.log('🔄 데이터베이스 초기화 시작...');
    
    // 데이터베이스 생성 (존재하지 않는 경우)
    try {
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
      await connection.execute(`USE ${dbConfig.database}`);
      console.log(`✅ 데이터베이스 '${dbConfig.database}' 준비 완료`);
    } catch (dbError) {
      console.log('⚠️  데이터베이스 생성 중 오류 (일반적으로 무시 가능):', dbError);
    }
    
    // users 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL COMMENT '사용자 이름',
        email VARCHAR(255) UNIQUE NOT NULL COMMENT '이메일 주소',
        password VARCHAR(255) NOT NULL COMMENT '암호화된 비밀번호',
        phone VARCHAR(20) COMMENT '전화번호',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
        
        INDEX idx_users_email (email),
        INDEX idx_users_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 정보 테이블'
    `);
    console.log('✅ users 테이블 생성 완료');
    
    // cart 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL COMMENT '사용자 ID',
        product_id INT NOT NULL COMMENT '상품 ID',
        title VARCHAR(255) NOT NULL COMMENT '상품 제목',
        image TEXT COMMENT '상품 이미지 URL',
        size VARCHAR(50) COMMENT '상품 크기',
        price INT NOT NULL COMMENT '상품 가격',
        quantity INT NOT NULL DEFAULT 1 COMMENT '수량',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id) COMMENT '사용자별 상품 중복 방지',
        INDEX idx_cart_user_id (user_id),
        INDEX idx_cart_product_id (product_id),
        INDEX idx_cart_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='장바구니 테이블'
    `);
    console.log('✅ cart 테이블 생성 완료');
    
    // 추가 테이블들 (필요시 확장 가능)
    await createProductsTable(connection);
    await createOrdersTable(connection);
    
    console.log('✅ 데이터베이스 초기화 완료');
    
  } catch (error) {
    ErrorHandler.log(error as Error, 'Database Initialization');
    throw new AppError(
      '데이터베이스 초기화 중 오류가 발생했습니다.',
      500,
      ERROR_CODES.DATABASE_CONNECTION_ERROR
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * 상품 테이블 생성
 * @param connection - 데이터베이스 연결 객체
 */
async function createProductsTable(connection: mysql.PoolConnection): Promise<void> {
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL COMMENT '상품 제목',
        description TEXT COMMENT '상품 설명',
        category VARCHAR(100) NOT NULL COMMENT '카테고리',
        subcategory VARCHAR(100) COMMENT '서브카테고리',
        price INT NOT NULL COMMENT '가격',
        image TEXT COMMENT '메인 이미지 URL',
        images JSON COMMENT '추가 이미지 URLs',
        size VARCHAR(50) COMMENT '크기',
        stock_quantity INT DEFAULT 0 COMMENT '재고 수량',
        is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
        
        INDEX idx_products_category (category),
        INDEX idx_products_subcategory (subcategory),
        INDEX idx_products_is_active (is_active),
        INDEX idx_products_created_at (created_at),
        FULLTEXT idx_products_search (title, description)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품 정보 테이블'
    `);
    console.log('✅ products 테이블 생성 완료');
  } catch (error) {
    console.log('⚠️  products 테이블 생성 중 오류:', error);
  }
}

/**
 * 주문 테이블 생성
 * @param connection - 데이터베이스 연결 객체
 */
async function createOrdersTable(connection: mysql.PoolConnection): Promise<void> {
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL COMMENT '사용자 ID',
        order_number VARCHAR(50) UNIQUE NOT NULL COMMENT '주문 번호',
        total_amount INT NOT NULL COMMENT '총 주문 금액',
        status ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled') DEFAULT 'pending' COMMENT '주문 상태',
        shipping_address JSON COMMENT '배송 주소',
        payment_method VARCHAR(50) COMMENT '결제 방법',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending' COMMENT '결제 상태',
        notes TEXT COMMENT '주문 메모',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_orders_user_id (user_id),
        INDEX idx_orders_order_number (order_number),
        INDEX idx_orders_status (status),
        INDEX idx_orders_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주문 정보 테이블'
    `);
    console.log('✅ orders 테이블 생성 완료');
    
    // 주문 상세 테이블
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL COMMENT '주문 ID',
        product_id INT NOT NULL COMMENT '상품 ID',
        title VARCHAR(255) NOT NULL COMMENT '상품 제목',
        image TEXT COMMENT '상품 이미지 URL',
        size VARCHAR(50) COMMENT '상품 크기',
        price INT NOT NULL COMMENT '상품 가격',
        quantity INT NOT NULL COMMENT '수량',
        subtotal INT NOT NULL COMMENT '소계',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
        
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_order_items_order_id (order_id),
        INDEX idx_order_items_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주문 상세 테이블'
    `);
    console.log('✅ order_items 테이블 생성 완료');
    
  } catch (error) {
    console.log('⚠️  orders 테이블 생성 중 오류:', error);
  }
}

/**
 * 시스템 데이터베이스 연결 (관리자 권한)
 * @description 데이터베이스 생성 및 사용자 권한 설정을 위한 시스템 연결
 * @returns 연결 성공 여부
 */
export async function connectToSystem(): Promise<boolean> {
  try {
    const dbConfig = getDatabaseConfig();
    const systemConfig = {
      ...dbConfig,
      database: 'mysql' // 시스템 데이터베이스
    };
    
    const systemPool = mysql.createPool(systemConfig);
    const connection = await systemPool.getConnection();
    
    // 데이터베이스 생성
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    
    // 사용자 생성 및 권한 부여 (이미 존재하면 무시)
    try {
      await connection.execute(`
        CREATE USER IF NOT EXISTS '${dbConfig.user}'@'${dbConfig.host}' 
        IDENTIFIED BY '${dbConfig.password}'
      `);
      
      await connection.execute(`
        GRANT ALL PRIVILEGES ON ${dbConfig.database}.* 
        TO '${dbConfig.user}'@'${dbConfig.host}'
      `);
      
      await connection.execute('FLUSH PRIVILEGES');
      console.log('✅ 사용자 권한 설정 완료');
    } catch (userError) {
      console.log('⚠️  사용자 생성 중 오류 (무시 가능):', userError);
    }
    
    connection.release();
    await systemPool.end();
    return true;
    
  } catch (error) {
    ErrorHandler.log(error as Error, 'System Database Connection');
    console.error('❌ 시스템 데이터베이스 연결 실패:', error);
    return false;
  }
}

/**
 * 데이터베이스 연결 풀 종료
 * @description 애플리케이션 종료 시 연결 풀을 정리
 */
export async function closePool(): Promise<void> {
  try {
    await pool.end();
    console.log('✅ 데이터베이스 연결 풀 종료');
  } catch (error) {
    ErrorHandler.log(error as Error, 'Database Pool Close');
    console.error('❌ 데이터베이스 연결 풀 종료 실패:', error);
  }
}

/**
 * 데이터베이스 상태 확인
 * @description 데이터베이스 연결 상태 및 기본 정보 확인
 * @returns 데이터베이스 상태 정보
 */
export async function getDatabaseStatus(): Promise<{
  connected: boolean;
  version?: string;
  activeConnections?: number;
  maxConnections?: number;
}> {
  try {
    const connection = await pool.getConnection();
    
    // MySQL 버전 확인
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    const version = (versionResult as any)[0]?.version;
    
    // 연결 상태 확인
    const [statusResult] = await connection.execute('SHOW STATUS LIKE "Threads_connected"');
    const activeConnections = (statusResult as any)[0]?.Value;
    
    const [maxResult] = await connection.execute('SHOW VARIABLES LIKE "max_connections"');
    const maxConnections = (maxResult as any)[0]?.Value;
    
    connection.release();
    
    return {
      connected: true,
      version,
      activeConnections: parseInt(activeConnections),
      maxConnections: parseInt(maxConnections)
    };
    
  } catch (error) {
    ErrorHandler.log(error as Error, 'Database Status Check');
    return { connected: false };
  }
}

// 프로세스 종료 시 연결 풀 정리
process.on('SIGINT', async () => {
  console.log('\n🔄 애플리케이션 종료 중...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 애플리케이션 종료 중...');
  await closePool();
  process.exit(0);
}); 