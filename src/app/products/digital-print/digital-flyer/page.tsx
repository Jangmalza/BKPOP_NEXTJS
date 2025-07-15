import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { digitalFlyerProducts } from '@/lib/digitalPrintProducts';

const DigitalFlyerPage = () => {
  return (
    <CategoryLayout activeTab="디지털인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">디지털전단지</h1>
          <p className="text-gray-600">디지털 인쇄로 빠르고 정확하게 제작되는 전단지입니다.</p>
        </div>
        <ProductList title="디지털전단지 상품" products={digitalFlyerProducts} />
      </div>
    </CategoryLayout>
  );
};

export default DigitalFlyerPage; 