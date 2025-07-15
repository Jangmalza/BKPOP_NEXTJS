import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { envelopeProducts } from '@/lib/commercialPrintProducts';

const EnvelopePage = () => {
  return (
    <CategoryLayout activeTab="상업인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">봉투</h1>
          <p className="text-gray-600">다양한 크기와 디자인의 봉투를 제작해드립니다.</p>
        </div>
        <ProductList title="봉투 상품" products={envelopeProducts} />
      </div>
    </CategoryLayout>
  );
};

export default EnvelopePage; 