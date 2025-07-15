'use client';
import React, { useState } from 'react';
import { initializeDatabase } from '@/utils/auth';

const InitDBPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInitDB = async () => {
    setIsLoading(true);
    setMessage('');
    setDetails('');
    
    try {
      const result = await initializeDatabase();
      
      if (result.success) {
        setSuccess(true);
        setMessage(result.message);
        setDetails(result.details || '');
      } else {
        setSuccess(false);
        setMessage(result.message);
        setDetails(result.details || '');
      }
    } catch (error) {
      setSuccess(false);
      setMessage('데이터베이스 초기화 중 오류가 발생했습니다.');
      setDetails(error instanceof Error ? error.message : '');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-blue-900">
          데이터베이스 초기화
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          MySQL 데이터베이스를 초기화하여 사용자 테이블을 생성합니다.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {message && (
            <div className={`mb-4 p-4 rounded-md ${
              success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-medium ${success ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </p>
              {details && (
                <div className="mt-2">
                  <p className={`text-xs ${success ? 'text-green-700' : 'text-red-700'}`}>
                    {details.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                데이터베이스 설정 확인
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>MySQL 서버 설정:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 호스트: localhost</li>
                  <li>• 사용자: root</li>
                  <li>• 데이터베이스: bkpop_db</li>
                  <li>• 포트: 3306</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md mt-4">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  연결 문제 해결 방법:
                </p>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal ml-4">
                  <li>MySQL 서버가 실행 중인지 확인: <code className="bg-yellow-100 px-1 rounded">brew services list | grep mysql</code></li>
                  <li>MySQL 시작: <code className="bg-yellow-100 px-1 rounded">brew services start mysql</code></li>
                  <li>환경 변수 파일 (.env.local) 설정 확인</li>
                  <li>초기화 버튼 클릭 시 자동으로 데이터베이스 및 사용자 생성</li>
                </ol>
              </div>
            </div>

            <div>
              <button
                onClick={handleInitDB}
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? '초기화 중...' : '데이터베이스 초기화'}
              </button>
            </div>

            <div className="text-center">
              <a 
                href="/"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                메인 페이지로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitDBPage; 