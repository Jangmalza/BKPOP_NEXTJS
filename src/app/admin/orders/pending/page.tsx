/**
 * 처리 대기 주문 페이지
 * @fileoverview 관리자 처리 대기 주문 관리 - 대기 중인 주문만 표시
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/Admin/AdminLayout';

interface PendingOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: 'pending' | 'confirmed';
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  waiting_time: number; // 대기 시간 (시간 단위)
  priority: 'high' | 'medium' | 'low';
  products: {
    id: number;
    title: string;
    quantity: number;
    price: number;
    urgent: boolean;
  }[];
}

/**
 * 처리 대기 주문 카드 컴포넌트
 */
const PendingOrderCard: React.FC<{
  order: PendingOrder;
  onProcess: (order: PendingOrder) => void;
  onView: (order: PendingOrder) => void;
}> = ({ order, onProcess, onView }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '보통';
    }
  };

  const getWaitingTimeColor = (hours: number) => {
    if (hours >= 24) return 'text-red-600';
    if (hours >= 12) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatWaitingTime = (hours: number) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}일 ${remainingHours}시간`;
    }
    return `${hours}시간`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">{order.order_number}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(order.priority)}`}>
              우선순위: {getPriorityText(order.priority)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>📅 {new Date(order.created_at).toLocaleString()}</span>
            <span className={getWaitingTimeColor(order.waiting_time)}>
              ⏱️ 대기 시간: {formatWaitingTime(order.waiting_time)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total_amount)}</p>
          <p className="text-sm text-gray-500">{order.products.length}개 상품</p>
        </div>
      </div>

      {/* 고객 정보 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-2">고객 정보</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">이름:</span>
            <span className="ml-2 text-gray-900">{order.customer_name}</span>
          </div>
          <div>
            <span className="text-gray-600">이메일:</span>
            <span className="ml-2 text-gray-900">{order.customer_email}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-600">전화:</span>
            <span className="ml-2 text-gray-900">{order.customer_phone}</span>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">주문 상품</h4>
        <div className="space-y-2">
          {order.products.slice(0, 3).map((product, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{product.title}</span>
                {product.urgent && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    긴급
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">{product.quantity}개</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {formatCurrency(product.price * product.quantity)}
                </span>
              </div>
            </div>
          ))}
          {order.products.length > 3 && (
            <p className="text-sm text-gray-500 text-center">
              외 {order.products.length - 3}개 상품
            </p>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onView(order)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          상세보기
        </button>
        <button
          onClick={() => onProcess(order)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          처리하기
        </button>
      </div>
    </div>
  );
};

/**
 * 처리 대기 주문 페이지
 */
const PendingOrdersPage: React.FC = () => {
  const pathname = usePathname();
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'waiting_time' | 'priority' | 'created_at'>('waiting_time');

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 데이터
      const mockPendingOrders: PendingOrder[] = [
        {
          id: '1',
          order_number: 'ORD-2024-001',
          customer_name: '김철수',
          customer_email: 'kim@example.com',
          customer_phone: '010-1234-5678',
          total_amount: 25000,
          status: 'pending',
          payment_status: 'completed',
          created_at: '2024-01-10T10:30:00',
          waiting_time: 6,
          priority: 'high',
          products: [
            { id: 1, title: '프리미엄 명함', quantity: 1, price: 15000, urgent: true },
            { id: 2, title: 'A4 전단지', quantity: 20, price: 500, urgent: false }
          ]
        },
        {
          id: '2',
          order_number: 'ORD-2024-006',
          customer_name: '이영희',
          customer_email: 'lee@example.com',
          customer_phone: '010-2345-6789',
          total_amount: 36000,
          status: 'pending',
          payment_status: 'completed',
          created_at: '2024-01-09T14:20:00',
          waiting_time: 20,
          priority: 'medium',
          products: [
            { id: 3, title: '디지털 명함', quantity: 3, price: 12000, urgent: false }
          ]
        },
        {
          id: '3',
          order_number: 'ORD-2024-007',
          customer_name: '박민수',
          customer_email: 'park@example.com',
          customer_phone: '010-3456-7890',
          total_amount: 15000,
          status: 'pending',
          payment_status: 'completed',
          created_at: '2024-01-08T16:45:00',
          waiting_time: 42,
          priority: 'low',
          products: [
            { id: 4, title: '스티커', quantity: 5, price: 3000, urgent: false }
          ]
        },
        {
          id: '4',
          order_number: 'ORD-2024-008',
          customer_name: '최지은',
          customer_email: 'choi@example.com',
          customer_phone: '010-4567-8901',
          total_amount: 48000,
          status: 'pending',
          payment_status: 'completed',
          created_at: '2024-01-07T11:30:00',
          waiting_time: 72,
          priority: 'high',
          products: [
            { id: 1, title: '프리미엄 명함', quantity: 2, price: 15000, urgent: true },
            { id: 5, title: '대형 배너', quantity: 1, price: 18000, urgent: true }
          ]
        }
      ];

      setPendingOrders(mockPendingOrders);
    } catch (error) {
      console.error('처리 대기 주문 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (order: PendingOrder) => {
    if (confirm(`주문 ${order.order_number}을 처리하시겠습니까?`)) {
      try {
        // 실제 환경에서는 API 호출
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 상태를 'confirmed'로 변경
        setPendingOrders(prev => prev.filter(o => o.id !== order.id));
        alert('주문이 성공적으로 처리되었습니다.');
      } catch (error) {
        console.error('주문 처리 실패:', error);
        alert('주문 처리에 실패했습니다.');
      }
    }
  };

  const handleView = (order: PendingOrder) => {
    // 전체 주문 관리 페이지로 이동하면서 해당 주문 보기
    window.location.href = `/admin/orders?view=${order.id}`;
  };

  const filteredOrders = pendingOrders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  // 정렬
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'waiting_time':
        return b.waiting_time - a.waiting_time; // 대기 시간 긴 순
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'created_at':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); // 오래된 순
      default:
        return 0;
    }
  });

  const urgentOrders = sortedOrders.filter(order => 
    order.products.some(product => product.urgent) || order.waiting_time >= 24
  );

  return (
    <AdminLayout title="처리 대기 주문" currentPath={pathname}>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">처리 대기 주문</h1>
            <p className="text-sm text-gray-600 mt-1">
              처리가 필요한 주문들을 관리합니다.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            전체 주문 관리
          </Link>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">총 대기 주문</h3>
            <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">긴급 주문</h3>
            <p className="text-2xl font-bold text-red-600">{urgentOrders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">24시간 이상 대기</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingOrders.filter(o => o.waiting_time >= 24).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">평균 대기 시간</h3>
            <p className="text-2xl font-bold text-blue-600">
              {pendingOrders.length > 0 
                ? Math.round(pendingOrders.reduce((sum, o) => sum + o.waiting_time, 0) / pendingOrders.length)
                : 0}시간
            </p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="주문번호, 고객명, 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 우선순위</option>
                <option value="high">높음</option>
                <option value="medium">보통</option>
                <option value="low">낮음</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'waiting_time' | 'priority' | 'created_at')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="waiting_time">대기 시간 순</option>
                <option value="priority">우선순위 순</option>
                <option value="created_at">주문 시간 순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 긴급 주문 알림 */}
        {urgentOrders.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">🚨</span>
              <h3 className="text-sm font-medium text-red-800">
                긴급 처리가 필요한 주문이 {urgentOrders.length}건 있습니다.
              </h3>
            </div>
            <p className="text-sm text-red-700 mt-1">
              24시간 이상 대기중이거나 긴급 상품이 포함된 주문들입니다.
            </p>
          </div>
        )}

        {/* 주문 목록 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            처리 대기 주문 ({sortedOrders.length}건)
          </h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : sortedOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">처리 대기 중인 주문이 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">새로운 주문이 들어오면 여기에 표시됩니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedOrders.map((order) => (
                <PendingOrderCard
                  key={order.id}
                  order={order}
                  onProcess={handleProcess}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PendingOrdersPage; 