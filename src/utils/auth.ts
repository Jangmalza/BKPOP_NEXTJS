export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
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