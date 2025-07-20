/**
 * 주문 페이지
 * @fileoverview 장바구니에서 주문으로 이어지는 주문 프로세스 페이지
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import TopNav from '@/components/Header/TopNav';
import LogoSearch from '@/components/Header/LogoSearch';
import MainNav from '@/components/Header/MainNav';
import Footer from '@/components/Common/Footer';
import { notifySuccess, notifyError, notifyPromise } from '@/utils/notification';
import { ButtonLoading } from '@/components/Common/LoadingSpinner';
import { Validator } from '@/utils';

interface OrderForm {
  // 주문자 정보
  ordererName: string;
  ordererPhone: string;
  ordererEmail: string;
  
  // 배송 정보
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  deliveryMemo: string;
  
  // 결제 정보
  paymentMethod: 'card' | 'bank' | 'kakao' | 'toss';
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

const OrderPage: React.FC = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: 주문정보, 2: 결제

  const [orderForm, setOrderForm] = useState<OrderForm>({
    ordererName: user?.name || '',
    ordererPhone: '',
    ordererEmail: user?.email || '',
    recipientName: '',
    recipientPhone: '',
    zipCode: '',
    address: '',
    addressDetail: '',
    deliveryMemo: '',
    paymentMethod: 'card',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const [errors, setErrors] = useState<Partial<OrderForm>>({});
  const [sameAsOrderer, setSameAsOrderer] = useState(false);

  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated) {
      notifyError('로그인이 필요합니다.');
      router.push('/auth/login?redirect=/order');
      return;
    }

    if (items.length === 0) {
      notifyError('주문할 상품이 없습니다.');
      router.push('/cart');
      return;
    }
  }, [isAuthenticated, items.length, router]);

  // 주문자와 동일 처리
  useEffect(() => {
    if (sameAsOrderer) {
      setOrderForm(prev => ({
        ...prev,
        recipientName: prev.ordererName,
        recipientPhone: prev.ordererPhone,
      }));
    }
  }, [sameAsOrderer, orderForm.ordererName, orderForm.ordererPhone]);

  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof OrderForm, value: any) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value,
    }));

    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<OrderForm> = {};

    // 주문자 정보 검증
    if (!orderForm.ordererName.trim()) {
      newErrors.ordererName = '주문자 이름을 입력해주세요.';
    }

    if (!orderForm.ordererPhone.trim()) {
      newErrors.ordererPhone = '주문자 전화번호를 입력해주세요.';
    } else if (!Validator.isValidPhone(orderForm.ordererPhone)) {
      newErrors.ordererPhone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    if (!orderForm.ordererEmail.trim()) {
      newErrors.ordererEmail = '주문자 이메일을 입력해주세요.';
    } else if (!Validator.isValidEmail(orderForm.ordererEmail)) {
      newErrors.ordererEmail = '올바른 이메일 형식이 아닙니다.';
    }

    // 배송 정보 검증
    if (!orderForm.recipientName.trim()) {
      newErrors.recipientName = '받는 분 이름을 입력해주세요.';
    }

    if (!orderForm.recipientPhone.trim()) {
      newErrors.recipientPhone = '받는 분 전화번호를 입력해주세요.';
    } else if (!Validator.isValidPhone(orderForm.recipientPhone)) {
      newErrors.recipientPhone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    if (!orderForm.zipCode.trim()) {
      newErrors.zipCode = '우편번호를 입력해주세요.';
    }

    if (!orderForm.address.trim()) {
      newErrors.address = '주소를 입력해주세요.';
    }

    if (!orderForm.addressDetail.trim()) {
      newErrors.addressDetail = '상세주소를 입력해주세요.';
    }

    // 필수 동의 확인
    if (!orderForm.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.' as any;
    }

    if (!orderForm.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요.' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 주문 처리
  const handleOrder = async () => {
    if (!validateForm()) {
      notifyError('입력 정보를 확인해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      // 주문 생성 API 호출 (실제 구현 시)
      const orderData = {
        items,
        totalPrice: getTotalPrice(),
        orderForm,
      };

      // 실제 API 호출 로직
      const orderPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% 성공률
            resolve(orderData);
          } else {
            reject(new Error('주문 처리 중 오류가 발생했습니다.'));
          }
        }, 2000);
      });

      await notifyPromise(orderPromise, {
        loading: '주문을 처리하고 있습니다...',
        success: '주문이 성공적으로 완료되었습니다!',
        error: '주문 처리에 실패했습니다.',
      });

      // 장바구니 비우기
      clearCart();

      // 주문 완료 페이지로 이동
      router.push('/order/complete');

    } catch (error) {
      console.error('주문 처리 실패:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 가격 계산
  const subtotal = getTotalPrice();
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const totalPrice = subtotal + shippingFee;

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <LogoSearch />
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">주문하기</h1>

          {/* 진행 단계 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">주문정보</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">결제완료</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 주문 정보 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 주문 상품 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">주문 상품</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">이미지</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.size}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{parseInt(item.price).toLocaleString()}원</div>
                        <div className="text-sm text-gray-600">수량: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 주문자 정보 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">주문자 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderForm.ordererName}
                      onChange={(e) => handleInputChange('ordererName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ordererName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="주문자 이름"
                    />
                    {errors.ordererName && (
                      <p className="text-red-500 text-xs mt-1">{errors.ordererName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      전화번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={orderForm.ordererPhone}
                      onChange={(e) => handleInputChange('ordererPhone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ordererPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="010-1234-5678"
                    />
                    {errors.ordererPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.ordererPhone}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={orderForm.ordererEmail}
                      onChange={(e) => handleInputChange('ordererEmail', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ordererEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.ordererEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.ordererEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 배송 정보 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">배송 정보</h2>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sameAsOrderer}
                      onChange={(e) => setSameAsOrderer(e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">주문자와 동일</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      받는 분 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderForm.recipientName}
                      onChange={(e) => handleInputChange('recipientName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.recipientName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="받는 분 이름"
                    />
                    {errors.recipientName && (
                      <p className="text-red-500 text-xs mt-1">{errors.recipientName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      전화번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={orderForm.recipientPhone}
                      onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.recipientPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="010-1234-5678"
                    />
                    {errors.recipientPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.recipientPhone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      우편번호 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={orderForm.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="12345"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                        onClick={() => notifyError('우편번호 검색 기능은 추후 구현예정입니다.')}
                      >
                        검색
                      </button>
                    </div>
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      주소 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderForm.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="기본 주소"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상세주소 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderForm.addressDetail}
                      onChange={(e) => handleInputChange('addressDetail', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.addressDetail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="상세주소 (동, 호수 등)"
                    />
                    {errors.addressDetail && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressDetail}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      배송 메모
                    </label>
                    <textarea
                      value={orderForm.deliveryMemo}
                      onChange={(e) => handleInputChange('deliveryMemo', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="배송 시 요청사항을 입력해주세요."
                    />
                  </div>
                </div>
              </div>

              {/* 결제 수단 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">결제 수단</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: 'card', label: '신용카드' },
                    { value: 'bank', label: '계좌이체' },
                    { value: 'kakao', label: '카카오페이' },
                    { value: 'toss', label: '토스' },
                  ].map((method) => (
                    <label key={method.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={orderForm.paymentMethod === method.value}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">약관 동의</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orderForm.agreeTerms}
                      onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      이용약관 동의 <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orderForm.agreePrivacy}
                      onChange={(e) => handleInputChange('agreePrivacy', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      개인정보 처리방침 동의 <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orderForm.agreeMarketing}
                      onChange={(e) => handleInputChange('agreeMarketing', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      마케팅 정보 수신 동의 (선택)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">주문 요약</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">상품 금액</span>
                    <span className="text-gray-900">{subtotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">배송비</span>
                    <span className="text-gray-900">
                      {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">총 결제 금액</span>
                      <span className="text-lg font-bold text-blue-600">{totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <ButtonLoading text="주문 처리 중..." />
                  ) : (
                    `${totalPrice.toLocaleString()}원 결제하기`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderPage; 