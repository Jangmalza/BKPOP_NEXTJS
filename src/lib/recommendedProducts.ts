/**
 * 추천 상품 데이터
 * @fileoverview 메인페이지에 표시되는 추천 상품 목록
 * @author Development Team
 * @version 1.0.0
 */

import { ProductItem } from '@/types';

/**
 * 추천 상품 목록
 * @description 고객 맞춤형 추천 상품들
 * @type {ProductItem[]}
 */
const recommendedProducts: ProductItem[] = [
  { 
    id: 1, 
    image: 'https://picsum.photos/400/300?random=4', 
    title: '카드명함', 
    size: '86X54', 
    price: '11,000원', 
    quantity: '200매',
    category: 'digital-print/digital-business-card'
  },
  { 
    id: 2, 
    image: 'https://picsum.photos/400/300?random=5', 
    title: '소형패키지', 
    size: '420X594', 
    price: '7,500원', 
    quantity: '5매',
    category: 'package/box'
  },
  { 
    id: 3, 
    image: 'https://picsum.photos/400/300?random=6', 
    title: '일반쇼핑백', 
    size: '180X200X100', 
    price: '363,200원', 
    quantity: '200매',
    category: 'package/shopping-bag'
  }
];
export default recommendedProducts;
