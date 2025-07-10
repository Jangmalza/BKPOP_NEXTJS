// components/Header/MainNav.tsx
import React, { useState } from 'react';

const navItems = [
  { name: '상업인쇄', sub: ['명함', '봉투', '전단', '스티커', '홍보물'] },
  { name: '디지털인쇄', sub: ['디지털명함', '디지털전단지', '디지털스티커'] },
  { name: '판촉물', sub: ['부채', '포스트잇', '캘린더'] },
  { name: '패키지', sub: ['박스', '쇼핑백', '포장지'] },
  { name: '기획상품', sub: ['프리컷팅', '샘플북'] },
  { name: '셀프디자인', sub: ['로고디자인', '명함디자인'] },
  { name: '실사출력', sub: ['배너', '현수막', '포스터'] },
];

const MainNav: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav className="w-full bg-blue-900 border-b border-blue-800">
      <div className="max-w-[1400px] mx-auto flex px-6">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="relative group"
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              className={`px-6 py-4 text-base font-medium text-white border-b-2 border-transparent transition-all duration-150 hover:text-yellow-300 hover:border-yellow-300 ${activeTab === item.name ? 'border-yellow-400 text-yellow-300' : ''}`}
              onClick={() => setActiveTab(item.name)}
            >
              {item.name}
            </button>
            {/* 드롭다운 서브메뉴 */}
            {hovered === item.name && item.sub && (
              <div className="absolute left-0 top-full min-w-[180px] bg-white text-blue-900 shadow-lg rounded-b z-50">
                {item.sub.map((sub, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="block px-6 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {sub}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default MainNav;