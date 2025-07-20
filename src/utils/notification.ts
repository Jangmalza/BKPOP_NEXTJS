/**
 * 알림 시스템 헬퍼
 * @fileoverview 토스트 알림을 쉽게 사용할 수 있는 헬퍼 함수들
 * @author Development Team
 * @version 1.0.0
 */

import toast from 'react-hot-toast';

/**
 * 성공 알림
 */
export const notifySuccess = (message: string) => {
  toast.success(message);
};

/**
 * 에러 알림
 */
export const notifyError = (message: string) => {
  toast.error(message);
};

/**
 * 정보 알림
 */
export const notifyInfo = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  });
};

/**
 * 경고 알림
 */
export const notifyWarning = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
  });
};

/**
 * 로딩 알림
 */
export const notifyLoading = (message: string) => {
  return toast.loading(message);
};

/**
 * 로딩 알림 완료
 */
export const notifyLoadingComplete = (toastId: string, message: string, success: boolean = true) => {
  toast.dismiss(toastId);
  if (success) {
    notifySuccess(message);
  } else {
    notifyError(message);
  }
};

/**
 * 커스텀 알림
 */
export const notifyCustom = (
  message: string,
  options: {
    icon?: string;
    duration?: number;
    style?: React.CSSProperties;
    position?: 'top-center' | 'top-left' | 'top-right' | 'bottom-center' | 'bottom-left' | 'bottom-right';
  } = {}
) => {
  toast(message, {
    icon: options.icon,
    duration: options.duration,
    style: options.style,
    position: options.position,
  });
};

/**
 * 확인 알림 (Promise 기반)
 */
export const notifyPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
): Promise<T> => {
  return toast.promise(promise, messages);
};

/**
 * 모든 알림 삭제
 */
export const dismissAllNotifications = () => {
  toast.dismiss();
};

/**
 * 특정 알림 삭제
 */
export const dismissNotification = (toastId: string) => {
  toast.dismiss(toastId);
};

/**
 * API 응답 기반 알림
 */
export const notifyApiResponse = (response: { success: boolean; message: string }) => {
  if (response.success) {
    notifySuccess(response.message);
  } else {
    notifyError(response.message);
  }
};

/**
 * 에러 객체 기반 알림
 */
export const notifyErrorObject = (error: Error | unknown, defaultMessage: string = '오류가 발생했습니다.') => {
  const message = error instanceof Error ? error.message : defaultMessage;
  notifyError(message);
};

/**
 * 검증 에러 알림
 */
export const notifyValidationError = (errors: string[]) => {
  if (errors.length === 1) {
    notifyError(errors[0]);
  } else {
    notifyError(`입력 오류: ${errors.join(', ')}`);
  }
};

/**
 * 네트워크 에러 알림
 */
export const notifyNetworkError = () => {
  notifyError('네트워크 연결을 확인해주세요.');
};

/**
 * 권한 없음 알림
 */
export const notifyUnauthorized = () => {
  notifyError('권한이 없습니다. 로그인 후 다시 시도해주세요.');
};

/**
 * 서버 에러 알림
 */
export const notifyServerError = () => {
  notifyError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
};

/**
 * 복사 성공 알림
 */
export const notifyCopySuccess = (item: string = '내용') => {
  notifySuccess(`${item}이(가) 클립보드에 복사되었습니다.`);
};

/**
 * 저장 성공 알림
 */
export const notifySaveSuccess = (item: string = '내용') => {
  notifySuccess(`${item}이(가) 성공적으로 저장되었습니다.`);
};

/**
 * 삭제 성공 알림
 */
export const notifyDeleteSuccess = (item: string = '항목') => {
  notifySuccess(`${item}이(가) 성공적으로 삭제되었습니다.`);
};

/**
 * 업데이트 성공 알림
 */
export const notifyUpdateSuccess = (item: string = '정보') => {
  notifySuccess(`${item}이(가) 성공적으로 업데이트되었습니다.`);
};

/**
 * 생성 성공 알림
 */
export const notifyCreateSuccess = (item: string = '항목') => {
  notifySuccess(`${item}이(가) 성공적으로 생성되었습니다.`);
}; 