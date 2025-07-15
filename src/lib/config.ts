/**
 * 애플리케이션 설정 관리
 * @fileoverview 환경 변수와 설정 상수를 관리하는 중앙 집중식 설정 파일
 * @author Development Team
 * @version 1.0.0
 */

import { DatabaseConfig } from '@/types';

/**
 * 환경 변수 검증 유틸리티
 * @param key - 환경 변수 키
 * @param defaultValue - 기본값
 * @param required - 필수 여부
 * @returns 환경 변수 값 또는 기본값
 */
function getEnvVar(key: string, defaultValue?: string, required: boolean = false): string {
  const value = process.env[key];
  
  if (required && !value) {
    throw new Error(`필수 환경 변수가 설정되지 않았습니다: ${key}`);
  }
  
  return value || defaultValue || '';
}

/**
 * 숫자 환경 변수 가져오기
 * @param key - 환경 변수 키
 * @param defaultValue - 기본값
 * @param required - 필수 여부
 * @returns 숫자 값
 */
function getEnvNumber(key: string, defaultValue?: number, required: boolean = false): number {
  const value = getEnvVar(key, defaultValue?.toString(), required);
  const parsed = parseInt(value);
  
  if (isNaN(parsed)) {
    if (required) {
      throw new Error(`환경 변수 ${key}는 유효한 숫자여야 합니다.`);
    }
    return defaultValue || 0;
  }
  
  return parsed;
}

/**
 * 불린 환경 변수 가져오기
 * @param key - 환경 변수 키
 * @param defaultValue - 기본값
 * @returns 불린 값
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key);
  return value === 'true' || value === '1';
}

/**
 * 애플리케이션 설정
 * @const AppConfig
 * @description 애플리케이션 전체 설정 객체
 */
export const AppConfig = {
  // 애플리케이션 기본 설정
  app: {
    name: getEnvVar('APP_NAME', 'BKPOP'),
    version: getEnvVar('APP_VERSION', '1.0.0'),
    url: getEnvVar('APP_URL', 'http://localhost:3000'),
    env: getEnvVar('NODE_ENV', 'development'),
    port: getEnvNumber('PORT', 3000),
  },

  // 데이터베이스 설정
  database: {
    host: getEnvVar('DB_HOST', 'localhost'),
    user: getEnvVar('DB_USER', 'root'),
    password: getEnvVar('DB_PASSWORD', ''),
    database: getEnvVar('DB_NAME', 'bkpop_db'),
    port: getEnvNumber('DB_PORT', 3306),
    waitForConnections: getEnvBoolean('DB_WAIT_FOR_CONNECTIONS', true),
    connectionLimit: getEnvNumber('DB_CONNECTION_LIMIT', 10),
    queueLimit: getEnvNumber('DB_QUEUE_LIMIT', 0),
    acquireTimeout: getEnvNumber('DB_ACQUIRE_TIMEOUT', 60000),
    timeout: getEnvNumber('DB_TIMEOUT', 60000),
    reconnect: getEnvBoolean('DB_RECONNECT', true),
    multipleStatements: getEnvBoolean('DB_MULTIPLE_STATEMENTS', true),
    charset: getEnvVar('DB_CHARSET', 'utf8mb4'),
  } as DatabaseConfig,

  // 인증 설정
  auth: {
    jwtSecret: getEnvVar('JWT_SECRET', 'dev-secret-key-change-in-production'),
    jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
    bcryptRounds: getEnvNumber('BCRYPT_ROUNDS', 12),
    sessionMaxAge: getEnvNumber('SESSION_MAX_AGE', 24 * 60 * 60 * 1000), // 24시간
  },

  // 보안 설정
  security: {
    corsOrigins: getEnvVar('CORS_ORIGINS', '*').split(','),
    rateLimitMax: getEnvNumber('RATE_LIMIT_MAX', 100),
    rateLimitWindow: getEnvNumber('RATE_LIMIT_WINDOW', 15 * 60 * 1000), // 15분
    enableCsrf: getEnvBoolean('ENABLE_CSRF', true),
    enableHelmet: getEnvBoolean('ENABLE_HELMET', true),
  },

  // 로깅 설정
  logging: {
    level: getEnvVar('LOG_LEVEL', 'info'),
    format: getEnvVar('LOG_FORMAT', 'combined'),
    enableConsole: getEnvBoolean('LOG_ENABLE_CONSOLE', true),
    enableFile: getEnvBoolean('LOG_ENABLE_FILE', false),
    filePath: getEnvVar('LOG_FILE_PATH', './logs/app.log'),
    maxFileSize: getEnvNumber('LOG_MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB
    maxFiles: getEnvNumber('LOG_MAX_FILES', 5),
  },

  // 파일 업로드 설정
  upload: {
    maxFileSize: getEnvNumber('UPLOAD_MAX_FILE_SIZE', 5 * 1024 * 1024), // 5MB
    allowedMimeTypes: getEnvVar('UPLOAD_ALLOWED_MIME_TYPES', 'image/jpeg,image/png,image/gif,image/webp').split(','),
    uploadDir: getEnvVar('UPLOAD_DIR', './public/uploads'),
  },

  // 캐시 설정
  cache: {
    enabled: getEnvBoolean('CACHE_ENABLED', true),
    ttl: getEnvNumber('CACHE_TTL', 60 * 60 * 1000), // 1시간
    maxSize: getEnvNumber('CACHE_MAX_SIZE', 100),
  },

  // 이메일 설정
  email: {
    host: getEnvVar('EMAIL_HOST', 'smtp.gmail.com'),
    port: getEnvNumber('EMAIL_PORT', 587),
    secure: getEnvBoolean('EMAIL_SECURE', false),
    user: getEnvVar('EMAIL_USER'),
    password: getEnvVar('EMAIL_PASSWORD'),
    from: getEnvVar('EMAIL_FROM', 'noreply@bkpop.com'),
  },

  // 페이지네이션 설정
  pagination: {
    defaultLimit: getEnvNumber('PAGINATION_DEFAULT_LIMIT', 20),
    maxLimit: getEnvNumber('PAGINATION_MAX_LIMIT', 100),
  },

  // 개발 모드 설정
  development: {
    enableDebug: getEnvBoolean('DEBUG_ENABLED', false),
    enableMockData: getEnvBoolean('MOCK_DATA_ENABLED', false),
    enableHotReload: getEnvBoolean('HOT_RELOAD_ENABLED', true),
  },
};

/**
 * 환경별 설정 검증
 * @description 환경에 따른 필수 설정 검증
 */
export function validateConfig(): void {
  const { app, database, auth } = AppConfig;

  // 프로덕션 환경에서의 필수 설정 검증
  if (app.env === 'production') {
    const requiredInProduction = [
      { key: 'JWT_SECRET', value: auth.jwtSecret },
      { key: 'DB_PASSWORD', value: database.password },
    ];

    for (const { key, value } of requiredInProduction) {
      if (!value || value === 'dev-secret-key-change-in-production') {
        throw new Error(`프로덕션 환경에서는 ${key}가 반드시 설정되어야 합니다.`);
      }
    }
  }

  // 데이터베이스 설정 검증
  if (!database.host || !database.user || !database.database) {
    throw new Error('데이터베이스 기본 설정(host, user, database)이 필요합니다.');
  }

  // 포트 범위 검증
  if (database.port < 1 || database.port > 65535) {
    throw new Error('데이터베이스 포트는 1-65535 범위여야 합니다.');
  }

  if (app.port < 1 || app.port > 65535) {
    throw new Error('애플리케이션 포트는 1-65535 범위여야 합니다.');
  }
}

/**
 * 설정 정보 출력 (민감한 정보 제외)
 * @description 현재 설정 상태를 로그로 출력
 */
export function logConfig(): void {
  const safeConfig = {
    app: AppConfig.app,
    database: {
      host: AppConfig.database.host,
      user: AppConfig.database.user,
      database: AppConfig.database.database,
      port: AppConfig.database.port,
      connectionLimit: AppConfig.database.connectionLimit,
    },
    auth: {
      jwtExpiresIn: AppConfig.auth.jwtExpiresIn,
      bcryptRounds: AppConfig.auth.bcryptRounds,
      sessionMaxAge: AppConfig.auth.sessionMaxAge,
    },
    logging: AppConfig.logging,
    pagination: AppConfig.pagination,
  };

  console.log('🔧 애플리케이션 설정:', JSON.stringify(safeConfig, null, 2));
}

/**
 * 데이터베이스 설정 가져오기
 * @returns 데이터베이스 설정 객체
 */
export function getDatabaseConfig(): DatabaseConfig {
  return AppConfig.database;
}

/**
 * 개발 모드 여부 확인
 * @returns 개발 모드 여부
 */
export function isDevelopment(): boolean {
  return AppConfig.app.env === 'development';
}

/**
 * 프로덕션 모드 여부 확인
 * @returns 프로덕션 모드 여부
 */
export function isProduction(): boolean {
  return AppConfig.app.env === 'production';
}

/**
 * 테스트 모드 여부 확인
 * @returns 테스트 모드 여부
 */
export function isTest(): boolean {
  return AppConfig.app.env === 'test';
}

// 설정 초기화 및 검증
try {
  validateConfig();
  if (isDevelopment()) {
    logConfig();
  }
} catch (error) {
  console.error('❌ 설정 검증 실패:', error);
  process.exit(1);
} 