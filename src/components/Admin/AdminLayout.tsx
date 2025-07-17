/**
 * 관리자 레이아웃 컴포넌트
 * @fileoverview 관리자 페이지의 기본 레이아웃 (사이드바, 헤더, 메인 콘텐츠)
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, AdminMenuItem } from '@/types';
import { getCurrentUser, isAdmin, canAccessAdminPage } from '@/utils/auth';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  /** 메인 콘텐츠 */
  children: React.ReactNode;
  /** 페이지 제목 */
  title?: string;
  /** 현재 경로 */
  currentPath?: string;
}

/**
 * 관리자 메뉴 설정
 */
const adminMenuItems: AdminMenuItem[] = [
  {
    id: 'dashboard',
    title: '대시보드',
    icon: '📊',
    path: '/admin',
  },
  {
    id: 'users',
    title: '사용자 관리',
    icon: '👥',
    path: '/admin/users',
    requiredRole: 'admin',
  },
  {
    id: 'products',
    title: '상품 관리',
    icon: '📦',
    path: '/admin/products',
    children: [
      {
        id: 'products-list',
        title: '상품 목록',
        icon: '📋',
        path: '/admin/products',
      },
      {
        id: 'products-add',
        title: '상품 추가',
        icon: '➕',
        path: '/admin/products/add',
      },
    ],
  },
  {
    id: 'orders',
    title: '주문 관리',
    icon: '🛒',
    path: '/admin/orders',
    children: [
      {
        id: 'orders-list',
        title: '주문 목록',
        icon: '📋',
        path: '/admin/orders',
      },
      {
        id: 'orders-pending',
        title: '처리 대기',
        icon: '⏳',
        path: '/admin/orders/pending',
      },
    ],
  },
  {
    id: 'analytics',
    title: '통계 분석',
    icon: '📈',
    path: '/admin/analytics',
  },
  {
    id: 'settings',
    title: '설정',
    icon: '⚙️',
    path: '/admin/settings',
    requiredRole: 'super_admin',
  },
];

/**
 * 관리자 레이아웃 컴포넌트
 * @param props - 컴포넌트 props
 * @returns JSX.Element
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = '관리자 페이지',
  currentPath = '/admin'
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AdminLayout useEffect 실행');
    const currentUser = getCurrentUser();
    console.log('현재 사용자:', currentUser);
    
    if (!currentUser) {
      console.log('사용자가 없음, 로그인 페이지로 이동');
      router.push('/auth/login?redirect=/admin');
      return;
    }

    console.log('사용자 역할:', currentUser.role);
    if (!isAdmin(currentUser)) {
      console.log('관리자 권한이 없음, 메인 페이지로 이동');
      router.push('/');
      return;
    }

    if (!canAccessAdminPage(currentUser, currentPath)) {
      console.log('페이지 접근 권한이 없음, 관리자 메인으로 이동');
      router.push('/admin');
      return;
    }

    console.log('권한 확인 완료, 관리자 페이지 로드');
    setUser(currentUser);
    setLoading(false);
  }, [router, currentPath]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <AdminSidebar
        menuItems={adminMenuItems}
        currentPath={currentPath}
        user={user}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* 헤더 */}
        <AdminHeader
          title={title}
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* 메인 콘텐츠 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 