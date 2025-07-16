import { UserRole, AdminUser } from '@/types';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// 사용자 등록 (API 호출)
export const registerUser = async (userData: SignupData): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('회원가입 오류:', error);
    return { success: false, message: '서버 오류가 발생했습니다.' };
  }
};

// 사용자 로그인 (API 호출)
export const loginUser = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, message: '서버 오류가 발생했습니다.' };
  }
};

// 데이터베이스 초기화 (API 호출)
export const initializeDatabase = async (): Promise<{ success: boolean; message: string; details?: string }> => {
  try {
    const response = await fetch('/api/init-db', {
      method: 'POST',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error);
    return { 
      success: false, 
      message: '데이터베이스 초기화 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : ''
    };
  }
};

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : null;
};

// 현재 로그인한 사용자 정보 저장
export const setCurrentUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// 로그아웃
export const logoutUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUser');
};

/**
 * 관리자 권한 확인
 * @param user - 확인할 사용자 객체
 * @param requiredRole - 필요한 최소 권한 레벨
 * @returns 권한 여부
 */
export const hasAdminPermission = (user: User | null, requiredRole: UserRole = 'admin'): boolean => {
  if (!user) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    'user': 0,
    'admin': 1,
    'super_admin': 2
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

/**
 * 관리자 사용자인지 확인
 * @param user - 확인할 사용자 객체
 * @returns 관리자 여부
 */
export const isAdmin = (user: User | null): user is AdminUser => {
  return user !== null && (user.role === 'admin' || user.role === 'super_admin');
};

/**
 * 슈퍼 관리자인지 확인
 * @param user - 확인할 사용자 객체
 * @returns 슈퍼 관리자 여부
 */
export const isSuperAdmin = (user: User | null): boolean => {
  return user !== null && user.role === 'super_admin';
};

/**
 * 관리자 페이지 접근 권한 확인
 * @param user - 확인할 사용자 객체
 * @param path - 접근하려는 경로
 * @returns 접근 허용 여부
 */
export const canAccessAdminPage = (user: User | null, path: string): boolean => {
  if (!isAdmin(user)) return false;
  
  // 슈퍼 관리자는 모든 페이지 접근 가능
  if (isSuperAdmin(user)) return true;
  
  // 일반 관리자는 특정 페이지만 접근 가능
  const adminOnlyPaths = ['/admin/users', '/admin/settings', '/admin/system'];
  const isAdminOnlyPath = adminOnlyPaths.some(adminPath => path.startsWith(adminPath));
  
  return !isAdminOnlyPath;
};

/**
 * 관리자 인증 미들웨어
 * @param requiredRole - 필요한 최소 권한 레벨
 * @returns 미들웨어 함수
 */
export const requireAdminAuth = (requiredRole: UserRole = 'admin') => {
  return (user: User | null): { authorized: boolean; message?: string } => {
    if (!user) {
      return { authorized: false, message: '로그인이 필요합니다.' };
    }
    
    if (!hasAdminPermission(user, requiredRole)) {
      return { authorized: false, message: '관리자 권한이 필요합니다.' };
    }
    
    return { authorized: true };
  };
}; 