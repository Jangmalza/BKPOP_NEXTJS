import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { stickerProducts } from '@/lib/commercialPrintProducts';

const StickerPage = () => {
  return (
    <CategoryLayout activeTab="상업인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">스티커</h1>
          <p className="text-gray-600">다양한 형태와 재질의 스티커를 제작해드립니다.</p>
        </div>
        <ProductList title="스티커 상품" products={stickerProducts} category="commercial-print/sticker" />
      </div>
    </CategoryLayout>
  );
};

export default StickerPage; 