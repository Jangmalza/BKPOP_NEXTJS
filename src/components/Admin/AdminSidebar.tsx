/**
 * 관리자 사이드바 컴포넌트
 * @fileoverview 관리자 페이지의 사이드바 네비게이션
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, AdminMenuItem } from '@/types';
import { hasAdminPermission } from '@/utils/auth';

interface AdminSidebarProps {
  /** 메뉴 항목들 */
  menuItems: AdminMenuItem[];
  /** 현재 경로 */
  currentPath: string;
  /** 현재 사용자 */
  user: User;
  /** 사이드바 열림 상태 */
  isOpen: boolean;
  /** 사이드바 토글 함수 */
  onToggle: () => void;
}

/**
 * 관리자 사이드바 컴포넌트
 * @param props - 컴포넌트 props
 * @returns JSX.Element
 */
const AdminSidebar: React.FC<AdminSidebarProps> = ({
  menuItems,
  currentPath,
  user,
  isOpen,
  onToggle
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isActiveMenu = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const canAccessMenu = (item: AdminMenuItem) => {
    if (!item.requiredRole) return true;
    return hasAdminPermission(user, item.requiredRole);
  };

  const renderMenuItem = (item: AdminMenuItem, level: number = 0) => {
    if (!canAccessMenu(item)) return null;

    const isActive = isActiveMenu(item.path);
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="mb-1">
        <div
          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          } ${level > 0 ? 'ml-4' : ''}`}
        >
          {hasChildren ? (
            <div
              className="flex items-center w-full"
              onClick={() => toggleExpanded(item.id)}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {isOpen && (
                <>
                  <span className="flex-1">{item.title}</span>
                  <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                </>
              )}
            </div>
          ) : (
            <Link href={item.path} className="flex items-center w-full">
              <span className="text-lg mr-3">{item.icon}</span>
              {isOpen && <span className="flex-1">{item.title}</span>}
            </Link>
          )}
        </div>

        {/* 하위 메뉴 */}
        {hasChildren && isExpanded && isOpen && (
          <div className="mt-1">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className={`flex items-center ${isOpen ? '' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          {isOpen && (
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-800">관리자</h1>
              <p className="text-sm text-gray-600">BKPOP</p>
            </div>
          )}
        </div>
      </div>

      {/* 사용자 정보 */}
      <div className="p-4 border-b">
        <div className={`flex items-center ${isOpen ? '' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
              <p className="text-xs text-blue-600 capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* 메뉴 항목들 */}
      <nav className="p-4 flex-1 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* 토글 버튼 */}
      <div className="p-4 border-t">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <span className="text-lg">
            {isOpen ? '◀' : '▶'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 