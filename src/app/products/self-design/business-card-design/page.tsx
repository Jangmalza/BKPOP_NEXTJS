import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { businessCardDesignProducts } from '@/lib/selfDesignProducts';

const BusinessCardDesignPage = () => {
  return (
    <CategoryLayout activeTab="셀프디자인">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">명함디자인</h1>
          <p className="text-gray-600">전문적이고 세련된 명함을 디자인해드립니다.</p>
        </div>
        <ProductList title="명함디자인 상품" products={businessCardDesignProducts} />
      </div>
    </CategoryLayout>
  );
};

export default BusinessCardDesignPage; 