/**
 * 커스텀 훅 모음
 * @fileoverview 재사용 가능한 커스텀 훅들을 모아둔 파일
 * @author Development Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { debounce, throttle } from '@/utils';

/**
 * 로컬 스토리지 훅
 * @param key - 스토리지 키
 * @param initialValue - 초기값
 * @returns [값, 설정함수, 삭제함수]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * 디바운스 훅
 * @param value - 디바운스할 값
 * @param delay - 지연 시간
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 이전 값 추적 훅
 * @param value - 추적할 값
 * @returns 이전 값
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * 마운트 상태 훅
 * @returns 마운트 여부
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}

/**
 * 비동기 작업 상태 훅
 * @returns [loading, error, executeAsync]
 */
export function useAsyncState(): [
  boolean,
  string | null,
  <T>(asyncFn: () => Promise<T>) => Promise<T | null>
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  const executeAsync = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFn();
      
      if (isMounted) {
        setLoading(false);
      }
      
      return result;
    } catch (err) {
      if (isMounted) {
        setLoading(false);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      }
      return null;
    }
  }, [isMounted]);

  return [loading, error, executeAsync];
}

/**
 * 토글 훅
 * @param initialValue - 초기값
 * @returns [값, 토글함수, 설정함수]
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setToggle = useCallback((value: boolean) => {
    setValue(value);
  }, []);

  return [value, toggle, setToggle];
}

/**
 * 윈도우 크기 훅
 * @returns 윈도우 크기 정보
 */
export function useWindowSize(): { width: number; height: number; isMobile: boolean } {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
    isMobile: false
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
        isMobile: width < 768
      });
    }

    // 초기 크기 설정
    handleResize();

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * 스크롤 위치 훅
 * @returns 스크롤 위치 정보
 */
export function useScrollPosition(): { x: number; y: number; isScrollingUp: boolean } {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
    isScrollingUp: false
  });

  const previousY = usePrevious(scrollPosition.y);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentY = window.scrollY;
      
      setScrollPosition(prev => ({
        x: window.scrollX,
        y: currentY,
        isScrollingUp: currentY < prev.y
      }));
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

/**
 * 클릭 외부 감지 훅
 * @param handler - 외부 클릭 시 실행할 함수
 * @returns ref 객체
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handler]);

  return ref;
}

/**
 * 인터섹션 옵저버 훅
 * @param options - 옵저버 옵션
 * @returns [ref, isIntersecting]
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
): [React.RefObject<T | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
}

/**
 * 키보드 이벤트 훅
 * @param key - 감지할 키
 * @param handler - 키 입력 시 실행할 함수
 * @param options - 옵션
 */
export function useKeyPress(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: { ctrl?: boolean; alt?: boolean; shift?: boolean } = {}
): void {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === key) {
        const { ctrl = false, alt = false, shift = false } = options;
        
        if (
          event.ctrlKey === ctrl &&
          event.altKey === alt &&
          event.shiftKey === shift
        ) {
          handler(event);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, handler, options]);
}

/**
 * 폼 상태 관리 훅
 * @param initialValues - 초기값
 * @returns 폼 상태 관리 객체
 */
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // 값이 변경되면 해당 필드의 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isFieldTouched = useCallback((name: keyof T) => {
    return touched[name] || false;
  }, [touched]);

  const isFieldError = useCallback((name: keyof T) => {
    return errors[name] && touched[name];
  }, [errors, touched]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldError,
    resetForm,
    isFieldTouched,
    isFieldError
  };
}

/**
 * 페이지네이션 훅
 * @param totalItems - 전체 아이템 수
 * @param itemsPerPage - 페이지당 아이템 수
 * @returns 페이지네이션 상태 관리 객체
 */
export function usePagination(totalItems: number, itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const canGoNext = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const canGoPrevious = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious
  };
} 