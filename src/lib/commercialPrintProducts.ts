import { ProductItem } from '@/types';

// 명함 상품 (기존 businessCardProducts.ts에서 가져옴)
export const businessCardProducts: ProductItem[] = [
  {
    id: 1,
    image: 'https://picsum.photos/400/300?random=1',
    title: '스탠다드 명함',
    size: '90X50',
    price: '5,500원',
    quantity: '200매'
  },
  {
    id: 2,
    image: 'https://picsum.photos/400/300?random=2',
    title: '프리미엄 명함',
    size: '90X50',
    price: '8,500원',
    quantity: '200매'
  },
  {
    id: 3,
    image: 'https://picsum.photos/400/300?random=3',
    title: '고급지명함',
    size: '90X50',
    price: '12,000원',
    quantity: '200매'
  }
];

// 봉투 상품
export const envelopeProducts: ProductItem[] = [
  {
    id: 4,
    image: 'https://picsum.photos/400/300?random=4',
    title: '일반 봉투',
    size: '110X220',
    price: '3,200원',
    quantity: '100매'
  },
  {
    id: 5,
    image: 'https://picsum.photos/400/300?random=5',
    title: '창봉투',
    size: '110X220',
    price: '4,500원',
    quantity: '100매'
  },
  {
    id: 6,
    image: 'https://picsum.photos/400/300?random=6',
    title: '고급 봉투',
    size: '110X220',
    price: '6,800원',
    quantity: '100매'
  }
];

// 전단 상품
export const flyerProducts: ProductItem[] = [
  {
    id: 7,
    image: 'https://picsum.photos/400/300?random=7',
    title: 'A4 전단',
    size: '210X297',
    price: '4,500원',
    quantity: '500매'
  },
  {
    id: 8,
    image: 'https://picsum.photos/400/300?random=8',
    title: 'A5 전단',
    size: '148X210',
    price: '3,200원',
    quantity: '500매'
  },
  {
    id: 9,
    image: 'https://picsum.photos/400/300?random=9',
    title: 'B5 전단',
    size: '182X257',
    price: '3,800원',
    quantity: '500매'
  }
];

// 스티커 상품
export const stickerProducts: ProductItem[] = [
  {
    id: 10,
    image: 'https://picsum.photos/400/300?random=10',
    title: '재단형 스티커',
    size: '40X60',
    price: '5,300원',
    quantity: '1,000매'
  },
  {
    id: 11,
    image: 'https://picsum.photos/400/300?random=11',
    title: '도무송 스티커',
    size: '10X10',
    price: '11,100원',
    quantity: '1,000매'
  },
  {
    id: 12,
    image: 'https://picsum.photos/400/300?random=12',
    title: '투명 스티커',
    size: '50X50',
    price: '8,500원',
    quantity: '500매'
  }
];

// 홍보물 상품
export const promotionProducts: ProductItem[] = [
  {
    id: 13,
    image: 'https://picsum.photos/400/300?random=13',
    title: '브로셔',
    size: '210X297',
    price: '12,000원',
    quantity: '100매'
  },
  {
    id: 14,
    image: 'https://picsum.photos/400/300?random=14',
    title: '리플릿',
    size: '210X297',
    price: '8,500원',
    quantity: '200매'
  },
  {
    id: 15,
    image: 'https://picsum.photos/400/300?random=15',
    title: '카탈로그',
    size: '210X297',
    price: '25,000원',
    quantity: '50매'
  }
]; 