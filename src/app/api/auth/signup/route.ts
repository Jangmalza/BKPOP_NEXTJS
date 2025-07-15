import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    // 입력 데이터 검증
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const connection = await pool.getConnection();
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      connection.release();
      return NextResponse.json(
        { success: false, message: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);

    // 사용자 정보 저장
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null]
    );

    connection.release();

    // 비밀번호 제외한 사용자 정보 반환
    const user = {
      id: (result as any).insertId,
      name,
      email,
      phone: phone || null,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user
    });

  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 