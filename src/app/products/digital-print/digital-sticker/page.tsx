import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { digitalStickerProducts } from '@/lib/digitalPrintProducts';

const DigitalStickerPage = () => {
  return (
    <CategoryLayout activeTab="디지털인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">디지털스티커</h1>
          <p className="text-gray-600">정밀한 디지털 인쇄 기술로 제작되는 고품질 스티커입니다.</p>
        </div>
        <ProductList title="디지털스티커 상품" products={digitalStickerProducts} />
      </div>
    </CategoryLayout>
  );
};

export default DigitalStickerPage; 