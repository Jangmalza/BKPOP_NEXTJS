# 관리자 페이지 구현 계획서

## 1. 사용자 역할 시스템 구축

### 1.1 데이터베이스 스키마 확장
```sql
-- users 테이블에 role 컬럼 추가
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin', 'super_admin') DEFAULT 'user';

-- 관리자 계정 생성
INSERT INTO users (name, email, password, role) VALUES 
('관리자', 'admin@bkpop.com', 'hashed_password', 'admin');
```

### 1.2 타입 정의 확장
```typescript
// src/types/admin.ts
export interface AdminUser extends User {
  role: 'user' | 'admin' | 'super_admin';
  permissions: string[];
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
}
```

## 2. 관리자 인증 시스템

### 2.1 권한 확인 미들웨어
```typescript
// src/middleware/auth.ts
export function withAdminAuth(handler: Function) {
  return async (req: NextRequest) => {
    // 관리자 권한 확인 로직
    const user = await getCurrentUser(req);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(req);
  };
}
```

### 2.2 관리자 전용 라우트 보호
```typescript
// src/app/admin/layout.tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user?.role?.includes('admin')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user?.role?.includes('admin')) {
    return <div>권한이 없습니다.</div>;
  }

  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}
```

## 3. 관리자 페이지 구조

### 3.1 디렉토리 구조
```
src/app/admin/
├── layout.tsx              # 관리자 레이아웃
├── page.tsx                # 대시보드 메인
├── users/
│   ├── page.tsx           # 사용자 관리
│   └── [id]/
│       └── page.tsx       # 사용자 상세
├── products/
│   ├── page.tsx           # 상품 관리
│   ├── create/
│   │   └── page.tsx       # 상품 등록
│   └── [id]/
│       ├── page.tsx       # 상품 상세
│       └── edit/
│           └── page.tsx   # 상품 수정
├── orders/
│   ├── page.tsx           # 주문 관리
│   └── [id]/
│       └── page.tsx       # 주문 상세
├── analytics/
│   └── page.tsx           # 통계 분석
└── settings/
    └── page.tsx           # 시스템 설정
```

### 3.2 관리자 컴포넌트 구조
```
src/components/Admin/
├── Layout/
│   ├── AdminSidebar.tsx
│   ├── AdminHeader.tsx
│   └── AdminBreadcrumb.tsx
├── Dashboard/
│   ├── StatsCard.tsx
│   ├── ChartComponent.tsx
│   └── RecentActivities.tsx
├── Users/
│   ├── UserTable.tsx
│   ├── UserForm.tsx
│   └── UserFilter.tsx
├── Products/
│   ├── ProductTable.tsx
│   ├── ProductForm.tsx
│   └── ProductImageUpload.tsx
└── Orders/
    ├── OrderTable.tsx
    ├── OrderStatusUpdate.tsx
    └── OrderDetails.tsx
```

## 4. 핵심 기능 구현

### 4.1 대시보드 (통계 및 개요)
- 실시간 통계 (사용자 수, 주문 수, 매출)
- 차트 및 그래프 (Chart.js 또는 Recharts)
- 최근 활동 로그
- 시스템 상태 모니터링

### 4.2 사용자 관리
- 사용자 목록 조회 (페이지네이션, 검색, 필터)
- 사용자 상세 정보 조회
- 사용자 권한 관리 (역할 변경)
- 사용자 계정 활성화/비활성화

### 4.3 상품 관리
- 상품 목록 조회 (카테고리별, 검색)
- 상품 등록/수정/삭제
- 상품 이미지 업로드
- 재고 관리
- 가격 관리

### 4.4 주문 관리
- 주문 목록 조회 (상태별, 날짜별)
- 주문 상세 정보 조회
- 주문 상태 변경 (접수, 제작중, 배송중, 완료)
- 배송 정보 관리

### 4.5 통계 및 분석
- 매출 통계 (일별, 월별, 연도별)
- 인기 상품 분석
- 사용자 행동 분석
- 주문 패턴 분석

## 5. 보안 고려사항

### 5.1 인증 강화
- JWT 토큰 기반 인증 도입
- 토큰 만료 시간 관리
- 리프레시 토큰 구현

### 5.2 권한 관리
- RBAC (Role-Based Access Control) 구현
- 세분화된 권한 시스템
- 관리자 활동 로그

### 5.3 데이터 보호
- 입력 데이터 검증 강화
- SQL 인젝션 방지
- XSS 공격 방지
- CSRF 토큰 구현

## 6. 구현 우선순위

### Phase 1: 기본 인프라 (1-2주)
1. 사용자 역할 시스템 구축
2. 관리자 인증 시스템 구현
3. 관리자 레이아웃 구성
4. 기본 대시보드 구현

### Phase 2: 핵심 관리 기능 (2-3주)
1. 사용자 관리 기능
2. 상품 관리 기능
3. 주문 관리 기능
4. 기본 통계 기능

### Phase 3: 고급 기능 (1-2주)
1. 상세 통계 및 분석
2. 파일 업로드 시스템
3. 알림 시스템
4. 시스템 설정 관리

### Phase 4: 보안 및 최적화 (1주)
1. 보안 강화
2. 성능 최적화
3. 테스트 코드 작성
4. 문서화

## 7. 권장 라이브러리

### 7.1 UI 컴포넌트
- **Headless UI**: 접근성 좋은 기본 컴포넌트
- **Heroicons**: 일관된 아이콘 세트
- **React Hook Form**: 폼 관리
- **Zod**: 스키마 검증

### 7.2 데이터 시각화
- **Chart.js + react-chartjs-2**: 차트 라이브러리
- **React Table**: 테이블 컴포넌트
- **Date-fns**: 날짜 처리

### 7.3 유틸리티
- **React Query**: 서버 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **React Hot Toast**: 알림 시스템

## 8. 예상 개발 일정

- **총 개발 기간**: 6-8주
- **개발자 수**: 1-2명
- **주요 마일스톤**:
  - Week 2: 기본 인프라 완성
  - Week 4: 핵심 CRUD 기능 완성
  - Week 6: 고급 기능 및 통계 완성
  - Week 8: 보안 강화 및 최적화 완성

## 9. 예상 비용

### 9.1 개발 비용
- **프론트엔드 개발**: 400-600만원
- **백엔드 API 개발**: 300-500만원
- **테스트 및 QA**: 100-200만원
- **총 예상 비용**: 800-1,300만원

### 9.2 운영 비용
- **서버 호스팅**: 월 10-30만원
- **데이터베이스**: 월 5-15만원
- **모니터링 도구**: 월 5-10만원
- **총 월 운영비**: 20-55만원

## 10. 성공 지표

### 10.1 기능적 지표
- 관리자 작업 효율성 30% 향상
- 데이터 처리 속도 50% 개선
- 오류 발생률 80% 감소

### 10.2 비즈니스 지표
- 관리 업무 시간 40% 단축
- 고객 문의 응답 시간 50% 단축
- 운영 비용 20% 절감