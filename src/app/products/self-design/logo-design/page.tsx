import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { logoDesignProducts } from '@/lib/selfDesignProducts';

const LogoDesignPage = () => {
  return (
    <CategoryLayout activeTab="셀프디자인">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">로고디자인</h1>
          <p className="text-gray-600">브랜드를 대표하는 로고를 전문적으로 디자인해드립니다.</p>
        </div>
        <ProductList title="로고디자인 상품" products={logoDesignProducts} />
      </div>
    </CategoryLayout>
  );
};

export default LogoDesignPage; 