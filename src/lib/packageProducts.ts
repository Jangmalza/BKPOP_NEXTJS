import { ProductItem } from '@/types';

// 박스 상품
export const boxProducts: ProductItem[] = [
  {
    id: 34,
    image: 'https://picsum.photos/400/300?random=34',
    title: '포장 박스',
    size: '150X150X100',
    price: '3,500원',
    quantity: '50개'
  },
  {
    id: 35,
    image: 'https://picsum.photos/400/300?random=35',
    title: '배송 박스',
    size: '250X200X150',
    price: '4,800원',
    quantity: '30개'
  },
  {
    id: 36,
    image: 'https://picsum.photos/400/300?random=36',
    title: '선물 박스',
    size: '200X200X100',
    price: '6,200원',
    quantity: '25개'
  }
];

// 쇼핑백 상품
export const shoppingBagProducts: ProductItem[] = [
  {
    id: 37,
    image: 'https://picsum.photos/400/300?random=37',
    title: '종이 쇼핑백',
    size: '300X400X100',
    price: '2,800원',
    quantity: '100개'
  },
  {
    id: 38,
    image: 'https://picsum.photos/400/300?random=38',
    title: '부직포 쇼핑백',
    size: '350X400X120',
    price: '3,500원',
    quantity: '50개'
  },
  {
    id: 39,
    image: 'https://picsum.photos/400/300?random=39',
    title: '고급 쇼핑백',
    size: '320X420X150',
    price: '4,500원',
    quantity: '30개'
  }
];

// 포장지 상품
export const wrappingPaperProducts: ProductItem[] = [
  {
    id: 40,
    image: 'https://picsum.photos/400/300?random=40',
    title: '일반 포장지',
    size: '700X1000',
    price: '1,500원',
    quantity: '10매'
  },
  {
    id: 41,
    image: 'https://picsum.photos/400/300?random=41',
    title: '고급 포장지',
    size: '700X1000',
    price: '2,500원',
    quantity: '10매'
  },
  {
    id: 42,
    image: 'https://picsum.photos/400/300?random=42',
    title: '특수 포장지',
    size: '700X1000',
    price: '3,800원',
    quantity: '5매'
  }
]; 