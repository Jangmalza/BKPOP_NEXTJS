// components/Header/TopNav.tsx
'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const TopNav: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full bg-blue-900 border-b border-blue-800 text-white text-xs">
      <div className="max-w-[1400px] mx-auto flex justify-end items-center h-9 px-6">
        <a href="#" className="hover:underline mx-2">고객센터</a>
        <a href="#" className="hover:underline mx-2">카톡상담</a>
        
        {isAuthenticated ? (
          <>
            <span className="mx-2">안녕하세요, {user?.name}님!</span>
            <button 
              onClick={handleLogout}
              className="hover:underline mx-2"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <a href="/auth/login" className="hover:underline mx-2">로그인</a>
            <a href="/auth/signup" className="hover:underline mx-2">회원가입</a>
          </>
        )}
        
        <a href="/cart" className="hover:underline mx-2 relative">
          장바구니
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </a>
        <a href="#" className="hover:underline mx-2">주문내역</a>
      </div>
    </div>
  );
};

export default TopNav;
