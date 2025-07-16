import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { digitalBusinessCardProducts } from '@/lib/digitalPrintProducts';

const DigitalBusinessCardPage = () => {
  return (
    <CategoryLayout activeTab="디지털인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">디지털명함</h1>
          <p className="text-gray-600">디지털 인쇄 방식으로 제작되는 고품질 명함입니다.</p>
        </div>
        <ProductList title="디지털명함 상품" products={digitalBusinessCardProducts} category="digital-print/digital-business-card" />
      </div>
    </CategoryLayout>
  );
};

export default DigitalBusinessCardPage; 