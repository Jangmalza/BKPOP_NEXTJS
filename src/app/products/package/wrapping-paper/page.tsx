import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { wrappingPaperProducts } from '@/lib/packageProducts';

const WrappingPaperPage = () => {
  return (
    <CategoryLayout activeTab="패키지">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">포장지</h1>
          <p className="text-gray-600">선물이나 상품 포장에 사용할 수 있는 포장지를 제작해드립니다.</p>
        </div>
        <ProductList title="포장지 상품" products={wrappingPaperProducts} />
      </div>
    </CategoryLayout>
  );
};

export default WrappingPaperPage; 