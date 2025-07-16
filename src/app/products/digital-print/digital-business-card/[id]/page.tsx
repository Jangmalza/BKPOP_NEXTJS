'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import { digitalBusinessCardProducts } from '@/lib/digitalPrintProducts';

interface ProductOptions {
  paper: string;
  printSides: string;
  size: string;
  quantity: number;
  thickness: string;
  finishing: string[];
  design: File | null;
}

const DigitalBusinessCardDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = parseInt(params.id as string);
  
  const product = digitalBusinessCardProducts.find(p => p.id === productId);
  
  const [options, setOptions] = useState<ProductOptions>({
    paper: '아쿠아시트256g',
    printSides: '양면컬러인쇄',
    size: '90mm*50mm',
    quantity: 100,
    thickness: '0.002R',
    finishing: ['디지털박'],
    design: null
  });

  const [customSize, setCustomSize] = useState({
    width: 90,
    height: 50
  });

  const [totalPrice, setTotalPrice] = useState(4500);

  // 가격 계산 함수
  const calculatePrice = useCallback(() => {
    const basePrice = 4500;
    
    // 용지별 가격
    const paperPrices: { [key: string]: number } = {
      '아쿠아시트256g': 0,
      '고급지': 500,
      '아트지': 300
    };
    
    // 수량별 할인
    const quantityDiscounts: { [key: number]: number } = {
      100: 1,
      200: 0.95,
      500: 0.9,
      1000: 0.85
    };
    
    // 후가공 가격
    const finishingPrices: { [key: string]: number } = {
      '디지털박': 1000,
      '디지털엠보싱': 1500,
      '도무송': 800
    };
    
    let price = basePrice;
    price += paperPrices[options.paper] || 0;
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
    <CategoryLayout activeTab="디지털인쇄">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="text-blue-100 mt-2">
              합리적 광택과 인쇄감이 돋보이는 디지털 박 명함으로 당신의 브랜드 가치를 높여보세요.
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
                      <option value="아쿠아시트256g">아쿠아시트256g</option>
                      <option value="고급지">고급지</option>
                      <option value="아트지">아트지</option>
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
                      <option value="양면컬러인쇄">양면컬러인쇄</option>
                      <option value="단면컬러인쇄">단면컬러인쇄</option>
                    </select>
                    <div className="mt-2 text-blue-600 text-sm">
                      🎨 컬러다운로드
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
                      <option value="90mm*50mm">90mm*50mm</option>
                      <option value="85mm*50mm">85mm*50mm</option>
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
                        <button className="text-blue-600 text-sm hover:underline">📏 직접입력</button>
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
                        <option value={100}>100 매</option>
                        <option value={200}>200 매</option>
                        <option value={500}>500 매</option>
                        <option value={1000}>1000 매</option>
                      </select>
                      <span className="text-sm text-gray-600">{options.thickness}</span>
                      <select
                        value={options.thickness}
                        onChange={(e) => handleOptionChange('thickness', e.target.value)}
                        className="p-3 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="0.002R">0.002R</option>
                        <option value="0.003R">0.003R</option>
                      </select>
                      <span className="text-sm text-gray-600">겹</span>
                    </div>
                    <div className="mt-2 text-sm text-red-600">
                      * 후가공 추가시 5%내외 또는 10~20매의 수량이 부족 할 수 있습니다.
                    </div>
                  </div>

                  {/* 디자인 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">디자인</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="file"
                          accept=".ai,.psd,.pdf,.jpg,.png"
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
                  </div>

                  {/* 후가공 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">후가공</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={options.finishing.includes('도무송')}
                          onChange={(e) => handleFinishingChange('도무송', e.target.checked)}
                          className="rounded bg-white border border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">도무송</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={options.finishing.includes('디지털박')}
                          onChange={(e) => handleFinishingChange('디지털박', e.target.checked)}
                          className="rounded bg-white border border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">디지털박</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={options.finishing.includes('디지털엠보싱')}
                          onChange={(e) => handleFinishingChange('디지털엠보싱', e.target.checked)}
                          className="rounded bg-white border border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">디지털엠보싱</span>
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
                    <span className="ml-2">￦{(totalPrice * 0.9).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>주문건:</span>
                    <span className="ml-2">1건</span>
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

export default DigitalBusinessCardDetailPage; 