import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { shoppingBagProducts } from '@/lib/packageProducts';

const ShoppingBagPage = () => {
  return (
    <CategoryLayout activeTab="패키지">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">쇼핑백</h1>
          <p className="text-gray-600">브랜드 홍보에 효과적인 쇼핑백을 제작해드립니다.</p>
        </div>
        <ProductList title="쇼핑백 상품" products={shoppingBagProducts} />
      </div>
    </CategoryLayout>
  );
};

export default ShoppingBagPage; 