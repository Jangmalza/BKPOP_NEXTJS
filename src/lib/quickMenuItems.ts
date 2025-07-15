export interface QuickMenuItem {
  id: number;
  title: string;
  icon: string;
  description: string;
  price: string;
}

const quickMenuItems: QuickMenuItem[] = [
  {
    id: 1,
    title: "명함 제작",
    icon: "fas fa-id-card",
    description: "빠른 납기, 합리적인 가격",
    price: "1,700원부터"
  },
  {
    id: 2,
    title: "전단지 인쇄",
    icon: "fas fa-file-alt",
    description: "A4 전단지 대량 할인",
    price: "3,500원부터"
  },
  {
    id: 3,
    title: "브로셔 제작",
    icon: "fas fa-book",
    description: "프리미엄 품질 브로셔",
    price: "15,000원부터"
  },
  {
    id: 4,
    title: "스티커 제작",
    icon: "fas fa-sticky-note",
    description: "다양한 사이즈 스티커",
    price: "5,300원부터"
  },
  {
    id: 5,
    title: "봉투 제작",
    icon: "fas fa-envelope",
    description: "고급 봉투 제작",
    price: "2,500원부터"
  },
  {
    id: 6,
    title: "배너 출력",
    icon: "fas fa-flag",
    description: "대형 배너 출력",
    price: "8,000원부터"
  }
];

export default quickMenuItems;
