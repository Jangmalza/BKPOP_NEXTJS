// 공통 타입 정의
export interface ProductItem {
  id: number;
  image: string;
  title: string;
  size: string;
  price: string;
  quantity: string;
}

export interface SlideItem {
  title: string;
  desc: string;
  image: string;
  cta: string;
}

export interface ReviewItem {
  rating: number;
  content: string;
  author: string;
}

export interface NoticeItem {
  date: string;
  title: string;
  isNew?: boolean;
}

export interface EventItem {
  title: string;
  description: string;
  type: 'discount' | 'promotion' | 'vip';
}

export interface ServiceStep {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface SupportItem {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
}

// 네비게이션 타입
export type NavTab = '상업인쇄' | '디지털인쇄' | '특수인쇄' | '제품' | '견적';

// 테마 타입
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
} 