/**
 * 로딩 스피너 컴포넌트
 * @fileoverview 다양한 로딩 상태를 표시하는 스피너 컴포넌트
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'gray' | 'white';
  text?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

/**
 * 로딩 스피너 컴포넌트
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text,
  overlay = false,
  fullScreen = false,
}) => {
  // 크기별 클래스
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // 색상별 클래스
  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    gray: 'border-gray-600',
    white: 'border-white',
  };

  // 텍스트 색상
  const textColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
    white: 'text-white',
  };

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          border-2 border-t-transparent 
          rounded-full 
          animate-spin
        `}
      />
      {text && (
        <p className={`mt-2 text-sm ${textColorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );

  // 풀스크린 로딩
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        {spinnerElement}
      </div>
    );
  }

  // 오버레이 로딩
  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50">
        {spinnerElement}
      </div>
    );
  }

  // 일반 로딩
  return spinnerElement;
};

/**
 * 페이지 로딩 컴포넌트
 */
export const PageLoading: React.FC<{ text?: string }> = ({ text = '로딩 중...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" color="blue" />
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  );
};

/**
 * 버튼 로딩 컴포넌트
 */
export const ButtonLoading: React.FC<{ text?: string }> = ({ text = '처리 중...' }) => {
  return (
    <div className="flex items-center justify-center">
      <LoadingSpinner size="sm" color="white" />
      <span className="ml-2">{text}</span>
    </div>
  );
};

/**
 * 카드 로딩 컴포넌트
 */
export const CardLoading: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * 테이블 로딩 컴포넌트
 */
export const TableLoading: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="animate-pulse">
        {/* 헤더 */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: cols }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* 행들 */}
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-6 py-4">
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 