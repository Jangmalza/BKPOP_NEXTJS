import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 입력 데이터 검증
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 데이터베이스에서 사용자 찾기
    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      'SELECT id, name, email, password, phone, created_at FROM users WHERE email = ?',
      [email]
    );

    connection.release();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    const user = users[0] as any;

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: '로그인 성공',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 