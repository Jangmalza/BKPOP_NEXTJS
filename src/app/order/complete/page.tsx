/**
 * 주문 완료 페이지
 * @fileoverview 주문 완료 후 표시되는 페이지
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopNav from '@/components/Header/TopNav';
import LogoSearch from '@/components/Header/LogoSearch';
import MainNav from '@/components/Header/MainNav';
import Footer from '@/components/Common/Footer';

const OrderCompletePage: React.FC = () => {
  const router = useRouter();

  // 주문 번호 생성 (임시)
  const orderNumber = `BK${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <LogoSearch />
      <MainNav activeTab="주문완료" setActiveTab={() => {}} />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* 성공 아이콘 */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">주문이 완료되었습니다!</h1>
          <p className="text-lg text-gray-600 mb-8">
            주문해 주셔서 감사합니다. 빠른 시일 내에 제작하여 배송해드리겠습니다.
          </p>

          {/* 주문 정보 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">주문 정보</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">주문 번호</span>
                    <span className="font-medium text-gray-900">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">주문 일시</span>
                    <span className="font-medium text-gray-900">
                      {new Date().toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">결제 상태</span>
                    <span className="font-medium text-green-600">결제 완료</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">배송 정보</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">배송 상태</span>
                    <span className="font-medium text-yellow-600">제작 대기</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">예상 배송일</span>
                    <span className="font-medium text-gray-900">
                      {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 안내 사항 */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">주문 안내</h3>
            <div className="text-left space-y-2 text-sm text-blue-800">
              <p>• 주문 확인 후 1-2일 내에 제작이 시작됩니다.</p>
              <p>• 제작 완료 후 당일 또는 익일에 배송됩니다.</p>
              <p>• 주문 상태는 마이페이지에서 확인하실 수 있습니다.</p>
              <p>• 배송 관련 문의는 고객센터로 연락해주세요.</p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              계속 쇼핑하기
            </Link>
            <button
              onClick={() => router.push('/mypage/orders')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              주문 내역 확인
            </button>
          </div>

          {/* 고객센터 정보 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">고객센터</h3>
            <div className="text-gray-600 space-y-2">
              <p>📞 전화: 02-1234-5678</p>
              <p>📧 이메일: support@bkpop.com</p>
              <p>⏰ 운영시간: 평일 9:00 - 18:00 (점심시간 12:00 - 13:00)</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderCompletePage; 