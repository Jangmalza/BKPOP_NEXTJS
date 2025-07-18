/**
 * 주문 관리 페이지
 * @fileoverview 관리자 주문 관리 - 주문 목록, 검색, 필터링, 상태 변경
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/Admin/AdminLayout';

interface OrderItem {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  products: {
    id: number;
    title: string;
    quantity: number;
    price: number;
  }[];
}

/**
 * 주문 테이블 행 컴포넌트
 */
const OrderTableRow: React.FC<{
  order: OrderItem;
  onView: (order: OrderItem) => void;
  onStatusChange: (order: OrderItem, newStatus: OrderItem['status']) => void;
}> = ({ order, onView, onStatusChange }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '주문 대기';
      case 'confirmed': return '주문 확인';
      case 'processing': return '제작 중';
      case 'shipped': return '배송 중';
      case 'delivered': return '배송 완료';
      case 'cancelled': return '주문 취소';
      default: return '알 수 없음';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '결제 완료';
      case 'failed': return '결제 실패';
      default: return '결제 대기';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
          <p className="text-sm text-gray-500">{order.customer_email}</p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <p className="text-sm text-gray-900">{order.products.length}개 상품</p>
          <p className="text-sm text-gray-500">
            {order.products.slice(0, 2).map(p => p.title).join(', ')}
            {order.products.length > 2 && ` 외 ${order.products.length - 2}개`}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(order.total_amount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
          {getPaymentStatusText(order.payment_status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order, e.target.value as OrderItem['status'])}
          className={`px-2 py-1 text-xs font-medium rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
        >
          <option value="pending">주문 대기</option>
          <option value="confirmed">주문 확인</option>
          <option value="processing">제작 중</option>
          <option value="shipped">배송 중</option>
          <option value="delivered">배송 완료</option>
          <option value="cancelled">주문 취소</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onView(order)}
          className="text-blue-600 hover:text-blue-900"
        >
          상세보기
        </button>
      </td>
    </tr>
  );
};

/**
 * 주문 상세보기 모달
 */
const OrderDetailModal: React.FC<{
  order: OrderItem | null;
  onClose: () => void;
}> = ({ order, onClose }) => {
  if (!order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  주문 상세 정보
                </h3>
                <div className="space-y-4">
                  {/* 주문 기본 정보 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">주문 정보</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">주문 번호</label>
                        <p className="mt-1 text-sm text-gray-900">{order.order_number}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">주문 일시</label>
                        <p className="mt-1 text-sm text-gray-900">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">주문 상태</label>
                        <p className="mt-1 text-sm text-gray-900">{order.status}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">결제 상태</label>
                        <p className="mt-1 text-sm text-gray-900">{order.payment_status}</p>
                      </div>
                    </div>
                  </div>

                  {/* 고객 정보 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">고객 정보</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">이름</label>
                        <p className="mt-1 text-sm text-gray-900">{order.customer_name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">이메일</label>
                        <p className="mt-1 text-sm text-gray-900">{order.customer_email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">전화번호</label>
                        <p className="mt-1 text-sm text-gray-900">{order.customer_phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* 주문 상품 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">주문 상품</h4>
                    <div className="space-y-3">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white rounded border">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{product.title}</p>
                            <p className="text-sm text-gray-500">수량: {product.quantity}개</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(product.price * product.quantity)}
                            </p>
                            <p className="text-sm text-gray-500">
                              단가: {formatCurrency(product.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-900">총 금액</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 주문 관리 페이지
 */
const OrdersPage: React.FC = () => {
  const pathname = usePathname();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderItem['status']>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | OrderItem['payment_status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 데이터
      const mockOrders: OrderItem[] = [
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
          updated_at: '2024-01-10T10:30:00',
          products: [
            { id: 1, title: '프리미엄 명함', quantity: 1, price: 15000 },
            { id: 2, title: 'A4 전단지', quantity: 20, price: 500 }
          ]
        },
        {
          id: '2',
          order_number: 'ORD-2024-002',
          customer_name: '이영희',
          customer_email: 'lee@example.com',
          customer_phone: '010-2345-6789',
          total_amount: 45000,
          status: 'processing',
          payment_status: 'completed',
          created_at: '2024-01-09T14:20:00',
          updated_at: '2024-01-10T09:15:00',
          products: [
            { id: 3, title: '디지털 명함', quantity: 3, price: 12000 },
            { id: 4, title: '스티커', quantity: 3, price: 3000 }
          ]
        },
        {
          id: '3',
          order_number: 'ORD-2024-003',
          customer_name: '박민수',
          customer_email: 'park@example.com',
          customer_phone: '010-3456-7890',
          total_amount: 8000,
          status: 'shipped',
          payment_status: 'completed',
          created_at: '2024-01-08T16:45:00',
          updated_at: '2024-01-10T11:00:00',
          products: [
            { id: 2, title: '스탠다드 명함', quantity: 1, price: 8000 }
          ]
        },
        {
          id: '4',
          order_number: 'ORD-2024-004',
          customer_name: '최지은',
          customer_email: 'choi@example.com',
          customer_phone: '010-4567-8901',
          total_amount: 36000,
          status: 'delivered',
          payment_status: 'completed',
          created_at: '2024-01-07T11:30:00',
          updated_at: '2024-01-09T14:20:00',
          products: [
            { id: 1, title: '프리미엄 명함', quantity: 2, price: 15000 },
            { id: 5, title: '스티커', quantity: 2, price: 3000 }
          ]
        },
        {
          id: '5',
          order_number: 'ORD-2024-005',
          customer_name: '정태윤',
          customer_email: 'jung@example.com',
          customer_phone: '010-5678-9012',
          total_amount: 12000,
          status: 'cancelled',
          payment_status: 'failed',
          created_at: '2024-01-06T13:15:00',
          updated_at: '2024-01-06T15:30:00',
          products: [
            { id: 4, title: '디지털 명함', quantity: 1, price: 12000 }
          ]
        }
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('주문 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (order: OrderItem) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = async (order: OrderItem, newStatus: OrderItem['status']) => {
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(prev => prev.map(o => 
        o.id === order.id ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o
      ));
      
      console.log(`주문 ${order.order_number} 상태 변경: ${newStatus}`);
    } catch (error) {
      console.error('주문 상태 변경 실패:', error);
      alert('주문 상태 변경에 실패했습니다.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminLayout title="주문 관리" currentPath={pathname}>
      <div className="space-y-6">
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderItem['status'])}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="pending">주문 대기</option>
                <option value="confirmed">주문 확인</option>
                <option value="processing">제작 중</option>
                <option value="shipped">배송 중</option>
                <option value="delivered">배송 완료</option>
                <option value="cancelled">주문 취소</option>
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as 'all' | OrderItem['payment_status'])}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 결제 상태</option>
                <option value="pending">결제 대기</option>
                <option value="completed">결제 완료</option>
                <option value="failed">결제 실패</option>
              </select>
            </div>
          </div>
        </div>

        {/* 주문 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">총 주문</h3>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">대기 중</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">제작 중</h3>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">배송 완료</h3>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
          </div>
        </div>

        {/* 주문 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              주문 목록 ({filteredOrders.length}건)
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주문번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      고객
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상품
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      결제 상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주문 상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <OrderTableRow
                      key={order.id}
                      order={order}
                      onView={handleView}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  다음
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{startIndex + 1}</span>
                    {' - '}
                    <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span>
                    {' / '}
                    <span className="font-medium">{filteredOrders.length}</span>
                    {' 결과'}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      다음
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 주문 상세보기 모달 */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </AdminLayout>
  );
};

export default OrdersPage; 