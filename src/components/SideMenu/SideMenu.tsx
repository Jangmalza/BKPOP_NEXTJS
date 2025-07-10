// components/SideMenu/SideMenu.tsx
import React from 'react';
import CategoryList from './CategoryList';
import QuickMenu from './QuickMenu';
import RecentView from './RecentView';
import CustomerService from './CustomerService';

interface SideMenuProps {
  closeSideMenu: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ closeSideMenu }) => {
  return (
    <div
      className="fixed top-0 left-0 w-80 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">전체 카테고리</h2>
          <button
            className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            onClick={closeSideMenu}
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
      </div>
      <div className="overflow-y-auto h-full pb-20">
        <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <i className="fas fa-user text-white text-xl"></i>
            </div>
            <div>
              <p className="font-medium text-gray-800">로그인이 필요합니다</p>
              <p className="text-sm text-gray-600">로그인하고 다양한 혜택을 받아보세요!</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm">
              로그인
            </button>
            <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all duration-200">
              회원가입
            </button>
          </div>
        </div>
        <CategoryList />
        <QuickMenu />
        <RecentView />
        <CustomerService />
      </div>
    </div>
  );
};

export default SideMenu;
