'use client';
// components/Header/MainNav.tsx
import React, { useState } from 'react';

const navItems = [
  { 
    name: '상업인쇄', 
    sub: [
      { name: '명함', url: '/products/commercial-print/business-card' },
      { name: '봉투', url: '/products/commercial-print/envelope' },
      { name: '전단', url: '/products/commercial-print/flyer' },
      { name: '스티커', url: '/products/commercial-print/sticker' },
      { name: '홍보물', url: '/products/commercial-print/promotion' }
    ]
  },
  { 
    name: '디지털인쇄', 
    sub: [
      { name: '디지털명함', url: '/products/digital-print/digital-business-card' },
      { name: '디지털전단지', url: '/products/digital-print/digital-flyer' },
      { name: '디지털스티커', url: '/products/digital-print/digital-sticker' }
    ]
  },
  { 
    name: '판촉물', 
    sub: [
      { name: '부채', url: '/products/promotional/fan' },
      { name: '포스트잇', url: '/products/promotional/post-it' },
      { name: '캘린더', url: '/products/promotional/calendar' }
    ]
  },
  { 
    name: '패키지', 
    sub: [
      { name: '박스', url: '/products/package/box' },
      { name: '쇼핑백', url: '/products/package/shopping-bag' },
      { name: '포장지', url: '/products/package/wrapping-paper' }
    ]
  },
  { 
    name: '기획상품', 
    sub: [
      { name: '프리컷팅', url: '/products/planning/pre-cutting' },
      { name: '샘플북', url: '/products/planning/sample-book' }
    ]
  },
  { 
    name: '셀프디자인', 
    sub: [
      { name: '로고디자인', url: '/products/self-design/logo-design' },
      { name: '명함디자인', url: '/products/self-design/business-card-design' }
    ]
  },
  { 
    name: '실사출력', 
    sub: [
      { name: '배너', url: '/products/large-format/banner' },
      { name: '현수막', url: '/products/large-format/hanging-banner' },
      { name: '포스터', url: '/products/large-format/poster' }
    ]
  },
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
                    href={sub.url}
                    className="block px-6 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {sub.name}
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