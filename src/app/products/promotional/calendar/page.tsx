import React from 'react';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import ProductList from '@/components/Product/ProductList';
import { calendarProducts } from '@/lib/promotionalProducts';

const CalendarPage = () => {
  return (
    <CategoryLayout activeTab="판촉물">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">캘린더</h1>
          <p className="text-gray-600">1년 내내 사용할 수 있는 실용적인 캘린더를 제작해드립니다.</p>
        </div>
        <ProductList title="캘린더 상품" products={calendarProducts} />
      </div>
    </CategoryLayout>
  );
};

export default CalendarPage; 