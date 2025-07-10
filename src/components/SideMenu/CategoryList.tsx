// components/SideMenu/CategoryList.tsx
import React from 'react';

const categories = [
  { name: '상업인쇄', items: ['명함', '전단지', '스티커', '봉투'] },
  { name: '디지털인쇄', items: ['포스터', '현수막', '실사출력', '배너'] },
  { name: '판촉물', items: ['머그컵', '텀블러', '볼펜', '달력'] },
  { name: '패키지', items: ['쇼핑백', '박스', '라벨', '테이프'] },
  { name: '기획상품', items: ['신상품', '베스트', '특가상품', '이벤트'] },
  { name: '셀프디자인', items: ['템플릿', '디자인툴', '폰트', '이미지'] },
  { name: '실사출력', items: ['대형출력', '시트지', '현수막', '실사'] }
];

const CategoryList: React.FC = () => {
  return (
    <div className="p-4 border-b">
      <h3 className="font-medium mb-3">상품 카테고리</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.name} className="group">
            <a href="#" className="flex items-center justify-between py-2 text-gray-700 hover:text-blue-600 group-hover:bg-gray-50 px-2 rounded">
              <span>{category.name}</span>
              <i className="fas fa-chevron-right text-sm"></i>
            </a>
            <ul className="hidden group-hover:block pl-4 mt-1 space-y-1">
              {category.items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">{item}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
