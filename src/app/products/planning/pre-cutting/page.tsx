import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { preCuttingProducts } from '@/lib/planningProducts';

const PreCuttingPage = () => {
  return (
    <CategoryLayout activeTab="기획상품">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">프리컷팅</h1>
          <p className="text-gray-600">미리 재단된 형태로 제작되는 프리컷팅 상품입니다.</p>
        </div>
        <ProductList title="프리컷팅 상품" products={preCuttingProducts} />
      </div>
    </CategoryLayout>
  );
};

export default PreCuttingPage; 