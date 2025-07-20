/**
 * Health Check API
 * @description Docker 컨테이너 헬스체크용 엔드포인트
 */

import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // 데이터베이스 연결 테스트
    const dbConnected = await testConnection();
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: dbConnected,
        status: dbConnected ? 'healthy' : 'unhealthy'
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    };

    return NextResponse.json(health, { 
      status: dbConnected ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache',
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Service temporarily unavailable'
      },
      { status: 503 }
    );
  }
} 