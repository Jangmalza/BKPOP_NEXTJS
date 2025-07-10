// components/SideMenu/RecentView.tsx
import React from 'react';

const RecentView: React.FC = () => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">최근 본 상품</h3>
        <button className="text-sm text-gray-500 hover:text-blue-600">전체보기</button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded border border-dashed border-gray-300">
          <div className="text-center">
            <i className="far fa-eye text-gray-400 text-2xl mb-2"></i>
            <p className="text-gray-500 text-sm">최근 본 상품이 없습니다</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentView;
