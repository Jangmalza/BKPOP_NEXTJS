# 보광 인쇄몰 데이터베이스 설치 가이드

## 📋 개요
이 가이드는 보광 인쇄몰 프로젝트의 MySQL 데이터베이스 설치 및 설정 방법을 안내합니다.

## 🔧 준비사항
- MySQL Server 8.0 이상
- MySQL Workbench 또는 phpMyAdmin (선택사항)
- 터미널 또는 명령 프롬프트 접근 권한

## 📂 스키마 구조
```
📁 Database Schema
├── 14개 핵심 테이블
├── 2개 View
├── 2개 저장 프로시저
├── 3개 트리거
└── 기본 데이터 삽입
```

## 🚀 설치 단계

### 1. MySQL 서버 설치 (macOS)
```bash
# Homebrew를 사용한 설치
brew install mysql

# MySQL 서비스 시작
brew services start mysql

# 보안 설정
mysql_secure_installation
```

### 2. MySQL 서버 설치 (Ubuntu/Debian)
```bash
# MySQL 서버 설치
sudo apt update
sudo apt install mysql-server

# 서비스 시작
sudo systemctl start mysql
sudo systemctl enable mysql

# 보안 설정
sudo mysql_secure_installation
```

### 3. MySQL 서버 설치 (Windows)
1. [MySQL 공식 홈페이지](https://dev.mysql.com/downloads/installer/)에서 MySQL Installer 다운로드
2. 설치 프로그램 실행 후 설정 완료
3. MySQL Workbench 또는 명령 프롬프트에서 접속

### 4. 데이터베이스 생성 및 스키마 적용

#### 방법 1: MySQL 명령줄 클라이언트 사용
```bash
# MySQL 접속
mysql -u root -p

# 스키마 파일 실행
mysql> source database_schema.sql;

# 또는 직접 파일 실행
mysql -u root -p < database_schema.sql
```

#### 방법 2: MySQL Workbench 사용
1. MySQL Workbench 실행
2. 로컬 MySQL 인스턴스 연결
3. `File` > `Open SQL Script...` > `database_schema.sql` 선택
4. 스크립트 실행 (⚡ 버튼 또는 Ctrl+Shift+Enter)

### 5. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=bkpop_db
DB_PORT=3306

# 애플리케이션 설정
JWT_SECRET=your_jwt_secret_here
BCRYPT_ROUNDS=12
```

### 6. 데이터베이스 연결 테스트
```bash
# 프로젝트 디렉토리에서 실행
npm run dev

# 또는 데이터베이스 초기화 API 호출
curl -X POST http://localhost:3000/api/init-db
```

## 📊 생성되는 테이블 목록

### 1. 사용자 관련 테이블
- `users` - 사용자 정보
- `user_addresses` - 사용자 주소

### 2. 상품 관련 테이블
- `categories` - 상품 카테고리
- `products` - 상품 정보
- `product_images` - 상품 이미지
- `product_option_groups` - 상품 옵션 그룹
- `product_options` - 상품 옵션

### 3. 주문/장바구니 관련 테이블
- `cart` - 장바구니
- `orders` - 주문 정보
- `order_items` - 주문 상세

### 4. 마케팅 관련 테이블
- `coupons` - 쿠폰
- `coupon_usages` - 쿠폰 사용 내역
- `product_reviews` - 상품 리뷰

### 5. 콘텐츠 관리 테이블
- `notices` - 공지사항
- `faqs` - 자주묻는질문
- `file_uploads` - 파일 업로드

### 6. 관리자 관련 테이블
- `admin_logs` - 관리자 활동 로그
- `system_settings` - 시스템 설정

## 🔐 기본 관리자 계정
스키마 실행 후 다음 관리자 계정이 자동으로 생성됩니다:

```
이메일: admin@bkpop.com
비밀번호: admin123!
역할: super_admin
```

⚠️ **보안 주의사항**: 최초 로그인 후 반드시 비밀번호를 변경하세요.

## 🎯 주요 기능

### 1. 자동 주문 번호 생성
```sql
-- 주문 번호 생성 예시
CALL GenerateOrderNumber(@order_num);
-- 결과: BK202501150001
```

### 2. 재고 관리
```sql
-- 재고 업데이트
CALL UpdateProductStock(1, -10); -- 상품 ID 1의 재고 10개 차감
```

### 3. 통계 뷰 활용
```sql
-- 상품 통계 조회
SELECT * FROM product_stats WHERE avg_rating > 4.0;

-- 사용자 주문 통계 조회
SELECT * FROM user_order_stats ORDER BY total_spent DESC;
```

### 4. 전체 텍스트 검색
```sql
-- 상품 검색
SELECT * FROM products 
WHERE MATCH(title, description, short_description) 
AGAINST('명함' IN BOOLEAN MODE);
```

## 🔧 유지보수 명령어

### 데이터베이스 백업
```bash
# 전체 데이터베이스 백업
mysqldump -u root -p bkpop_db > backup_$(date +%Y%m%d).sql

# 특정 테이블만 백업
mysqldump -u root -p bkpop_db users products orders > backup_core_$(date +%Y%m%d).sql
```

### 데이터베이스 복원
```bash
# 백업 파일로부터 복원
mysql -u root -p bkpop_db < backup_20250115.sql
```

### 인덱스 최적화
```sql
-- 테이블 분석 및 최적화
ANALYZE TABLE products, orders, users;
OPTIMIZE TABLE products, orders, users;
```

### 로그 정리
```sql
-- 30일 이전 관리자 로그 삭제
DELETE FROM admin_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 취소된 주문 90일 후 삭제
DELETE FROM orders WHERE status = 'cancelled' AND cancelled_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

## 🚨 트러블슈팅

### 1. 연결 오류
```bash
ERROR 2002 (HY000): Can't connect to local MySQL server
```
**해결방법**: MySQL 서비스가 실행 중인지 확인
```bash
# macOS
brew services restart mysql

# Ubuntu/Debian
sudo systemctl restart mysql
```

### 2. 권한 오류
```bash
ERROR 1045 (28000): Access denied for user 'root'@'localhost'
```
**해결방법**: 비밀번호 확인 또는 사용자 권한 설정
```sql
-- 사용자 생성 및 권한 부여
CREATE USER 'bkpop_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON bkpop_db.* TO 'bkpop_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 인코딩 문제
```sql
-- 데이터베이스 인코딩 확인
SHOW VARIABLES LIKE 'character_set%';

-- 올바른 인코딩 설정
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
```

## 📈 성능 최적화 팁

### 1. 쿼리 최적화
```sql
-- 느린 쿼리 로그 활성화
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- 실행 계획 확인
EXPLAIN SELECT * FROM products WHERE category_id = 1;
```

### 2. 인덱스 활용
```sql
-- 인덱스 사용 통계 확인
SELECT * FROM sys.schema_index_statistics WHERE table_schema = 'bkpop_db';

-- 미사용 인덱스 확인
SELECT * FROM sys.schema_unused_indexes WHERE object_schema = 'bkpop_db';
```

### 3. 메모리 설정
```sql
-- 버퍼 풀 크기 조정 (my.cnf 또는 my.ini 파일)
innodb_buffer_pool_size = 1G
query_cache_size = 128M
```

## 🔄 업데이트 및 마이그레이션

### 스키마 업데이트 시
1. 기존 데이터 백업
2. 새 스키마 적용
3. 데이터 마이그레이션 스크립트 실행
4. 애플리케이션 재시작

### 버전 관리
```sql
-- 스키마 버전 추가
INSERT INTO system_settings (key_name, value, description, group_name) 
VALUES ('schema_version', '1.0.0', '데이터베이스 스키마 버전', 'system');
```

---

이제 데이터베이스가 완전히 설정되었습니다! 🎉

프로젝트를 실행하고 `/admin` 페이지에서 관리자 기능을 테스트해보세요. 