import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { sampleBookProducts } from '@/lib/planningProducts';

const SampleBookPage = () => {
  return (
    <CategoryLayout activeTab="기획상품">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">샘플북</h1>
          <p className="text-gray-600">다양한 인쇄물의 샘플을 확인할 수 있는 샘플북입니다.</p>
        </div>
        <ProductList title="샘플북 상품" products={sampleBookProducts} />
      </div>
    </CategoryLayout>
  );
};

export default SampleBookPage; 