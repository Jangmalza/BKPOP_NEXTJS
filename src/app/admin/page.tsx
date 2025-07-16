/**
 * 관리자 대시보드 페이지
 * @fileoverview 관리자 메인 대시보드 - 통계, 차트, 최근 활동
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/Admin/AdminLayout';
import { AdminStats } from '@/types';

/**
 * 통계 카드 컴포넌트
 */
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
}> = ({ title, value, icon, color, change, changeType = 'neutral' }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 최근 활동 아이템 컴포넌트
 */
const ActivityItem: React.FC<{
  type: 'user' | 'order' | 'product';
  message: string;
  time: string;
}> = ({ type, message, time }) => {
  const getIcon = () => {
    switch (type) {
      case 'user': return '👤';
      case 'order': return '🛒';
      case 'product': return '📦';
      default: return '📄';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-600';
      case 'order': return 'bg-green-100 text-green-600';
      case 'product': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColor()}`}>
        <span className="text-sm">{getIcon()}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

/**
 * 관리자 대시보드 페이지
 */
const AdminDashboard: React.FC = () => {
  const pathname = usePathname();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    todayNewUsers: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 환경에서는 API 호출로 데이터를 가져옴
    const fetchStats = async () => {
      try {
        // 임시 데이터 (실제로는 API 호출)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalUsers: 1234,
          totalOrders: 856,
          totalProducts: 245,
          totalRevenue: 12500000,
          todayNewUsers: 23,
          todayOrders: 45,
          monthlyRevenue: 3200000,
          revenueGrowth: 15.2
        });
      } catch (error) {
        console.error('통계 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const recentActivities = [
    {
      type: 'user' as const,
      message: '새로운 사용자 "김철수"님이 가입했습니다.',
      time: '5분 전'
    },
    {
      type: 'order' as const,
      message: '주문 #1234가 결제 완료되었습니다.',
      time: '12분 전'
    },
    {
      type: 'product' as const,
      message: '상품 "명함 인쇄"의 재고가 부족합니다.',
      time: '1시간 전'
    },
    {
      type: 'order' as const,
      message: '주문 #1233이 배송 시작되었습니다.',
      time: '2시간 전'
    },
    {
      type: 'user' as const,
      message: '사용자 "이영희"님이 계정을 삭제했습니다.',
      time: '3시간 전'
    }
  ];

  return (
    <AdminLayout title="대시보드" currentPath={pathname}>
      <div className="space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="총 사용자"
            value={loading ? '...' : stats.totalUsers.toLocaleString()}
            icon="👥"
            color="bg-blue-100 text-blue-600"
            change={loading ? '' : `+${stats.todayNewUsers}명 (오늘)`}
            changeType="increase"
          />
          <StatCard
            title="총 주문"
            value={loading ? '...' : stats.totalOrders.toLocaleString()}
            icon="🛒"
            color="bg-green-100 text-green-600"
            change={loading ? '' : `+${stats.todayOrders}건 (오늘)`}
            changeType="increase"
          />
          <StatCard
            title="총 상품"
            value={loading ? '...' : stats.totalProducts.toLocaleString()}
            icon="📦"
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            title="총 매출"
            value={loading ? '...' : formatCurrency(stats.totalRevenue)}
            icon="💰"
            color="bg-yellow-100 text-yellow-600"
            change={loading ? '' : `+${stats.revenueGrowth}% (전월 대비)`}
            changeType="increase"
          />
        </div>

        {/* 차트 및 최근 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 월별 매출 차트 (임시) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">월별 매출 현황</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">차트 컴포넌트 (Chart.js 등으로 구현 예정)</p>
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">최근 활동</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  type={activity.type}
                  message={activity.message}
                  time={activity.time}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">빠른 액션</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="text-2xl mr-3">👤</span>
              <span className="text-sm font-medium text-blue-700">사용자 추가</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <span className="text-2xl mr-3">📦</span>
              <span className="text-sm font-medium text-green-700">상품 등록</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <span className="text-2xl mr-3">🛒</span>
              <span className="text-sm font-medium text-purple-700">주문 관리</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <span className="text-2xl mr-3">📊</span>
              <span className="text-sm font-medium text-yellow-700">리포트 생성</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 