
import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { businessCardProducts } from '@/lib/commercialPrintProducts';

const BusinessCardPage = () => {
  return (
    <CategoryLayout activeTab="상업인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">명함</h1>
          <p className="text-gray-600">고품질 명함을 합리적인 가격으로 제작해드립니다.</p>
        </div>
        <ProductList title="명함 상품" products={businessCardProducts} category="commercial-print/business-card" />
      </div>
    </CategoryLayout>
  );
};

export default BusinessCardPage;
