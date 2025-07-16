'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import { digitalStickerProducts } from '@/lib/digitalPrintProducts';

interface ProductOptions {
  material: string;
  shape: string;
  size: string;
  quantity: number;
  finishing: string[];
  design: File | null;
}

const DigitalStickerDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = parseInt(params.id as string);
  
  const product = digitalStickerProducts.find(p => p.id === productId);
  
  const [options, setOptions] = useState<ProductOptions>({
    material: '유포지',
    shape: '사각형',
    size: '40X60',
    quantity: 1000,
    finishing: ['라미네이팅'],
    design: null
  });

  const [customSize, setCustomSize] = useState({
    width: 40,
    height: 60
  });

  const [totalPrice, setTotalPrice] = useState(4800);

  // 가격 계산 함수
  const calculatePrice = useCallback(() => {
    const basePrice = 4800;
    
    // 소재별 가격
    const materialPrices: { [key: string]: number } = {
      '유포지': 0,
      '투명필름': 800,
      '홀로그램': 1200,
      '크롬': 1500
    };
    
    // 형태별 가격
    const shapePrices: { [key: string]: number } = {
      '사각형': 0,
      '원형': 200,
      '타원형': 300,
      '특수형태': 500
    };
    
    // 수량별 할인
    const quantityDiscounts: { [key: number]: number } = {
      500: 1.1,
      1000: 1,
      2000: 0.9,
      5000: 0.8
    };
    
    // 후가공 가격
    const finishingPrices: { [key: string]: number } = {
      '라미네이팅': 200,
      '코팅': 300,
      '반절': 400
    };
    
    let price = basePrice;
    price += materialPrices[options.material] || 0;
    price += shapePrices[options.shape] || 0;
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
              다양한 형태와 소재의 디지털 스티커로 브랜드 홍보 효과를 극대화하세요.
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
                  {/* 소재 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소재</label>
                    <select
                      value={options.material}
                      onChange={(e) => handleOptionChange('material', e.target.value)}
                      className="w-full p-3 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="유포지">유포지</option>
                      <option value="투명필름">투명필름</option>
                      <option value="홀로그램">홀로그램</option>
                      <option value="크롬">크롬</option>
                    </select>
                    <button className="mt-2 text-blue-600 text-sm hover:underline">
                      🔍 소재보기
                    </button>
                  </div>

                  {/* 형태 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">형태</label>
                    <select
                      value={options.shape}
                      onChange={(e) => handleOptionChange('shape', e.target.value)}
                      className="w-full p-3 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="사각형">사각형</option>
                      <option value="원형">원형</option>
                      <option value="타원형">타원형</option>
                      <option value="특수형태">특수형태</option>
                    </select>
                  </div>

                  {/* 규격 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">규격</label>
                    <select
                      value={options.size}
                      onChange={(e) => handleOptionChange('size', e.target.value)}
                      className="w-full p-3 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="40X60">40X60</option>
                      <option value="50X50">50X50</option>
                      <option value="60X80">60X80</option>
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
                  </div>

                  {/* 수량 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">수량</label>
                    <select
                      value={options.quantity}
                      onChange={(e) => handleOptionChange('quantity', parseInt(e.target.value))}
                      className="w-full p-3 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value={500}>500 매</option>
                      <option value={1000}>1,000 매</option>
                      <option value={2000}>2,000 매</option>
                      <option value={5000}>5,000 매</option>
                    </select>
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
                          checked={options.finishing.includes('라미네이팅')}
                          onChange={(e) => handleFinishingChange('라미네이팅', e.target.checked)}
                          className="rounded bg-white border border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">라미네이팅</span>
                      </label>
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
                          checked={options.finishing.includes('반절')}
                          onChange={(e) => handleFinishingChange('반절', e.target.checked)}
                          className="rounded bg-white border border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">반절</span>
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

export default DigitalStickerDetailPage; 