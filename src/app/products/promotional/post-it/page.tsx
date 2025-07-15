import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { postItProducts } from '@/lib/promotionalProducts';

const PostItPage = () => {
  return (
    <CategoryLayout activeTab="판촉물">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">포스트잇</h1>
          <p className="text-gray-600">실용적이고 효과적인 판촉물, 포스트잇을 제작해드립니다.</p>
        </div>
        <ProductList title="포스트잇 상품" products={postItProducts} />
      </div>
    </CategoryLayout>
  );
};

export default PostItPage; 