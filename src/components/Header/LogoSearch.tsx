'use client';
// components/Header/LogoSearch.tsx
import React from 'react';

const LogoSearch: React.FC = () => {
  const handleLogoClick = () => {
    console.log('로고 클릭됨!'); // 디버깅용 로그
    window.location.href = '/';
  };

  return (
    <div className="w-full bg-blue-900">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center h-20 px-6">
        {/* 좌측 로고 */}
        <div className="flex items-center">
          <button 
            onClick={handleLogoClick}
            className="text-3xl font-bold text-white tracking-tight mr-3 hover:text-yellow-300 cursor-pointer transition-colors duration-200 bg-transparent border-none p-0"
            style={{ fontFamily: 'inherit' }}
          >
            보광
          </button>
          <span className="text-xs text-blue-100">국민인쇄몰</span>
        </div>
        {/* 우측 고객센터/양식다운 */}
        <div className="flex flex-col items-end">
          <span className="text-blue-100 text-xs mb-1">전화 주문상담</span>
          <div className="flex items-center">
            <a href="#" className="text-yellow-300 font-medium text-sm hover:underline">양식 다운받기</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoSearch;
