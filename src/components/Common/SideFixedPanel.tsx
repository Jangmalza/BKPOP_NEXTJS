'use client';
import React from 'react';
import { useCart } from '@/contexts/CartContext';

const SideFixedPanel: React.FC = () => {
  const { getTotalItems } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-0 top-1/3 bg-white shadow-lg rounded-l-lg z-50">
      <div className="p-4 space-y-4">
        <div className="flex flex-col items-center cursor-pointer">
          <i className="fas fa-headset text-2xl text-blue-600 mb-2"></i>
          <span className="text-sm">고객센터</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer relative">
          <a href="/cart" className="flex flex-col items-center">
            <i className="fas fa-shopping-cart text-2xl text-blue-600 mb-2"></i>
            <span className="text-sm">장바구니</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </a>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={scrollToTop}>
          <i className="fas fa-arrow-up text-2xl text-blue-600 mb-2"></i>
          <span className="text-sm">TOP</span>
        </div>
      </div>
    </div>
  );
};

export default SideFixedPanel;
