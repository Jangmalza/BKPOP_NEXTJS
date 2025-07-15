import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { posterProducts } from '@/lib/largeFormatProducts';

const PosterPage = () => {
  return (
    <CategoryLayout activeTab="실사출력">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">포스터</h1>
          <p className="text-gray-600">대형 포스터를 선명하고 생생하게 제작해드립니다.</p>
        </div>
        <ProductList title="포스터 상품" products={posterProducts} />
      </div>
    </CategoryLayout>
  );
};

export default PosterPage; 