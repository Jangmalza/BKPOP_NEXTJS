import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { promotionProducts } from '@/lib/commercialPrintProducts';

const PromotionPage = () => {
  return (
    <CategoryLayout activeTab="상업인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">홍보물</h1>
          <p className="text-gray-600">브로셔, 리플릿, 카탈로그 등 다양한 홍보물을 제작해드립니다.</p>
        </div>
        <ProductList title="홍보물 상품" products={promotionProducts} />
      </div>
    </CategoryLayout>
  );
};

export default PromotionPage; 