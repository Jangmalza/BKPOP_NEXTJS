import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { flyerProducts } from '@/lib/commercialPrintProducts';

const FlyerPage = () => {
  return (
    <CategoryLayout activeTab="상업인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">전단</h1>
          <p className="text-gray-600">효과적인 홍보를 위한 전단지를 제작해드립니다.</p>
        </div>
        <ProductList title="전단 상품" products={flyerProducts} />
      </div>
    </CategoryLayout>
  );
};

export default FlyerPage; 