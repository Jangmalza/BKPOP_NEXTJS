/**
 * 베스트 상품 데이터
 * @fileoverview 메인페이지에 표시되는 베스트 상품 목록
 * @author Development Team
 * @version 1.0.0
 */

import { ProductItem } from '@/types';

/**
 * 베스트 상품 목록
 * @description 고객들이 가장 많이 주문하는 인기 상품들
 * @type {ProductItem[]}
 */
const bestProducts: ProductItem[] = [
  { 
    id: 1, 
    image: 'https://picsum.photos/400/300?random=1', 
    title: '재단형스티커', 
    size: '40X60', 
    price: '5,300원', 
    quantity: '1,000매',
    category: 'commercial-print/sticker'
  },
  { 
    id: 2, 
    image: 'https://picsum.photos/400/300?random=2', 
    title: '도무송스티커', 
    size: '10X10 2개', 
    price: '11,100원', 
    quantity: '1,000매',
    category: 'digital-print/digital-sticker'
  },
  { 
    id: 3, 
    image: 'https://picsum.photos/400/300?random=3', 
    title: '고급지명함', 
    size: '90X50', 
    price: '5,500원', 
    quantity: '200매',
    category: 'commercial-print/business-card'
  }
];
export default bestProducts;
