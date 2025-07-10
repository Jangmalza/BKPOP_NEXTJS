import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-blue-900 text-white py-12 border-t border-blue-800">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-12 px-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">보광</h3>
          <p className="mb-2 text-blue-100">국민인쇄몰</p>
          <p className="text-sm text-blue-200 mb-2">사업자 등록번호: 123-45-67890</p>
          <p className="text-sm text-blue-200">서울시 테스트구 테스트로 (테스트동1가 284-51)</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">고객센터</h3>
          <p className="text-3xl font-bold mb-2">1599-5555</p>
          <p className="text-sm text-blue-100">평일 9시 - 오후 6시</p>
        </div>
        <div className="flex flex-col gap-2">
          <a href="#" className="text-blue-200 hover:text-white transition-colors">이용약관</a>
          <a href="#" className="text-blue-200 hover:text-white transition-colors">개인정보취급방침</a>
          <a href="#" className="text-blue-200 hover:text-white transition-colors">사업자정보확인</a>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-blue-200 hover:text-white transition-colors text-2xl"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="text-blue-200 hover:text-white transition-colors text-2xl"><i className="fab fa-instagram"></i></a>
          <a href="#" className="text-blue-200 hover:text-white transition-colors text-2xl"><i className="fab fa-youtube"></i></a>
          <a href="#" className="text-blue-200 hover:text-white transition-colors text-2xl"><i className="fab fa-twitter"></i></a>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto text-blue-200 text-xs mt-8 px-6">© 2025 보광. All rights reserved.</div>
    </footer>
  );
};

export default Footer;

