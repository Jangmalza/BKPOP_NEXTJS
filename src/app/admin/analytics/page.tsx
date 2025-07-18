/**
 * 통계 분석 페이지
 * @fileoverview 관리자 통계 분석 - 매출, 주문, 사용자 통계와 차트
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/Admin/AdminLayout';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    averageOrderValue: number;
    revenueGrowth: number;
    orderGrowth: number;
    userGrowth: number;
  };
  revenueChart: {
    labels: string[];
    data: number[];
  };
  orderChart: {
    labels: string[];
    data: number[];
  };
  categoryStats: {
    category: string;
    revenue: number;
    orders: number;
    percentage: number;
  }[];
  topProducts: {
    id: number;
    name: string;
    revenue: number;
    orders: number;
    quantity: number;
  }[];
  userStats: {
    newUsers: number;
    activeUsers: number;
    returningUsers: number;
    userRetentionRate: number;
  };
}

/**
 * 통계 카드 컴포넌트
 */
const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
}> = ({ title, value, change, changeType = 'neutral', icon, color }) => {
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
 * 차트 컴포넌트 (임시)
 */
const ChartPlaceholder: React.FC<{
  title: string;
  height?: string;
  data: any;
}> = ({ title, height = 'h-64', data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className={`${height} flex items-center justify-center bg-gray-50 rounded-lg`}>
        <div className="text-center">
          <p className="text-gray-500 mb-2">📊 차트 영역</p>
          <p className="text-sm text-gray-400">Chart.js 또는 다른 차트 라이브러리로 구현</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>데이터 포인트: {data.labels?.length || 0}개</p>
            <p>최대값: {Math.max(...(data.data || [0]))}</p>
            <p>최소값: {Math.min(...(data.data || [0]))}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 카테고리 통계 표
 */
const CategoryStatsTable: React.FC<{
  categories: AnalyticsData['categoryStats'];
}> = ({ categories }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">카테고리별 매출</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                매출
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                비율
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                진행률
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(category.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.orders}건
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.percentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * 인기 상품 표
 */
const TopProductsTable: React.FC<{
  products: AnalyticsData['topProducts'];
}> = ({ products }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">인기 상품</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                순위
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                매출
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                판매량
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(product.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.orders}건
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.quantity}개
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * 통계 분석 페이지
 */
const AnalyticsPage: React.FC = () => {
  const pathname = usePathname();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 임시 데이터
      const mockData: AnalyticsData = {
        overview: {
          totalRevenue: 12500000,
          totalOrders: 856,
          totalUsers: 1234,
          averageOrderValue: 14602,
          revenueGrowth: 15.2,
          orderGrowth: 8.7,
          userGrowth: 12.3
        },
        revenueChart: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
          data: [1800000, 2200000, 1900000, 2800000, 2400000, 3200000]
        },
        orderChart: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
          data: [120, 150, 135, 180, 165, 210]
        },
        categoryStats: [
          { category: '상업인쇄', revenue: 5200000, orders: 342, percentage: 41.6 },
          { category: '디지털인쇄', revenue: 3100000, orders: 198, percentage: 24.8 },
          { category: '대형인쇄', revenue: 2800000, orders: 156, percentage: 22.4 },
          { category: '패키지', revenue: 900000, orders: 87, percentage: 7.2 },
          { category: '기타', revenue: 500000, orders: 73, percentage: 4.0 }
        ],
        topProducts: [
          { id: 1, name: '프리미엄 명함', revenue: 2100000, orders: 140, quantity: 140 },
          { id: 2, name: '디지털 명함', revenue: 1800000, orders: 150, quantity: 150 },
          { id: 3, name: 'A4 전단지', revenue: 1200000, orders: 200, quantity: 2400 },
          { id: 4, name: '스티커', revenue: 900000, orders: 300, quantity: 300 },
          { id: 5, name: '대형 배너', revenue: 800000, orders: 45, quantity: 45 }
        ],
        userStats: {
          newUsers: 234,
          activeUsers: 892,
          returningUsers: 156,
          userRetentionRate: 67.5
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('통계 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout title="통계 분석" currentPath={pathname}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">통계 데이터를 불러오는 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!analyticsData) {
    return (
      <AdminLayout title="통계 분석" currentPath={pathname}>
        <div className="text-center py-12">
          <p className="text-gray-500">통계 데이터를 불러올 수 없습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="통계 분석" currentPath={pathname}>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">통계 분석</h1>
            <p className="text-sm text-gray-600 mt-1">
              비즈니스 성과를 분석하고 트렌드를 파악하세요.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">최근 7일</option>
              <option value="30days">최근 30일</option>
              <option value="90days">최근 90일</option>
              <option value="1year">최근 1년</option>
            </select>
            <button
              onClick={() => fetchAnalyticsData()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              새로고침
            </button>
          </div>
        </div>

        {/* 개요 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="총 매출"
            value={formatCurrency(analyticsData.overview.totalRevenue)}
            change={`+${analyticsData.overview.revenueGrowth}% (전월 대비)`}
            changeType="increase"
            icon="💰"
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="총 주문"
            value={analyticsData.overview.totalOrders.toLocaleString()}
            change={`+${analyticsData.overview.orderGrowth}% (전월 대비)`}
            changeType="increase"
            icon="🛒"
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="총 사용자"
            value={analyticsData.overview.totalUsers.toLocaleString()}
            change={`+${analyticsData.overview.userGrowth}% (전월 대비)`}
            changeType="increase"
            icon="👥"
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            title="평균 주문가"
            value={formatCurrency(analyticsData.overview.averageOrderValue)}
            icon="📊"
            color="bg-yellow-100 text-yellow-600"
          />
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder
            title="월별 매출 현황"
            data={analyticsData.revenueChart}
          />
          <ChartPlaceholder
            title="월별 주문 현황"
            data={analyticsData.orderChart}
          />
        </div>

        {/* 사용자 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="신규 사용자"
            value={analyticsData.userStats.newUsers.toLocaleString()}
            icon="👤"
            color="bg-indigo-100 text-indigo-600"
          />
          <StatCard
            title="활성 사용자"
            value={analyticsData.userStats.activeUsers.toLocaleString()}
            icon="🔥"
            color="bg-red-100 text-red-600"
          />
          <StatCard
            title="재방문 사용자"
            value={analyticsData.userStats.returningUsers.toLocaleString()}
            icon="🔄"
            color="bg-orange-100 text-orange-600"
          />
          <StatCard
            title="사용자 유지율"
            value={`${analyticsData.userStats.userRetentionRate}%`}
            icon="📈"
            color="bg-teal-100 text-teal-600"
          />
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryStatsTable categories={analyticsData.categoryStats} />
          <TopProductsTable products={analyticsData.topProducts} />
        </div>

        {/* 추가 인사이트 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">주요 인사이트</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📈 매출 성장</h4>
              <p className="text-sm text-blue-800">
                전월 대비 매출이 {analyticsData.overview.revenueGrowth}% 증가했습니다. 
                상업인쇄 부문이 주요 성장 동력입니다.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">🎯 인기 상품</h4>
              <p className="text-sm text-green-800">
                프리미엄 명함이 가장 높은 매출을 기록했으며, 
                디지털 명함의 주문량이 꾸준히 증가하고 있습니다.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">👥 사용자 현황</h4>
              <p className="text-sm text-purple-800">
                신규 사용자 유입이 {analyticsData.overview.userGrowth}% 증가했고, 
                사용자 유지율은 {analyticsData.userStats.userRetentionRate}%입니다.
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">💡 개선 제안</h4>
              <p className="text-sm text-yellow-800">
                평균 주문가가 {formatCurrency(analyticsData.overview.averageOrderValue)}인 점을 고려하여 
                번들 상품 제안을 통해 객단가를 높일 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage; 