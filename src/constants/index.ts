import { SlideItem, NoticeItem, EventItem, ServiceStep, SupportItem } from '@/types';

// 슬라이더 데이터
export const SLIDER_DATA: SlideItem[] = [
  {
    title: '명함 최저가 도전!',
    desc: '명함 100장 1,700원부터, 국내 최저가에 도전하세요!',
    image: 'https://picsum.photos/1200/350?random=1',
    cta: '명함 주문하기',
  },
  {
    title: '전단지 대량 할인',
    desc: 'A4 전단지 3,500원부터, 대량 주문시 추가 할인!',
    image: 'https://picsum.photos/1200/350?random=2',
    cta: '전단지 주문하기',
  },
  {
    title: '스티커/봉투/패키지',
    desc: '다양한 인쇄물, 빠른 납기와 합리적 가격!',
    image: 'https://picsum.photos/1200/350?random=3',
    cta: '전체 상품 보기',
  },
];

// 공지사항 데이터
export const NOTICE_DATA: NoticeItem[] = [
  {
    date: '2025.01.15',
    title: '신년 맞이 대량 주문 할인 이벤트',
    isNew: true,
  },
  {
    date: '2025.01.10',
    title: '명함 인쇄 품질 개선 안내',
  },
  {
    date: '2025.01.05',
    title: '전단지 대량 주문 추가 할인 혜택',
  },
];

// 이벤트 데이터
export const EVENT_DATA: EventItem[] = [
  {
    title: '신규 고객 첫 주문 20% 할인',
    description: '첫 주문시 20% 할인 쿠폰 자동 적용',
    type: 'discount',
  },
  {
    title: '대량 주문 추가 할인',
    description: '100장 이상 주문시 추가 10% 할인',
    type: 'promotion',
  },
  {
    title: '정기 고객 특별 혜택',
    description: '월 3회 이상 주문시 VIP 혜택 제공',
    type: 'vip',
  },
];

// 서비스 단계 데이터
export const SERVICE_STEPS: ServiceStep[] = [
  {
    icon: 'fas fa-file-upload',
    title: '1. 파일 업로드',
    description: 'PDF, AI, EPS 등 다양한 포맷 지원\n고해상도 파일로 최고 품질 보장',
    color: 'blue',
  },
  {
    icon: 'fas fa-cog',
    title: '2. 인쇄 제작',
    description: '최신 장비로 정밀 인쇄\n품질 검수 후 출고',
    color: 'green',
  },
  {
    icon: 'fas fa-shipping-fast',
    title: '3. 빠른 배송',
    description: '당일 출고부터 3일 이내\n전국 무료 배송',
    color: 'yellow',
  },
];

// 고객지원 데이터
export const SUPPORT_DATA: SupportItem[] = [
  {
    icon: 'fas fa-question-circle',
    title: '자주묻는질문',
    description: '고객님들이 자주 묻는 질문과 답변',
    buttonText: '바로가기',
    buttonColor: 'blue',
  },
  {
    icon: 'fas fa-download',
    title: '양식다운로드',
    description: '명함, 전단지 등 인쇄용 양식',
    buttonText: '바로가기',
    buttonColor: 'green',
  },
  {
    icon: 'fas fa-phone',
    title: '고객센터',
    description: '전문 상담원이 도와드립니다',
    buttonText: '바로가기',
    buttonColor: 'yellow',
  },
  {
    icon: 'fas fa-truck',
    title: '배송조회',
    description: '주문하신 상품의 배송 현황',
    buttonText: '바로가기',
    buttonColor: 'purple',
  },
];

// 고객 후기 데이터
export const REVIEW_DATA = [
  {
    rating: 5,
    content: '"명함 주문했는데 정말 빠르고 깔끔하게 나왔어요! 다음에도 꼭 이용할게요."',
    author: '김** 님',
  },
  {
    rating: 5,
    content: '"회사 브로셔 제작했는데 디자인도 예쁘고 품질도 훌륭해요. 강력 추천!"',
    author: '박** 님',
  },
  {
    rating: 5,
    content: '"가격도 합리적이고 서비스도 친절해서 정말 만족스러워요."',
    author: '이** 님',
  },
];

// 레이아웃 상수
export const LAYOUT = {
  MAX_WIDTH: 'max-w-[1400px]',
  CONTAINER_PADDING: 'px-6',
  SECTION_PADDING: 'py-16',
  GRID_GAP: 'gap-8',
} as const;

// 색상 테마
export const THEME = {
  PRIMARY: 'blue-900',
  SECONDARY: 'yellow-400',
  ACCENT: 'blue-600',
  BACKGROUND: {
    PRIMARY: 'bg-white',
    SECONDARY: 'bg-gray-100',
    TERTIARY: 'bg-gray-50',
  },
  TEXT: {
    PRIMARY: 'text-blue-900',
    SECONDARY: 'text-gray-600',
    LIGHT: 'text-gray-500',
  },
} as const;

// 애니메이션 상수
export const ANIMATION = {
  TRANSITION: 'transition-all duration-300',
  HOVER_SCALE: 'hover:scale-105',
  HOVER_SHADOW: 'hover:shadow-xl',
} as const; 