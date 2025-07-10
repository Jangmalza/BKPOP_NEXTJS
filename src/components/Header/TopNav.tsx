// components/Header/TopNav.tsx
import React from 'react';

const TopNav: React.FC = () => {
  return (
    <div className="w-full bg-blue-900 border-b border-blue-800 text-white text-xs">
      <div className="max-w-[1400px] mx-auto flex justify-end items-center h-9 px-6">
        <a href="#" className="hover:underline mx-2">고객센터</a>
        <a href="#" className="hover:underline mx-2">카톡상담</a>
        <a href="#" className="hover:underline mx-2">로그인</a>
        <a href="#" className="hover:underline mx-2">회원가입</a>
        <a href="#" className="hover:underline mx-2">장바구니</a>
        <a href="#" className="hover:underline mx-2">주문내역</a>
      </div>
    </div>
  );
};

export default TopNav;
