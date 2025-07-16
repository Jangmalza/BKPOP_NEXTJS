'use client';
import React, { useState } from 'react';
import TopNav from '@/components/Header/TopNav';
import LogoSearch from '@/components/Header/LogoSearch';
import MainNav from '@/components/Header/MainNav';
import MainSlider from '@/components/Slider/MainSlider';
import ProductList from '@/components/Product/ProductList';
import Footer from '@/components/Common/Footer';
import bestProducts from '@/lib/bestProducts';
import recommendedProducts from '@/lib/recommendedProducts';

export default function Home() {
  const [activeTab, setActiveTab] = useState('상업인쇄');

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50">
        <TopNav />
        <LogoSearch />
        <MainNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </header>
      <MainSlider />
      <ProductList title="베스트 상품" products={bestProducts} showCartButton={false} />
      <ProductList title="추천 상품" products={recommendedProducts} showCartButton={false} />
      {/* 후기/공지/정보 섹션 */}
      <section className="w-full py-16 bg-white border-b">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-blue-900">고객님들의 생생한 후기</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow text-center">
              <div className="flex justify-center mb-2 text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
              </div>
              <p className="text-gray-700 mb-4">&ldquo;명함 주문했는데 정말 빠르고 깔끔하게 나왔어요! 다음에도 꼭 이용할게요.&rdquo;</p>
              <div className="text-sm text-gray-500">- 김** 님</div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow text-center">
              <div className="flex justify-center mb-2 text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
              </div>
              <p className="text-gray-700 mb-4">&ldquo;회사 브로셔 제작했는데 디자인도 예쁘고 품질도 훌륭해요. 강력 추천!&rdquo;</p>
              <div className="text-sm text-gray-500">- 박** 님</div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow text-center">
              <div className="flex justify-center mb-2 text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
              </div>
              <p className="text-gray-700 mb-4">&ldquo;가격도 합리적이고 서비스도 친절해서 정말 만족스러워요.&rdquo;</p>
              <div className="text-sm text-gray-500">- 이** 님</div>
            </div>
          </div>
        </div>
      </section>
      {/* 공지사항/이벤트 섹션 */}
      <section className="w-full py-16 bg-gray-100 border-b">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-blue-900">공지사항 & 이벤트</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4 text-blue-900">📢 최신 공지사항</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">2025.01.15</span>
                  <span className="font-medium text-blue-900">신년 맞이 대량 주문 할인 이벤트</span>
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">NEW</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">2025.01.10</span>
                  <span className="font-medium text-blue-900">명함 인쇄 품질 개선 안내</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">2025.01.05</span>
                  <span className="font-medium text-blue-900">전단지 대량 주문 추가 할인 혜택</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4 text-blue-900">🎉 진행중인 이벤트</h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-100 border-l-4 border-yellow-400 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-2">신규 고객 첫 주문 20% 할인</h4>
                  <p className="text-sm text-yellow-700">첫 주문시 20% 할인 쿠폰 자동 적용</p>
                </div>
                <div className="p-4 bg-blue-100 border-l-4 border-blue-400 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">대량 주문 추가 할인</h4>
                  <p className="text-sm text-blue-700">100장 이상 주문시 추가 10% 할인</p>
                </div>
                <div className="p-4 bg-green-100 border-l-4 border-green-400 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">정기 고객 특별 혜택</h4>
                  <p className="text-sm text-green-700">월 3회 이상 주문시 VIP 혜택 제공</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 인쇄가이드/서비스 소개 섹션 */}
      <section className="w-full py-16 bg-white border-b">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-blue-900">인쇄 가이드 & 서비스 소개</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-upload text-blue-600 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-900">1. 파일 업로드</h3>
              <p className="text-gray-600">PDF, AI, EPS 등 다양한 포맷 지원<br/>고해상도 파일로 최고 품질 보장</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cog text-green-600 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-900">2. 인쇄 제작</h3>
              <p className="text-gray-600">최신 장비로 정밀 인쇄<br/>품질 검수 후 출고</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shipping-fast text-yellow-600 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-900">3. 빠른 배송</h3>
              <p className="text-gray-600">당일 출고부터 3일 이내<br/>전국 무료 배송</p>
            </div>
          </div>
        </div>
      </section>
      {/* 추가 정보/링크 섹션 */}
      <section className="w-full py-16 bg-gray-100 border-b">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-blue-900">고객지원 & 유용한 정보</h2>
          <div className="grid grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <i className="fas fa-question-circle text-blue-600 text-3xl mb-4"></i>
              <h3 className="font-bold mb-2 text-blue-900">자주묻는질문</h3>
              <p className="text-sm text-gray-600 mb-4">고객님들이 자주 묻는 질문과 답변</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">바로가기</button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <i className="fas fa-download text-green-600 text-3xl mb-4"></i>
              <h3 className="font-bold mb-2 text-blue-900">양식다운로드</h3>
              <p className="text-sm text-gray-600 mb-4">명함, 전단지 등 인쇄용 양식</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">바로가기</button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <i className="fas fa-phone text-yellow-600 text-3xl mb-4"></i>
              <h3 className="font-bold mb-2 text-blue-900">고객센터</h3>
              <p className="text-sm text-gray-600 mb-4">전문 상담원이 도와드립니다</p>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition">바로가기</button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <i className="fas fa-truck text-purple-600 text-3xl mb-4"></i>
              <h3 className="font-bold mb-2 text-blue-900">배송조회</h3>
              <p className="text-sm text-gray-600 mb-4">주문하신 상품의 배송 현황</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition">바로가기</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
