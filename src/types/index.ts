/**
 * 공통 타입 정의
 * @fileoverview 애플리케이션에서 사용하는 모든 타입 정의
 * @author Development Team
 * @version 1.0.0
 */

/**
 * 제품 아이템 인터페이스
 * @interface ProductItem
 * @description 상품 목록에서 사용되는 제품 정보
 */
export interface ProductItem {
  /** 제품 고유 ID */
  id: number;
  /** 제품 이미지 URL */
  image: string;
  /** 제품 제목 */
  title: string;
  /** 제품 크기 */
  size: string;
  /** 제품 가격 (문자열 형태, 예: "10,000원") */
  price: string;
  /** 재고 수량 (문자열 형태) */
  quantity: string;
  /** 제품 카테고리 (선택적, 상세페이지 링크용) */
  category?: string;
}

/**
 * 장바구니 아이템 인터페이스
 * @interface CartItem
 * @description 장바구니에 담긴 상품 정보
 */
export interface CartItem {
  /** 장바구니 아이템 고유 ID */
  id: number;
  /** 제품 ID (ProductItem의 id와 연결) */
  product_id: number;
  /** 사용자 ID (선택적, 로그인 사용자만) */
  user_id?: number;
  /** 제품 이미지 URL */
  image: string;
  /** 제품 제목 */
  title: string;
  /** 제품 크기 */
  size: string;
  /** 제품 가격 (숫자 형태) */
  price: number;
  /** 장바구니 수량 */
  quantity: number;
  /** 총 가격 (price * quantity) */
  totalPrice: number;
  /** 생성일시 (선택적) */
  created_at?: string;
  /** 수정일시 (선택적) */
  updated_at?: string;
}

/**
 * 장바구니 컨텍스트 타입
 * @interface CartContextType
 * @description 장바구니 상태 관리를 위한 컨텍스트 타입
 */
export interface CartContextType {
  /** 장바구니 아이템 목록 */
  items: CartItem[];
  /** 로딩 상태 */
  loading?: boolean;
  /** 에러 메시지 */
  error?: string | null;
  /** 장바구니에 상품 추가 */
  addItem: (product: ProductItem, quantity: number) => void;
  /** 장바구니에서 상품 제거 */
  removeItem: (id: number) => void;
  /** 장바구니 상품 수량 변경 */
  updateQuantity: (id: number, quantity: number) => void;
  /** 장바구니 전체 비우기 */
  clearCart: () => void;
  /** 장바구니 총 가격 계산 */
  getTotalPrice: () => number;
  /** 장바구니 총 상품 개수 계산 */
  getTotalItems: () => number;
  /** 장바구니 새로고침 */
  refreshCart?: () => void;
  /** 에러 상태 초기화 */
  clearError?: () => void;
}

/**
 * 슬라이드 아이템 인터페이스
 * @interface SlideItem
 * @description 메인 슬라이더에 사용되는 아이템
 */
export interface SlideItem {
  /** 슬라이드 제목 */
  title: string;
  /** 슬라이드 설명 */
  desc: string;
  /** 슬라이드 이미지 URL */
  image: string;
  /** 행동 유도 텍스트 */
  cta: string;
}

/**
 * 리뷰 아이템 인터페이스
 * @interface ReviewItem
 * @description 고객 리뷰 정보
 */
export interface ReviewItem {
  /** 별점 (1-5) */
  rating: number;
  /** 리뷰 내용 */
  content: string;
  /** 작성자 이름 */
  author: string;
}

/**
 * 공지사항 아이템 인터페이스
 * @interface NoticeItem
 * @description 공지사항 목록에 사용되는 아이템
 */
export interface NoticeItem {
  /** 공지사항 날짜 */
  date: string;
  /** 공지사항 제목 */
  title: string;
  /** 새 공지사항 여부 */
  isNew?: boolean;
}

/**
 * 이벤트 아이템 인터페이스
 * @interface EventItem
 * @description 이벤트 정보
 */
export interface EventItem {
  /** 이벤트 제목 */
  title: string;
  /** 이벤트 설명 */
  description: string;
  /** 이벤트 타입 */
  type: 'discount' | 'promotion' | 'vip';
}

/**
 * 서비스 단계 인터페이스
 * @interface ServiceStep
 * @description 서비스 이용 단계 정보
 */
export interface ServiceStep {
  /** 아이콘 이름 */
  icon: string;
  /** 단계 제목 */
  title: string;
  /** 단계 설명 */
  description: string;
  /** 테마 색상 */
  color: string;
}

/**
 * 고객 지원 아이템 인터페이스
 * @interface SupportItem
 * @description 고객 지원 메뉴 정보
 */
export interface SupportItem {
  /** 아이콘 이름 */
  icon: string;
  /** 지원 제목 */
  title: string;
  /** 지원 설명 */
  description: string;
  /** 버튼 텍스트 */
  buttonText: string;
  /** 버튼 색상 */
  buttonColor: string;
}

/**
 * 네비게이션 탭 타입
 * @type NavTab
 * @description 메인 네비게이션에서 사용하는 탭 타입
 */
export type NavTab = '상업인쇄' | '디지털인쇄' | '특수인쇄' | '제품' | '견적';

/**
 * 테마 색상 인터페이스
 * @interface ThemeColors
 * @description 애플리케이션 테마 색상 정의
 */
export interface ThemeColors {
  /** 주요 색상 */
  primary: string;
  /** 보조 색상 */
  secondary: string;
  /** 강조 색상 */
  accent: string;
  /** 배경 색상 */
  background: string;
  /** 텍스트 색상 */
  text: string;
}

/**
 * API 응답 타입
 * @interface ApiResponse
 * @description 서버 API 응답 형식
 */
export interface ApiResponse<T = any> {
  /** 응답 성공 여부 */
  success: boolean;
  /** 응답 메시지 */
  message: string;
  /** 응답 데이터 */
  data?: T;
  /** 에러 코드 (실패 시) */
  errorCode?: string;
}

/**
 * 사용자 정보 인터페이스
 * @interface User
 * @description 사용자 정보 타입
 */
export interface User {
  /** 사용자 고유 ID */
  id: string;
  /** 사용자 이름 */
  name: string;
  /** 이메일 주소 */
  email: string;
  /** 전화번호 */
  phone?: string;
  /** 계정 생성일 */
  created_at: string;
  /** 계정 수정일 */
  updated_at: string;
}

/**
 * 데이터베이스 설정 타입
 * @interface DatabaseConfig
 * @description 데이터베이스 연결 설정
 */
export interface DatabaseConfig {
  /** 데이터베이스 호스트 */
  host: string;
  /** 데이터베이스 사용자명 */
  user: string;
  /** 데이터베이스 비밀번호 */
  password: string;
  /** 데이터베이스 이름 */
  database: string;
  /** 데이터베이스 포트 */
  port: number;
  /** 연결 대기 여부 */
  waitForConnections: boolean;
  /** 연결 제한 수 */
  connectionLimit: number;
  /** 대기열 제한 수 */
  queueLimit: number;
} 