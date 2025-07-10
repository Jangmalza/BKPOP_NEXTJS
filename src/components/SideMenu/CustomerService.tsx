import React from 'react';

const CustomerService: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50 mt-4">
      <div className="text-center">
        <h3 className="font-bold text-lg mb-1">고객센터</h3>
        <p className="text-blue-600 font-bold text-xl mb-1">1599-5555</p>
        <p className="text-sm text-gray-500">평일 09:00 - 18:00</p>
        <p className="text-sm text-gray-500">점심 12:00 - 13:00</p>
      </div>
    </div>
  );
};

export default CustomerService;
