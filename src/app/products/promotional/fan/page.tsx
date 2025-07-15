import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { fanProducts } from '@/lib/promotionalProducts';

const FanPage = () => {
  return (
    <CategoryLayout activeTab="판촉물">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">부채</h1>
          <p className="text-gray-600">여름철 판촉용품으로 인기가 높은 부채를 제작해드립니다.</p>
        </div>
        <ProductList title="부채 상품" products={fanProducts} />
      </div>
    </CategoryLayout>
  );
};

export default FanPage; 