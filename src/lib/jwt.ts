/**
 * JWT 토큰 관리
 * @fileoverview JWT 토큰 생성, 검증, 관리 유틸리티
 * @author Development Team
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken';
import { AppConfig } from '@/lib/config';
import { User } from '@/types';

/**
 * JWT 페이로드 인터페이스
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT 토큰 생성
 * @param user - 사용자 정보
 * @returns JWT 토큰 문자열
 */
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, AppConfig.auth.jwtSecret as any, {
    expiresIn: AppConfig.auth.jwtExpiresIn,
  } as any);
}

/**
 * JWT 토큰 검증
 * @param token - JWT 토큰
 * @returns 검증된 페이로드 또는 null
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, AppConfig.auth.jwtSecret as any) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT 토큰 검증 실패:', error);
    return null;
  }
}

/**
 * 리프레시 토큰 생성
 * @param user - 사용자 정보
 * @returns 리프레시 토큰
 */
export function generateRefreshToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, AppConfig.auth.jwtSecret as any, {
    expiresIn: '7d', // 7일
  } as any);
}

/**
 * 토큰에서 사용자 정보 추출
 * @param token - JWT 토큰
 * @returns 사용자 정보 또는 null
 */
export function getUserFromToken(token: string): Partial<User> | null {
  const payload = verifyToken(token);
  if (!payload) return null;

  return {
    id: parseInt(payload.userId) as any,
    email: payload.email,
    role: payload.role as any,
  };
}

/**
 * 토큰 만료 시간 확인
 * @param token - JWT 토큰
 * @returns 만료 시간 (Unix timestamp) 또는 null
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded.exp || null;
  } catch (error) {
    console.error('토큰 디코드 실패:', error);
    return null;
  }
}

/**
 * 토큰 만료 여부 확인
 * @param token - JWT 토큰
 * @returns 만료 여부
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  return Date.now() >= expiration * 1000;
}

/**
 * 브라우저에서 토큰 저장
 * @param token - JWT 토큰
 * @param refreshToken - 리프레시 토큰
 */
export function setTokens(token: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('access_token', token);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
}

/**
 * 브라우저에서 토큰 가져오기
 * @returns 토큰 객체
 */
export function getTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }

  return {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
  };
}

/**
 * 브라우저에서 토큰 삭제
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

/**
 * 토큰이 곧 만료되는지 확인 (5분 내)
 * @param token - JWT 토큰
 * @returns 곧 만료 여부
 */
export function isTokenExpiringSoon(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
  return fiveMinutesFromNow >= expiration * 1000;
} 