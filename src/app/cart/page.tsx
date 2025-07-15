'use client';
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import TopNav from '@/components/Header/TopNav';
import LogoSearch from '@/components/Header/LogoSearch';
import MainNav from '@/components/Header/MainNav';
import Footer from '@/components/Common/Footer';

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR');
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('로그인 후 주문하실 수 있습니다.');
      window.location.href = '/auth/login';
      return;
    }
    
    if (items.length === 0) {
      alert('장바구니에 상품이 없습니다.');
      return;
    }

    // 주문 로직 구현 (추후 구현)
    alert('주문 기능은 추후 구현예정입니다.');
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50">
        <TopNav />
        <LogoSearch />
        <MainNav activeTab="" setActiveTab={() => {}} />
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">장바구니</h1>
          <p className="text-gray-600">주문하시기 전 장바구니를 확인해 주세요.</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
              <h2 className="text-2xl font-bold text-gray-400 mb-2">장바구니가 비어 있습니다</h2>
              <p className="text-gray-500">원하는 상품을 장바구니에 담아보세요.</p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              쇼핑 계속하기
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-blue-900">
                    선택상품 ({getTotalItems()}개)
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-600 text-sm"
                  >
                    전체삭제
                  </button>
                </div>
              </div>

              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-blue-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          사이즈: {item.size}
                        </p>
                        <p className="text-blue-600 font-semibold">
                          {formatPrice(item.price)}원
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[120px]">
                        <p className="text-lg font-bold text-blue-900">
                          {formatPrice(item.totalPrice || item.price * item.quantity)}원
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-500 hover:text-red-600 text-sm mt-1"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-900">결제 정보</h3>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품금액</span>
                  <span className="font-semibold">{formatPrice(getTotalPrice())}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배송비</span>
                  <span className="font-semibold">무료</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold text-blue-900">
                    <span>총 결제금액</span>
                    <span>{formatPrice(getTotalPrice())}원</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  쇼핑 계속하기
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  주문하기
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage; 