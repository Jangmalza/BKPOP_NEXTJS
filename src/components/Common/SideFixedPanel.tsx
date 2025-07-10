import React from 'react';

const SideFixedPanel: React.FC = () => {
  return (
    <div className="fixed right-0 top-1/3 bg-white shadow-lg rounded-l-lg z-50">
      <div className="p-4 space-y-4">
        <div className="flex flex-col items-center">
          <i className="fas fa-headset text-2xl text-blue-600 mb-2"></i>
          <span className="text-sm">고객센터</span>
        </div>
        <div className="flex flex-col items-center">
          <i className="fas fa-shopping-cart text-2xl text-blue-600 mb-2"></i>
          <span className="text-sm">장바구니</span>
        </div>
        <div className="flex flex-col items-center">
          <i className="fas fa-arrow-up text-2xl text-blue-600 mb-2"></i>
          <span className="text-sm">TOP</span>
        </div>
      </div>
    </div>
  );
};

export default SideFixedPanel;
