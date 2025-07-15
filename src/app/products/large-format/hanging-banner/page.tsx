import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { hangingBannerProducts } from '@/lib/largeFormatProducts';

const HangingBannerPage = () => {
  return (
    <CategoryLayout activeTab="실사출력">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">현수막</h1>
          <p className="text-gray-600">옥외 광고용 현수막을 내구성 있게 제작해드립니다.</p>
        </div>
        <ProductList title="현수막 상품" products={hangingBannerProducts} />
      </div>
    </CategoryLayout>
  );
};

export default HangingBannerPage; 