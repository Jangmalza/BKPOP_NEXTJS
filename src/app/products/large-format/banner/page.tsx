import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { bannerProducts } from '@/lib/largeFormatProducts';

const BannerPage = () => {
  return (
    <CategoryLayout activeTab="실사출력">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">배너</h1>
          <p className="text-gray-600">실내외 홍보용 배너를 고품질로 제작해드립니다.</p>
        </div>
        <ProductList title="배너 상품" products={bannerProducts} />
      </div>
    </CategoryLayout>
  );
};

export default BannerPage; 