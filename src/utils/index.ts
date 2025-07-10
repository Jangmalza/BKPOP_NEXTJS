import { EventItem } from '@/types';

// 색상 관련 유틸리티
export const getEventColor = (type: EventItem['type']) => {
  const colors = {
    discount: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      textLight: 'text-yellow-700',
    },
    promotion: {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      text: 'text-blue-800',
      textLight: 'text-blue-700',
    },
    vip: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-800',
      textLight: 'text-green-700',
    },
  };
  return colors[type];
};

export const getButtonColor = (color: string) => {
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export const getIconColor = (color: string) => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

// 레이아웃 관련 유틸리티
export const getContainerClasses = () => {
  return 'max-w-[1400px] mx-auto px-6';
};

export const getSectionClasses = (bgColor: 'white' | 'gray' = 'white') => {
  const baseClasses = 'w-full py-16 border-b';
  const bgClasses = bgColor === 'white' ? 'bg-white' : 'bg-gray-100';
  return `${baseClasses} ${bgClasses}`;
};

// 날짜 포맷팅 유틸리티
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 텍스트 자르기 유틸리티
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 클래스명 조합 유틸리티
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// 이미지 최적화 유틸리티
export const getOptimizedImageUrl = (url: string, width: number, height: number) => {
  // 실제 프로젝트에서는 이미지 최적화 서비스 사용
  return `${url}?w=${width}&h=${height}&fit=crop`;
};

// 검증 유틸리티
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string) => {
  const phoneRegex = /^[0-9-+\s()]+$/;
  return phoneRegex.test(phone);
}; 