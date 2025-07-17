-- =============================================
-- 보광 인쇄몰 데이터베이스 스키마
-- =============================================

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS bkpop_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bkpop_db;

-- =============================================
-- 1. 사용자 관련 테이블
-- =============================================

-- 사용자 테이블
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '사용자 이름',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT '이메일 주소',
    password VARCHAR(255) NOT NULL COMMENT '암호화된 비밀번호',
    phone VARCHAR(20) COMMENT '전화번호',
    role ENUM('user', 'admin', 'super_admin') DEFAULT 'user' COMMENT '사용자 역할',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active' COMMENT '계정 상태',
    last_login TIMESTAMP NULL COMMENT '마지막 로그인 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status),
    INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 정보 테이블';

-- 사용자 주소 테이블
CREATE TABLE user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_type ENUM('home', 'work', 'other') DEFAULT 'home' COMMENT '주소 타입',
    recipient_name VARCHAR(100) NOT NULL COMMENT '받는 사람 이름',
    phone VARCHAR(20) NOT NULL COMMENT '연락처',
    postal_code VARCHAR(10) NOT NULL COMMENT '우편번호',
    address VARCHAR(255) NOT NULL COMMENT '주소',
    detail_address VARCHAR(255) COMMENT '상세 주소',
    is_default BOOLEAN DEFAULT FALSE COMMENT '기본 주소 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_addresses_user_id (user_id),
    INDEX idx_user_addresses_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 주소 테이블';

-- =============================================
-- 2. 상품 관련 테이블
-- =============================================

-- 상품 카테고리 테이블
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '카테고리 이름',
    slug VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL 슬러그',
    description TEXT COMMENT '카테고리 설명',
    parent_id INT NULL COMMENT '부모 카테고리 ID',
    sort_order INT DEFAULT 0 COMMENT '정렬 순서',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_parent_id (parent_id),
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_is_active (is_active),
    INDEX idx_categories_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품 카테고리 테이블';

-- 상품 테이블
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL COMMENT '상품 제목',
    slug VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL 슬러그',
    description TEXT COMMENT '상품 설명',
    short_description VARCHAR(500) COMMENT '간단한 설명',
    price INT NOT NULL COMMENT '가격',
    compare_price INT NULL COMMENT '할인 전 가격',
    cost_price INT NULL COMMENT '원가',
    sku VARCHAR(100) UNIQUE COMMENT '상품 코드',
    barcode VARCHAR(100) COMMENT '바코드',
    stock_quantity INT DEFAULT 0 COMMENT '재고 수량',
    min_order_quantity INT DEFAULT 1 COMMENT '최소 주문 수량',
    max_order_quantity INT NULL COMMENT '최대 주문 수량',
    weight DECIMAL(10,2) NULL COMMENT '무게(kg)',
    dimensions VARCHAR(100) COMMENT '크기 정보',
    is_digital BOOLEAN DEFAULT FALSE COMMENT '디지털 상품 여부',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '추천 상품 여부',
    meta_title VARCHAR(255) COMMENT 'SEO 제목',
    meta_description VARCHAR(500) COMMENT 'SEO 설명',
    view_count INT DEFAULT 0 COMMENT '조회수',
    sort_order INT DEFAULT 0 COMMENT '정렬 순서',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_products_category_id (category_id),
    INDEX idx_products_slug (slug),
    INDEX idx_products_sku (sku),
    INDEX idx_products_is_active (is_active),
    INDEX idx_products_is_featured (is_featured),
    INDEX idx_products_price (price),
    INDEX idx_products_created_at (created_at),
    INDEX idx_products_view_count (view_count),
    FULLTEXT idx_products_search (title, description, short_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품 정보 테이블';

-- 상품 이미지 테이블
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL COMMENT '이미지 URL',
    alt_text VARCHAR(255) COMMENT '대체 텍스트',
    sort_order INT DEFAULT 0 COMMENT '정렬 순서',
    is_primary BOOLEAN DEFAULT FALSE COMMENT '메인 이미지 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_images_product_id (product_id),
    INDEX idx_product_images_is_primary (is_primary),
    INDEX idx_product_images_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품 이미지 테이블';

-- 상품 옵션 그룹 테이블
CREATE TABLE product_option_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT '옵션 그룹 이름',
    sort_order INT DEFAULT 0 COMMENT '정렬 순서',
    is_required BOOLEAN DEFAULT FALSE COMMENT '필수 옵션 여부',
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_option_groups_product_id (product_id),
    INDEX idx_product_option_groups_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품 옵션 그룹 테이블';

-- 상품 옵션 테이블
CREATE TABLE product_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    option_group_id INT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT '옵션 이름',
    price_modifier INT DEFAULT 0 COMMENT '가격 변동',
    sort_order INT DEFAULT 0 COMMENT '정렬 순서',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    
    FOREIGN KEY (option_group_id) REFERENCES product_option_groups(id) ON DELETE CASCADE,
    INDEX idx_product_options_option_group_id (option_group_id),
    INDEX idx_product_options_sort_order (sort_order),
    INDEX idx_product_options_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품 옵션 테이블';

-- =============================================
-- 3. 장바구니 관련 테이블
-- =============================================

-- 장바구니 테이블
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL COMMENT '사용자 ID (로그인 사용자)',
    session_id VARCHAR(255) NULL COMMENT '세션 ID (비로그인 사용자)',
    product_id INT NOT NULL COMMENT '상품 ID',
    title VARCHAR(255) NOT NULL COMMENT '상품 제목',
    image VARCHAR(500) COMMENT '상품 이미지 URL',
    size VARCHAR(100) COMMENT '상품 크기',
    price INT NOT NULL COMMENT '상품 가격',
    quantity INT NOT NULL DEFAULT 1 COMMENT '수량',
    options JSON COMMENT '선택된 옵션들',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_cart_user_id (user_id),
    INDEX idx_cart_session_id (session_id),
    INDEX idx_cart_product_id (product_id),
    INDEX idx_cart_created_at (created_at),
    INDEX idx_cart_user_product (user_id, product_id) COMMENT '사용자별 상품 조회 최적화'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='장바구니 테이블';

-- =============================================
-- 4. 주문 관련 테이블
-- =============================================

-- 주문 테이블
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '사용자 ID',
    order_number VARCHAR(50) UNIQUE NOT NULL COMMENT '주문 번호',
    status ENUM('pending', 'confirmed', 'processing', 'printing', 'shipping', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending' COMMENT '주문 상태',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'partial_refunded') DEFAULT 'pending' COMMENT '결제 상태',
    payment_method VARCHAR(50) COMMENT '결제 방법',
    payment_gateway VARCHAR(50) COMMENT '결제 게이트웨이',
    transaction_id VARCHAR(100) COMMENT '거래 ID',
    
    -- 금액 정보
    subtotal INT NOT NULL COMMENT '상품 금액',
    tax_amount INT DEFAULT 0 COMMENT '세금',
    shipping_amount INT DEFAULT 0 COMMENT '배송비',
    discount_amount INT DEFAULT 0 COMMENT '할인 금액',
    total_amount INT NOT NULL COMMENT '총 주문 금액',
    
    -- 배송 정보
    shipping_method VARCHAR(50) COMMENT '배송 방법',
    shipping_address JSON COMMENT '배송 주소',
    tracking_number VARCHAR(100) COMMENT '배송 추적 번호',
    
    -- 기타 정보
    notes TEXT COMMENT '주문 메모',
    admin_notes TEXT COMMENT '관리자 메모',
    cancelled_at TIMESTAMP NULL COMMENT '취소 시간',
    shipped_at TIMESTAMP NULL COMMENT '배송 시작 시간',
    delivered_at TIMESTAMP NULL COMMENT '배송 완료 시간',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_order_number (order_number),
    INDEX idx_orders_status (status),
    INDEX idx_orders_payment_status (payment_status),
    INDEX idx_orders_created_at (created_at),
    INDEX idx_orders_total_amount (total_amount)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주문 정보 테이블';

-- 주문 상세 테이블
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL COMMENT '주문 ID',
    product_id INT NOT NULL COMMENT '상품 ID',
    title VARCHAR(255) NOT NULL COMMENT '상품 제목',
    image VARCHAR(500) COMMENT '상품 이미지 URL',
    size VARCHAR(100) COMMENT '상품 크기',
    price INT NOT NULL COMMENT '상품 가격',
    quantity INT NOT NULL COMMENT '수량',
    options JSON COMMENT '선택된 옵션들',
    subtotal INT NOT NULL COMMENT '소계',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주문 상세 테이블';

-- =============================================
-- 5. 쿠폰 및 할인 관련 테이블
-- =============================================

-- 쿠폰 테이블
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT '쿠폰 코드',
    name VARCHAR(100) NOT NULL COMMENT '쿠폰 이름',
    description TEXT COMMENT '쿠폰 설명',
    type ENUM('percentage', 'fixed_amount', 'free_shipping') NOT NULL COMMENT '할인 타입',
    value INT NOT NULL COMMENT '할인 값',
    minimum_amount INT DEFAULT 0 COMMENT '최소 주문 금액',
    maximum_discount INT NULL COMMENT '최대 할인 금액',
    usage_limit INT NULL COMMENT '사용 제한 횟수',
    usage_count INT DEFAULT 0 COMMENT '사용된 횟수',
    user_usage_limit INT DEFAULT 1 COMMENT '사용자당 사용 제한',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    starts_at TIMESTAMP NULL COMMENT '시작 시간',
    expires_at TIMESTAMP NULL COMMENT '만료 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_coupons_code (code),
    INDEX idx_coupons_is_active (is_active),
    INDEX idx_coupons_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='쿠폰 테이블';

-- 쿠폰 사용 내역 테이블
CREATE TABLE coupon_usages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_amount INT NOT NULL COMMENT '할인 금액',
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '사용 시간',
    
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_coupon_usages_coupon_id (coupon_id),
    INDEX idx_coupon_usages_user_id (user_id),
    INDEX idx_coupon_usages_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='쿠폰 사용 내역 테이블';

-- =============================================
-- 6. 리뷰 및 평점 관련 테이블
-- =============================================

-- 상품 리뷰 테이블
CREATE TABLE product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NULL COMMENT '주문 ID (구매 확인용)',
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5) COMMENT '평점',
    title VARCHAR(255) COMMENT '리뷰 제목',
    content TEXT COMMENT '리뷰 내용',
    images JSON COMMENT '리뷰 이미지들',
    is_verified BOOLEAN DEFAULT FALSE COMMENT '구매 확인 여부',
    is_approved BOOLEAN DEFAULT FALSE COMMENT '승인 여부',
    approved_at TIMESTAMP NULL COMMENT '승인 시간',
    helpful_count INT DEFAULT 0 COMMENT '도움이 된 횟수',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_product_reviews_product_id (product_id),
    INDEX idx_product_reviews_user_id (user_id),
    INDEX idx_product_reviews_order_id (order_id),
    INDEX idx_product_reviews_rating (rating),
    INDEX idx_product_reviews_is_approved (is_approved),
    INDEX idx_product_reviews_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품 리뷰 테이블';

-- =============================================
-- 7. 파일 업로드 관련 테이블
-- =============================================

-- 파일 업로드 테이블
CREATE TABLE file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    order_id INT NULL,
    original_name VARCHAR(255) NOT NULL COMMENT '원본 파일명',
    file_name VARCHAR(255) NOT NULL COMMENT '저장된 파일명',
    file_path VARCHAR(500) NOT NULL COMMENT '파일 경로',
    file_size INT NOT NULL COMMENT '파일 크기',
    mime_type VARCHAR(100) NOT NULL COMMENT 'MIME 타입',
    file_type ENUM('design', 'proof', 'document', 'image', 'other') DEFAULT 'other' COMMENT '파일 타입',
    status ENUM('uploaded', 'processing', 'approved', 'rejected') DEFAULT 'uploaded' COMMENT '파일 상태',
    notes TEXT COMMENT '메모',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_file_uploads_user_id (user_id),
    INDEX idx_file_uploads_order_id (order_id),
    INDEX idx_file_uploads_file_type (file_type),
    INDEX idx_file_uploads_status (status),
    INDEX idx_file_uploads_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='파일 업로드 테이블';

-- =============================================
-- 8. 공지사항 및 게시판 관련 테이블
-- =============================================

-- 공지사항 테이블
CREATE TABLE notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '공지사항 제목',
    content TEXT NOT NULL COMMENT '공지사항 내용',
    type ENUM('notice', 'event', 'maintenance', 'update') DEFAULT 'notice' COMMENT '공지사항 타입',
    is_important BOOLEAN DEFAULT FALSE COMMENT '중요 공지사항 여부',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    view_count INT DEFAULT 0 COMMENT '조회수',
    starts_at TIMESTAMP NULL COMMENT '게시 시작 시간',
    ends_at TIMESTAMP NULL COMMENT '게시 종료 시간',
    created_by INT NOT NULL COMMENT '작성자 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_notices_type (type),
    INDEX idx_notices_is_important (is_important),
    INDEX idx_notices_is_active (is_active),
    INDEX idx_notices_created_at (created_at),
    INDEX idx_notices_starts_at (starts_at),
    INDEX idx_notices_ends_at (ends_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='공지사항 테이블';

-- FAQ 테이블
CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL COMMENT 'FAQ 카테고리',
    question VARCHAR(500) NOT NULL COMMENT '질문',
    answer TEXT NOT NULL COMMENT '답변',
    sort_order INT DEFAULT 0 COMMENT '정렬 순서',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    view_count INT DEFAULT 0 COMMENT '조회수',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_faqs_category (category),
    INDEX idx_faqs_is_active (is_active),
    INDEX idx_faqs_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='FAQ 테이블';

-- =============================================
-- 9. 관리자 로그 및 설정 관련 테이블
-- =============================================

-- 관리자 활동 로그 테이블
CREATE TABLE admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL COMMENT '실행한 액션',
    target_type VARCHAR(50) COMMENT '대상 타입',
    target_id INT COMMENT '대상 ID',
    details JSON COMMENT '상세 정보',
    ip_address VARCHAR(45) COMMENT 'IP 주소',
    user_agent TEXT COMMENT '사용자 에이전트',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_logs_user_id (user_id),
    INDEX idx_admin_logs_action (action),
    INDEX idx_admin_logs_target_type (target_type),
    INDEX idx_admin_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='관리자 활동 로그 테이블';

-- 시스템 설정 테이블
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL COMMENT '설정 키',
    value TEXT COMMENT '설정 값',
    description VARCHAR(255) COMMENT '설명',
    group_name VARCHAR(50) COMMENT '그룹명',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    updated_by INT COMMENT '수정자 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_system_settings_key_name (key_name),
    INDEX idx_system_settings_group_name (group_name),
    INDEX idx_system_settings_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시스템 설정 테이블';

-- =============================================
-- 10. 기본 데이터 삽입
-- =============================================

-- 기본 카테고리 데이터
INSERT INTO categories (name, slug, description, sort_order) VALUES
('상업인쇄', 'commercial-print', '명함, 전단지, 브로셔 등 상업용 인쇄물', 1),
('디지털인쇄', 'digital-print', '디지털 방식의 인쇄 서비스', 2),
('판촉물', 'promotional', '부채, 포스트잇, 캘린더 등 판촉용 상품', 3),
('패키지', 'package', '박스, 쇼핑백, 포장지 등 패키지 상품', 4),
('기획상품', 'planning', '프리컷팅, 샘플북 등 기획 상품', 5),
('셀프디자인', 'self-design', '로고디자인, 명함디자인 등 디자인 서비스', 6),
('실사출력', 'large-format', '배너, 현수막, 포스터 등 대형 출력물', 7);

-- 상업인쇄 서브카테고리
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('명함', 'business-card', '다양한 명함 제작 서비스', 1, 1),
('봉투', 'envelope', '각종 봉투 제작 서비스', 1, 2),
('전단지', 'flyer', '전단지 및 리플릿 제작', 1, 3),
('스티커', 'sticker', '다양한 스티커 제작', 1, 4),
('홍보물', 'promotion', '브로셔, 카탈로그 등 홍보 자료', 1, 5);

-- 기본 시스템 설정
INSERT INTO system_settings (key_name, value, description, group_name) VALUES
('site_title', '보광 - 국민인쇄몰', '사이트 제목', 'general'),
('site_description', '빠른 납기, 합리적인 가격의 인쇄 서비스', '사이트 설명', 'general'),
('default_shipping_fee', '3000', '기본 배송비', 'shipping'),
('free_shipping_threshold', '50000', '무료 배송 최소 금액', 'shipping'),
('order_number_prefix', 'BK', '주문 번호 접두사', 'order'),
('admin_email', 'admin@bkpop.com', '관리자 이메일', 'contact'),
('customer_service_phone', '02-1234-5678', '고객센터 전화번호', 'contact'),
('business_hours', '평일 09:00-18:00', '영업 시간', 'contact');

-- 기본 FAQ 데이터
INSERT INTO faqs (category, question, answer, sort_order) VALUES
('주문', '주문 후 취소나 변경이 가능한가요?', '주문 확인 후 제작 전까지는 취소나 변경이 가능합니다. 제작이 시작된 후에는 취소나 변경이 어려울 수 있습니다.', 1),
('배송', '배송은 얼마나 걸리나요?', '일반적으로 제작 완료 후 1-2일 내 배송됩니다. 지역에 따라 배송 시간이 다를 수 있습니다.', 2),
('결제', '어떤 결제 방법을 사용할 수 있나요?', '신용카드, 계좌이체, 무통장입금 등 다양한 결제 방법을 지원합니다.', 3),
('품질', '인쇄 품질은 어떻게 보장되나요?', '최신 인쇄 장비와 엄격한 품질 검사를 통해 최상의 품질을 보장합니다.', 4);

-- =============================================
-- 11. 인덱스 최적화 및 성능 개선
-- =============================================

-- 복합 인덱스 추가
ALTER TABLE products ADD INDEX idx_products_category_active (category_id, is_active);
ALTER TABLE products ADD INDEX idx_products_featured_active (is_featured, is_active);
ALTER TABLE orders ADD INDEX idx_orders_user_status (user_id, status);
ALTER TABLE orders ADD INDEX idx_orders_created_status (created_at, status);
ALTER TABLE cart ADD INDEX idx_cart_user_session (user_id, session_id);

-- 전체 텍스트 검색 인덱스
ALTER TABLE products ADD FULLTEXT idx_products_fulltext (title, description, short_description);
ALTER TABLE notices ADD FULLTEXT idx_notices_fulltext (title, content);
ALTER TABLE faqs ADD FULLTEXT idx_faqs_fulltext (question, answer);

-- =============================================
-- 12. 뷰(View) 생성
-- =============================================

-- 상품 통계 뷰
CREATE VIEW product_stats AS
SELECT 
    p.id,
    p.title,
    p.price,
    p.stock_quantity,
    p.view_count,
    COALESCE(AVG(pr.rating), 0) as avg_rating,
    COUNT(pr.id) as review_count,
    COALESCE(SUM(oi.quantity), 0) as total_sold
FROM products p
LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = TRUE
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('delivered', 'completed')
GROUP BY p.id;

-- 사용자 주문 통계 뷰
CREATE VIEW user_order_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_spent,
    MAX(o.created_at) as last_order_date,
    AVG(o.total_amount) as avg_order_value
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- =============================================
-- 13. 저장 프로시저 생성
-- =============================================

DELIMITER //

-- 주문 번호 생성 프로시저
CREATE PROCEDURE GenerateOrderNumber(OUT order_number VARCHAR(50))
BEGIN
    DECLARE next_id INT;
    DECLARE prefix VARCHAR(10);
    
    SELECT value INTO prefix FROM system_settings WHERE key_name = 'order_number_prefix';
    
    SELECT AUTO_INCREMENT INTO next_id 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders';
    
    SET order_number = CONCAT(prefix, DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(next_id, 4, '0'));
END //

-- 재고 업데이트 프로시저
CREATE PROCEDURE UpdateProductStock(IN product_id INT, IN quantity_change INT)
BEGIN
    DECLARE current_stock INT;
    
    SELECT stock_quantity INTO current_stock FROM products WHERE id = product_id;
    
    IF current_stock + quantity_change >= 0 THEN
        UPDATE products SET stock_quantity = stock_quantity + quantity_change WHERE id = product_id;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '재고가 부족합니다.';
    END IF;
END //

DELIMITER ;

-- =============================================
-- 14. 트리거 생성
-- =============================================

DELIMITER //

-- 주문 생성 시 재고 차감 트리거
CREATE TRIGGER tr_order_items_stock_decrease
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    CALL UpdateProductStock(NEW.product_id, -NEW.quantity);
END //

-- 주문 취소 시 재고 복원 트리거
CREATE TRIGGER tr_orders_stock_restore
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE products p
        INNER JOIN order_items oi ON p.id = oi.product_id
        SET p.stock_quantity = p.stock_quantity + oi.quantity
        WHERE oi.order_id = NEW.id;
    END IF;
END //

-- 상품 조회수 증가 트리거
CREATE TRIGGER tr_products_view_count
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.view_count != NEW.view_count THEN
        INSERT INTO admin_logs (user_id, action, target_type, target_id, details, created_at)
        VALUES (0, 'view_product', 'product', NEW.id, 
                JSON_OBJECT('old_count', OLD.view_count, 'new_count', NEW.view_count), 
                NOW());
    END IF;
END //

DELIMITER ;

-- =============================================
-- 스키마 생성 완료
-- ============================================= 