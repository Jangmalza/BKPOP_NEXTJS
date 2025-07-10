import React from 'react';

const shortcuts = [
  { icon: 'fa-search', text: '주문배송' },
  { icon: 'fa-eye', text: '목록배송' },
  { icon: 'fa-calendar-check', text: '출고일' },
  { icon: 'fa-exchange-alt', text: 'A/S상담' },
  { icon: 'fa-star', text: '별점' },
  { icon: 'fa-map-marker-alt', text: '매장위치' },
];

const ServiceShortcuts: React.FC = () => {
  return (
    <div className="bg-white py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          {shortcuts.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <i className={`fas ${item.icon} text-gray-500`}></i>
              </div>
              <span className="text-sm text-gray-700">{item.text}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceShortcuts;
