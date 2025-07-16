'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryLayout from '@/components/Layout/CategoryLayout';
import { registerUser } from '@/utils/auth';

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 실시간 유효성 검사
    if (name === 'confirmPassword' || name === 'password') {
      if (name === 'confirmPassword' && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }));
      } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    
    // 기본 유효성 검사
    const newErrors: {[key: string]: string} = {};
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요';
    }
    
    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });

        if (result.success) {
          setSuccessMessage('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
          
          // 2초 후 로그인 페이지로 이동
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        } else {
          setErrors({ email: result.message });
        }
      } catch (error) {
        console.error('회원가입 오류:', error);
        setErrors({ general: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' });
      }
    }
    
    setIsLoading(false);
  };

  return (
    <CategoryLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold text-blue-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            보광 국민인쇄몰의 회원이 되어보세요
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}
            
            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 이름 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  이름 *
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 bg-white border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 sm:text-sm"
                    placeholder="홍길동"
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  이메일 주소 *
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 bg-white border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 sm:text-sm"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* 전화번호 */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  전화번호
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 bg-white border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 sm:text-sm"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  비밀번호 *
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 bg-white border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 sm:text-sm"
                    placeholder="8자 이상 입력하세요"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  비밀번호 확인 *
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 bg-white border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 sm:text-sm"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-white border-gray-400 rounded"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                    <span className="text-red-500">*</span> 이용약관에 동의합니다{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                      (보기)
                    </a>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-sm text-red-600">{errors.agreeTerms}</p>
                )}

                <div className="flex items-center">
                  <input
                    id="agreePrivacy"
                    name="agreePrivacy"
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-white border-gray-400 rounded"
                  />
                  <label htmlFor="agreePrivacy" className="ml-2 block text-sm text-gray-900">
                    <span className="text-red-500">*</span> 개인정보처리방침에 동의합니다{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                      (보기)
                    </a>
                  </label>
                </div>
                {errors.agreePrivacy && (
                  <p className="text-sm text-red-600">{errors.agreePrivacy}</p>
                )}

                <div className="flex items-center">
                  <input
                    id="agreeMarketing"
                    name="agreeMarketing"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-white border-gray-400 rounded"
                  />
                  <label htmlFor="agreeMarketing" className="ml-2 block text-sm text-gray-900">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isLoading ? '회원가입 중...' : '회원가입'}
                </button>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  이미 계정이 있으신가요?{' '}
                  <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                    로그인
                  </a>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default SignupPage; 