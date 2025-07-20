/**
 * 공통 유틸리티 함수들
 * @fileoverview 애플리케이션에서 사용하는 공통 유틸리티 함수 모음
 * @author Development Team
 * @version 1.0.0
 */

import { ApiResponse } from '@/types';

/**
 * 커스텀 에러 클래스
 * @class AppError
 * @extends Error
 * @description 애플리케이션 전용 에러 클래스
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'UNKNOWN_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    
    // 스택 트레이스에서 생성자 제거
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 에러 코드 상수
 * @const ERROR_CODES
 * @description 애플리케이션에서 사용하는 에러 코드 정의
 */
export const ERROR_CODES = {
  // 일반 에러
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  
  // 데이터베이스 관련
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
  DATABASE_QUERY_ERROR: 'DATABASE_QUERY_ERROR',
  
  // 장바구니 관련
  CART_ITEM_NOT_FOUND: 'CART_ITEM_NOT_FOUND',
  CART_INVALID_QUANTITY: 'CART_INVALID_QUANTITY',
  CART_EMPTY: 'CART_EMPTY',
  
  // 사용자 관련
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // 제품 관련
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  PRODUCT_OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK',
} as const;

/**
 * API 응답 생성 유틸리티
 * @class ApiResponseBuilder
 * @description 일관된 API 응답 형식을 위한 빌더 클래스
 */
export class ApiResponseBuilder {
  /**
   * 성공 응답 생성
   * @param data - 응답 데이터
   * @param message - 성공 메시지
   * @returns 성공 응답 객체
   */
  static success<T>(data?: T, message: string = '요청이 성공했습니다.'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  /**
   * 에러 응답 생성
   * @param message - 에러 메시지
   * @param errorCode - 에러 코드
   * @param data - 추가 데이터
   * @returns 에러 응답 객체
   */
  static error<T>(
    message: string = '요청 처리 중 오류가 발생했습니다.',
    errorCode: string = ERROR_CODES.UNKNOWN_ERROR,
    data?: T
  ): ApiResponse<T> {
    return {
      success: false,
      message,
      errorCode,
      data,
    };
  }
}

/**
 * 에러 핸들러 유틸리티
 * @class ErrorHandler
 * @description 에러 처리를 위한 유틸리티 클래스
 */
export class ErrorHandler {
  /**
   * 에러 로그 출력
   * @param error - 에러 객체
   * @param context - 에러 발생 컨텍스트
   */
  static log(error: Error, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    
    console.error(`${timestamp} ${contextStr} Error:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        statusCode: error.statusCode,
        errorCode: error.errorCode,
        isOperational: error.isOperational,
      }),
    });
  }

  /**
   * 에러를 API 응답으로 변환
   * @param error - 에러 객체
   * @returns API 응답 객체
   */
  static toApiResponse(error: Error): ApiResponse {
    if (error instanceof AppError) {
      return ApiResponseBuilder.error(error.message, error.errorCode);
    }
    
    // 알 수 없는 에러는 일반적인 메시지로 처리
    return ApiResponseBuilder.error(
      '서버 오류가 발생했습니다.',
      ERROR_CODES.UNKNOWN_ERROR
    );
  }
}

/**
 * 데이터 유효성 검사 유틸리티
 * @class Validator
 * @description 공통 데이터 유효성 검사 함수들
 */
export class Validator {
  /**
   * 이메일 유효성 검사
   * @param email - 검사할 이메일
   * @returns 유효성 검사 결과
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 전화번호 유효성 검사
   * @param phone - 검사할 전화번호
   * @returns 유효성 검사 결과
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  /**
   * 비밀번호 유효성 검사
   * @param password - 검사할 비밀번호
   * @returns 유효성 검사 결과
   */
  static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  /**
   * 강력한 비밀번호 유효성 검사
   * @param password - 검사할 비밀번호
   * @returns 유효성 검사 결과
   */
  static isStrongPassword(password: string): boolean {
    // 최소 8자, 대문자, 소문자, 숫자, 특수문자 포함
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  /**
   * SQL 인젝션 방지를 위한 입력 검증
   * @param input - 검사할 입력값
   * @returns 안전한 입력값 여부
   */
  static isSafeInput(input: string): boolean {
    const sqlInjectionPatterns = [
      /('|(\\'))|(--)|(-\*)|(\/\*)/,
      /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
      /(script|javascript|vbscript|onload|onerror|onclick)/i,
    ];
    
    return !sqlInjectionPatterns.some(pattern => pattern.test(input));
  }

  /**
   * XSS 방지를 위한 HTML 이스케이프
   * @param input - 이스케이프할 문자열
   * @returns 이스케이프된 문자열
   */
  static escapeHtml(input: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    
    return input.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
  }

  /**
   * 파일 확장자 검증
   * @param filename - 파일명
   * @param allowedExtensions - 허용된 확장자 목록
   * @returns 유효한 확장자 여부
   */
  static isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedExtensions.includes(extension) : false;
  }

  /**
   * 이메일 도메인 검증
   * @param email - 검사할 이메일
   * @param allowedDomains - 허용된 도메인 목록 (선택사항)
   * @returns 유효한 도메인 여부
   */
  static isValidEmailDomain(email: string, allowedDomains?: string[]): boolean {
    if (!this.isValidEmail(email)) return false;
    
    if (!allowedDomains) return true;
    
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  }

  /**
   * 양의 정수 유효성 검사
   * @param value - 검사할 값
   * @returns 유효성 검사 결과
   */
  static isPositiveInteger(value: any): boolean {
    return Number.isInteger(value) && value > 0;
  }

  /**
   * 필수 필드 검사
   * @param fields - 검사할 필드들
   * @returns 누락된 필드 목록
   */
  static validateRequiredFields(fields: Record<string, any>): string[] {
    const missingFields: string[] = [];
    
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null || value === '') {
        missingFields.push(key);
      }
    }
    
    return missingFields;
  }
}

/**
 * 포맷팅 유틸리티
 * @class Formatter
 * @description 데이터 포맷팅을 위한 유틸리티 클래스
 */
export class Formatter {
  /**
   * 가격 포맷팅
   * @param price - 가격 (숫자)
   * @returns 포맷된 가격 문자열
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  }

  /**
   * 날짜 포맷팅
   * @param date - 날짜 문자열 또는 Date 객체
   * @returns 포맷된 날짜 문자열
   */
  static formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  /**
   * 날짜시간 포맷팅
   * @param date - 날짜 문자열 또는 Date 객체
   * @returns 포맷된 날짜시간 문자열
   */
  static formatDateTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * 가격 문자열을 숫자로 변환
   * @param priceString - 가격 문자열 (예: "10,000원")
   * @returns 숫자 가격
   */
  static parsePrice(priceString: string): number {
    return parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
  }
}

/**
 * 디바운싱 유틸리티
 * @param func - 디바운싱할 함수
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운싱된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * 스로틀링 유틸리티
 * @param func - 스로틀링할 함수
 * @param delay - 지연 시간 (밀리초)
 * @returns 스로틀링된 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, delay);
    }
  };
}

/**
 * 로컬 스토리지 유틸리티
 * @class LocalStorage
 * @description 로컬 스토리지 처리를 위한 유틸리티 클래스
 */
export class LocalStorage {
  /**
   * 아이템 저장
   * @param key - 키
   * @param value - 값
   */
  static setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('로컬 스토리지 저장 실패:', error);
    }
  }

  /**
   * 아이템 조회
   * @param key - 키
   * @returns 저장된 값 또는 null
   */
  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('로컬 스토리지 조회 실패:', error);
      return null;
    }
  }

  /**
   * 아이템 삭제
   * @param key - 키
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('로컬 스토리지 삭제 실패:', error);
    }
  }

  /**
   * 모든 아이템 삭제
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('로컬 스토리지 초기화 실패:', error);
    }
  }
}

/**
 * 이벤트 색상 가져오기
 * @param eventType - 이벤트 타입
 * @returns 색상 클래스 객체
 */
export function getEventColor(eventType: string): {
  bg: string;
  text: string;
  textLight: string;
  border: string;
} {
  switch (eventType) {
    case 'important':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        textLight: 'text-red-600',
        border: 'border-red-500'
      };
    case 'notice':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        textLight: 'text-blue-600',
        border: 'border-blue-500'
      };
    case 'event':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        textLight: 'text-green-600',
        border: 'border-green-500'
      };
    case 'promotion':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        textLight: 'text-yellow-600',
        border: 'border-yellow-500'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        textLight: 'text-gray-600',
        border: 'border-gray-500'
      };
  }
}

/**
 * 컨테이너 클래스 가져오기
 * @param variant - 컨테이너 변형
 * @returns 클래스 문자열
 */
export function getContainerClasses(variant: string = 'default'): string {
  const baseClasses = 'mx-auto px-4 sm:px-6 lg:px-8';
  
  switch (variant) {
    case 'wide':
      return `${baseClasses} max-w-7xl`;
    case 'narrow':
      return `${baseClasses} max-w-4xl`;
    case 'full':
      return `${baseClasses} max-w-full`;
    default:
      return `${baseClasses} max-w-6xl`;
  }
} 