import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { boxProducts } from '@/lib/packageProducts';

const BoxPage = () => {
  return (
    <CategoryLayout activeTab="패키지">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">박스</h1>
          <p className="text-gray-600">포장용, 배송용, 선물용 등 다양한 박스를 제작해드립니다.</p>
        </div>
        <ProductList title="박스 상품" products={boxProducts} />
      </div>
    </CategoryLayout>
  );
};

export default BoxPage; 