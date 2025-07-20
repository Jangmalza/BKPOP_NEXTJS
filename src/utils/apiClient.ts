/**
 * API 클라이언트 유틸리티
 * @fileoverview 통일된 API 호출 및 에러 처리를 위한 클라이언트
 * @author Development Team
 * @version 1.0.0
 */

import { getTokens, setTokens, clearTokens } from '@/lib/jwt';
import { notifyError, notifyNetworkError, notifyServerError, notifyUnauthorized } from '@/utils/notification';

/**
 * API 요청 옵션
 */
interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
  showError?: boolean;
  timeout?: number;
}

/**
 * API 응답 타입
 */
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}

/**
 * API 클라이언트 클래스
 */
export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string = '', defaultTimeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * 기본 요청 메서드
   */
  private async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      requireAuth = false,
      showError = true,
      timeout = this.defaultTimeout,
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // 헤더 설정
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
      };

      // 인증이 필요한 경우 토큰 추가
      if (requireAuth) {
        const { accessToken } = getTokens();
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        } else {
          throw new Error('인증 토큰이 없습니다.');
        }
      }

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 응답 상태 확인
      if (!response.ok) {
        await this.handleHttpError(response, showError);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // API 응답 형식 확인
      if (typeof data === 'object' && 'success' in data) {
        if (!data.success && showError) {
          notifyError(data.message || '요청 처리 중 오류가 발생했습니다.');
        }
        return data;
      }

      // 레거시 응답 형식 지원
      return {
        success: true,
        message: '요청이 성공했습니다.',
        data,
      };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          if (showError) notifyError('요청 시간이 초과되었습니다.');
          throw new Error('요청 시간 초과');
        }

        if (showError) {
          if (error.message.includes('Failed to fetch')) {
            notifyNetworkError();
          } else if (!error.message.includes('HTTP')) {
            notifyError(error.message);
          }
        }
      }

      throw error;
    }
  }

  /**
   * HTTP 에러 처리
   */
  private async handleHttpError(response: Response, showError: boolean) {
    const status = response.status;

    if (status === 401) {
      // 인증 실패 시 토큰 삭제
      clearTokens();
      if (showError) notifyUnauthorized();
      // 로그인 페이지로 리디렉션
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    } else if (status === 403) {
      if (showError) notifyError('접근 권한이 없습니다.');
    } else if (status === 404) {
      if (showError) notifyError('요청한 리소스를 찾을 수 없습니다.');
    } else if (status === 422) {
      // 검증 에러 처리
      try {
        const errorData = await response.json();
        if (showError && errorData.message) {
          notifyError(errorData.message);
        }
      } catch {
        if (showError) notifyError('입력 값을 확인해주세요.');
      }
    } else if (status >= 500) {
      if (showError) notifyServerError();
    } else {
      try {
        const errorData = await response.json();
        if (showError && errorData.message) {
          notifyError(errorData.message);
        }
      } catch {
        if (showError) notifyError(`요청 실패 (${status})`);
      }
    }
  }

  /**
   * GET 요청
   */
  public get<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST 요청
   */
  public post<T = any>(
    endpoint: string,
    data?: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT 요청
   */
  public put<T = any>(
    endpoint: string,
    data?: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH 요청
   */
  public patch<T = any>(
    endpoint: string,
    data?: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE 요청
   */
  public delete<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * 파일 업로드 요청
   */
  public uploadFile<T = any>(
    endpoint: string,
    file: File,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Content-Type을 제거하여 브라우저가 자동으로 설정하도록 함
        ...options.headers,
      },
    });
  }
}

/**
 * 기본 API 클라이언트 인스턴스
 */
export const apiClient = new ApiClient();

/**
 * 관리자 API 클라이언트 인스턴스
 */
export const adminApiClient = new ApiClient('', 15000); // 15초 타임아웃

/**
 * 헬퍼 함수들
 */
export const api = {
  // 사용자 API
  auth: {
    login: (data: { email: string; password: string }) =>
      apiClient.post('/api/auth/login', data),
    signup: (data: { name: string; email: string; password: string; phone?: string }) =>
      apiClient.post('/api/auth/signup', data),
    logout: () => apiClient.post('/api/auth/logout'),
  },

  // 관리자 API
  admin: {
    users: {
      list: (params?: any) => adminApiClient.get('/api/admin/users', { ...params, requireAuth: true }),
      create: (data: any) => adminApiClient.post('/api/admin/users', data, { requireAuth: true }),
      update: (data: any) => adminApiClient.put('/api/admin/users', data, { requireAuth: true }),
      delete: (userId: string) => adminApiClient.delete(`/api/admin/users?userId=${userId}`, { requireAuth: true }),
      changeStatus: (data: any) => adminApiClient.patch('/api/admin/users', data, { requireAuth: true }),
    },
    stats: () => adminApiClient.get('/api/admin/stats', { requireAuth: true }),
  },

  // 장바구니 API
  cart: {
    list: () => apiClient.get('/api/cart', { requireAuth: true }),
    add: (data: any) => apiClient.post('/api/cart', data, { requireAuth: true }),
    update: (id: string, data: any) => apiClient.put(`/api/cart/${id}`, data, { requireAuth: true }),
    remove: (id: string) => apiClient.delete(`/api/cart/${id}`, { requireAuth: true }),
  },
}; 