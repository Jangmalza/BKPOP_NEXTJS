// components/SideMenu/QuickMenu.tsx
import React from 'react';
import quickMenuItems, { QuickMenuItem } from '@/lib/quickMenuItems';

const QuickMenu: React.FC = () => {
  return (
    <div className="p-4 border-b">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-bolt text-yellow-500 mr-2"></i>
        퀵메뉴
      </h3>
      <div className="space-y-3">
        {quickMenuItems.map((item: QuickMenuItem) => (
          <div
            key={item.id}
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
              <i className={`${item.icon} text-blue-600 text-sm`}></i>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-blue-600">{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickMenu;
