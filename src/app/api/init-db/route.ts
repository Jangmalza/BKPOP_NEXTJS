

import { NextResponse } from 'next/server';
import { initDatabase, testConnection, connectToSystem } from '@/lib/database';

// POST 요청 처리 (데이터베이스 초기화)
export async function POST() {
  try {
    console.log('데이터베이스 초기화 시작...');
    
    // 1. 먼저 연결 테스트
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.log('기본 연결 실패, 시스템 데이터베이스로 연결 시도...');
      
      // 2. 시스템 데이터베이스에 연결하여 데이터베이스 및 사용자 생성
      const systemConnected = await connectToSystem();
      
      if (!systemConnected) {
        return NextResponse.json({
          success: false,
          message: 'MySQL 서버에 연결할 수 없습니다. MySQL 서버가 실행 중인지 확인해주세요.',
          details: '터미널에서 "brew services start mysql" 명령을 실행해보세요.'
        }, { status: 500 });
      }
      
      console.log('시스템 데이터베이스 연결 성공');
    }
    
    // 3. 데이터베이스 초기화 실행
    await initDatabase();
    
    // 4. 최종 연결 확인
    const finalTest = await testConnection();
    
    if (finalTest) {
      return NextResponse.json({
        success: true,
        message: 'MySQL 데이터베이스 초기화가 완료되었습니다!',
        details: '• 데이터베이스 "bkpop_db" 생성 완료\n• users 테이블 생성 완료\n• 연결 테스트 통과'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '데이터베이스 초기화는 완료되었지만 연결 테스트에 실패했습니다.',
        details: '수동으로 MySQL 설정을 확인해주세요.'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error);
    
    let errorMessage = '데이터베이스 초기화 중 오류가 발생했습니다.';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // 일반적인 MySQL 오류 처리
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'MySQL 서버에 연결할 수 없습니다.';
        errorDetails = 'MySQL 서버가 실행 중인지 확인하고 "brew services start mysql" 명령을 실행해주세요.';
      } else if (error.message.includes('Access denied')) {
        errorMessage = 'MySQL 접근 권한이 없습니다.';
        errorDetails = 'MySQL 사용자명과 비밀번호를 확인해주세요. (.env.local 파일 확인)';
      } else if (error.message.includes('Unknown database')) {
        errorMessage = '데이터베이스를 찾을 수 없습니다.';
        errorDetails = '데이터베이스가 자동으로 생성됩니다. 다시 시도해주세요.';
      }
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
      details: errorDetails
    }, { status: 500 });
  }
}

// GET 요청 처리 (연결 상태 확인)
export async function GET() {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'MySQL 데이터베이스 연결이 정상입니다.',
        details: 'HOST: localhost, DATABASE: bkpop_db, PORT: 3306'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'MySQL 데이터베이스 연결에 실패했습니다.',
        details: 'MySQL 서버가 실행 중인지 확인해주세요.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('연결 테스트 오류:', error);
    
    return NextResponse.json({
      success: false,
      message: '연결 테스트 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : ''
    }, { status: 500 });
  }
} 