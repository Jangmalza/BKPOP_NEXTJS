'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import { businessCardProducts } from '@/lib/commercialPrintProducts';

interface ProductOptions {
  paper: string;
  printSides: string;
  size: string;
  quantity: number;
  thickness: string;
  finishing: string[];
  design: File | null;
}

const BusinessCardDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = parseInt(params.id as string);
  
  const product = businessCardProducts.find(p => p.id === productId);
  
  const [options, setOptions] = useState<ProductOptions>({
    paper: '모조지250g',
    printSides: '양면4도',
    size: '90X50',
    quantity: 1000,
    thickness: '0.35T',
    finishing: ['코팅'],
    design: null
  });

  const [customSize, setCustomSize] = useState({
    width: 90,
    height: 50
  });

  const [totalPrice, setTotalPrice] = useState(35000);

  // 가격 계산 함수
  const calculatePrice = useCallback(() => {
    const basePrice = 35000;
    
    // 용지별 가격
    const paperPrices: { [key: string]: number } = {
      '모조지250g': 0,
      '스노우화이트': 5000,
      '아트지': 3000,
      '고급지': 8000
    };
    
    // 인쇄도수별 가격
    const printPrices: { [key: string]: number } = {
      '양면4도': 0,
      '단면4도': -5000,
      '양면1도': -10000,
      '단면1도': -15000
    };
    
    // 수량별 할인
    const quantityDiscounts: { [key: number]: number } = {
      500: 1.2,
      1000: 1,
      2000: 0.8,
      5000: 0.6
    };
    
    // 후가공 가격
    const finishingPrices: { [key: string]: number } = {
      '코팅': 8000,
      '라미네이팅': 12000,
      '엠보싱': 15000,
      '박': 20000
    };
    
    let price = basePrice;
    price += paperPrices[options.paper] || 0;
    price += printPrices[options.printSides] || 0;
    price *= quantityDiscounts[options.quantity] || 1;
    
    // 후가공 비용 추가
    options.finishing.forEach(finish => {
      price += finishingPrices[finish] || 0;
    });
    
    setTotalPrice(Math.round(price));
  }, [options]);

  useEffect(() => {
    calculatePrice();
  }, [options, calculatePrice]);

  const handleOptionChange = (key: keyof ProductOptions, value: string | number) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFinishingChange = (finish: string, checked: boolean) => {
    setOptions(prev => ({
      ...prev,
      finishing: checked 
        ? [...prev.finishing, finish]
        : prev.finishing.filter(f => f !== finish)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setOptions(prev => ({
      ...prev,
      design: file
    }));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      ...product,
      price: `${totalPrice.toLocaleString()}원`,
      options: options,
      title: `${product.title} (${options.size})`
    };
    
    addItem(cartItem, 1);
    alert('상품이 장바구니에 추가되었습니다!');
  };

  const handleDirectOrder = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <CategoryLayout activeTab="상업인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="text-blue-100 mt-2">
              오프셋 인쇄 방식으로 제작되는 고품질 명함으로 전문적인 비즈니스 이미지를 완성하세요.
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 상품 이미지 */}
              <div className="lg:col-span-1">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full rounded-lg shadow-md"
                />
                <div className="mt-4 text-center">
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                    📄 템플릿 보기
                  </button>
                </div>
              </div>

              {/* 주문 옵션 */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* 용지 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">용지</label>
                    <select
                      value={options.paper}
                      onChange={(e) => handleOptionChange('paper', e.target.value)}
                      className="w-full p-3 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="모조지250g">모조지250g</option>
                      <option value="스노우화이트">스노우화이트</option>
                      <option value="아트지">아트지</option>
                      <option value="고급지">고급지</option>
                    </select>
                    <button className="mt-2 text-blue-600 text-sm hover:underline">
                      🔍 재질보기
                    </button>
                  </div>

                  {/* 인쇄도수 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">인쇄도수</label>
                    <select
                      value={options.printSides}
                      onChange={(e) => handleOptionChange('printSides', e.target.value)}
                      className="w-full p-3 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="양면4도">양면4도</option>
                      <option value="단면4도">단면4도</option>
                      <option value="양면1도">양면1도</option>
                      <option value="단면1도">단면1도</option>
                    </select>
                    <div className="mt-2 text-blue-600 text-sm">
                      🎨 컬러차트
                    </div>
                  </div>

                  {/* 규격 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">규격</label>
                    <select
                      value={options.size}
                      onChange={(e) => handleOptionChange('size', e.target.value)}
                      className="w-full p-3 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="90X50">90X50</option>
                      <option value="85X50">85X50</option>
                      <option value="95X55">95X55</option>
                      <option value="custom">직접입력</option>
                    </select>
                    
                    {options.size === 'custom' && (
                      <div className="mt-3 flex items-center space-x-2">
                        <span className="text-sm text-gray-600">가로</span>
                        <input
                          type="number"
                          value={customSize.width}
                          onChange={(e) => setCustomSize(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                          className="w-20 px-2 py-1 bg-white border border-gray-400 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                        <span className="text-sm text-gray-600">mm 세로</span>
                        <input
                          type="number"
                          value={customSize.height}
                          onChange={(e) => setCustomSize(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                          className="w-20 px-2 py-1 bg-white border border-gray-400 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                        <span className="text-sm text-gray-600">mm</span>
                      </div>
                    )}
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex space-x-4">
                        <span className="text-blue-600">제단사이즈</span>
                        <span>가로 {options.size === 'custom' ? customSize.width : 90} mm 세로 {options.size === 'custom' ? customSize.height : 50} mm</span>
                      </div>
                      <div className="flex space-x-4 mt-1">
                        <span className="text-blue-600">작업사이즈</span>
                        <span>가로 {options.size === 'custom' ? customSize.width + 4 : 94} mm 세로 {options.size === 'custom' ? customSize.height + 4 : 54} mm</span>
                      </div>
                    </div>
                  </div>

                  {/* 수량 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">수량</label>
                    <div className="flex items-center space-x-2">
                      <select
                        value={options.quantity}
                        onChange={(e) => handleOptionChange('quantity', parseInt(e.target.value))}
                        className="p-3 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value={500}>500 매</option>
                        <option value={1000}>1,000 매</option>
                        <option value={2000}>2,000 매</option>
                        <option value={5000}>5,000 매</option>
                      </select>
                      <span className="text-sm text-gray-600">{options.thickness}</span>
                    </div>
                    <div className="mt-2 text-sm text-red-600">
                      * 오프셋 인쇄 특성상 ±5% 내외의 수량 차이가 발생할 수 있습니다.
                    </div>
                  </div>

                  {/* 디자인 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">디자인</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="file"
                          accept=".ai,.eps,.pdf,.tiff"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <span className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                          + 디자인 신청하기
                        </span>
                      </label>
                      <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                        📁 상세보기
                      </button>
                    </div>
                    {options.design && (
                      <div className="mt-2 text-sm text-green-600">
                        업로드된 파일: {options.design.name}
                      </div>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      * 오프셋 인쇄용 고해상도 파일(300dpi 이상)을 업로드해 주세요.
                    </div>
                  </div>

                  {/* 후가공 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">후가공</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={options.finishing.includes('코팅')}
                          onChange={(e) => handleFinishingChange('코팅', e.target.checked)}
                          className="rounded bg-white border border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">코팅</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={options.finishing.includes('라미네이팅')}
                          onChange={(e) => handleFinishingChange('라미네이팅', e.target.checked)}
                          className="rounded bg-white border border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">라미네이팅</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={options.finishing.includes('엠보싱')}
                          onChange={(e) => handleFinishingChange('엠보싱', e.target.checked)}
                          className="rounded bg-white border border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">엠보싱</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={options.finishing.includes('박')}
                          onChange={(e) => handleFinishingChange('박', e.target.checked)}
                          className="rounded bg-white border border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">박</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 가격 및 주문 버튼 */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm text-gray-600">
                    <span>인쇄비:</span>
                    <span className="ml-2">￦{(totalPrice * 0.85).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>후가공비:</span>
                    <span className="ml-2">￦{(totalPrice * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>합계:</span>
                    <span className="ml-2">￦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>부가세:</span>
                    <span className="ml-2">￦{Math.round(totalPrice * 0.1).toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    ￦{(totalPrice + Math.round(totalPrice * 0.1)).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-orange-600 transition"
                >
                  바로주문
                </button>
                <button
                  onClick={handleDirectOrder}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  견적문의
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default BusinessCardDetailPage; 