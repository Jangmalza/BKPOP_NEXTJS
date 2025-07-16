/**
 * 상품 목록 컴포넌트
 * @fileoverview 상품들을 그리드 형태로 표시하는 재사용 가능한 컴포넌트
 * @author Development Team
 * @version 1.0.0
 */

'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ProductItem } from '@/types';

/**
 * ProductList 컴포넌트 Props
 * @interface ProductListProps
 * @description 상품 목록 컴포넌트의 props 타입 정의
 */
interface ProductListProps {
  /** 상품 목록 섹션 제목 */
  title: string;
  /** 표시할 상품 배열 */
  products: ProductItem[];
  /** 카테고리 경로 (상세페이지 링크용) */
  category?: string;
  /** 장바구니 버튼 표시 여부 */
  showCartButton?: boolean;
}

/**
 * 상품 목록 컴포넌트
 * @description 상품들을 그리드 형태로 표시하는 컴포넌트
 * @param {ProductListProps} props - 컴포넌트 props
 * @returns {JSX.Element} 상품 목록 JSX 엘리먼트
 */
const ProductList: React.FC<ProductListProps> = ({ title, products, category, showCartButton = false }) => {
  const { addItem } = useCart();
  const router = useRouter();

  /**
   * 장바구니에 상품 추가 핸들러
   * @param {ProductItem} product - 추가할 상품 정보
   */
  const handleAddToCart = (product: ProductItem) => {
    addItem(product, 1);
    alert(`${product.title}이(가) 장바구니에 추가되었습니다.`);
  };

  /**
   * 상품 상세보기 페이지로 이동 핸들러
   * @param {ProductItem} product - 상세보기할 상품 정보
   */
  const handleDetailView = (product: ProductItem) => {
    const productCategory = product.category || category;
    if (productCategory) {
      router.push(`/products/${productCategory}/${product.id}`);
    }
  };

  return (
    <section className="w-full py-12 bg-white border-b">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-blue-900">{title}</h2>
        <div className="grid grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 rounded-xl shadow hover:shadow-xl border hover:border-yellow-400 transition p-6 flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="font-bold text-lg text-blue-900 mb-2">{product.title}</h3>
              <div className="text-sm text-gray-500 mb-1">{product.size}</div>
              <div className="text-base font-semibold text-blue-700 mb-2">{product.price} <span className="text-xs text-gray-400">/ {product.quantity}</span></div>
              <div className="mt-auto">
                {(() => {
                  const productCategory = product.category || category;
                  
                  if (showCartButton && productCategory) {
                    return (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-blue-600 text-white font-bold px-4 py-2 rounded-full text-sm shadow hover:bg-blue-700 transition"
                        >
                          장바구니
                        </button>
                        <button 
                          onClick={() => handleDetailView(product)}
                          className="bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded-full text-sm shadow hover:bg-yellow-300 transition"
                        >
                          상세보기
                        </button>
                      </div>
                    );
                  } else if (showCartButton) {
                    return (
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full text-sm shadow hover:bg-blue-700 transition"
                      >
                        장바구니
                      </button>
                    );
                  } else if (productCategory) {
                    return (
                      <button 
                        onClick={() => handleDetailView(product)}
                        className="bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded-full text-sm shadow hover:bg-yellow-300 transition"
                      >
                        상세보기
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
