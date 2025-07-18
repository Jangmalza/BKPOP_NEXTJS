/**
 * 설정 페이지
 * @fileoverview 관리자 설정 - 시스템 설정, 사용자 관리, 보안 설정
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/Admin/AdminLayout';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  maxFileSize: number;
  allowedFileTypes: string[];
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireStrongPassword: boolean;
  twoFactorEnabled: boolean;
}

interface SecurityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

/**
 * 설정 탭 컴포넌트
 */
const SettingsTab: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'general', label: '일반 설정', icon: '⚙️' },
    { id: 'security', label: '보안 설정', icon: '🔒' },
    { id: 'notifications', label: '알림 설정', icon: '📧' },
    { id: 'backup', label: '백업 설정', icon: '💾' },
    { id: 'logs', label: '시스템 로그', icon: '📋' }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

/**
 * 일반 설정 탭
 */
const GeneralSettings: React.FC<{
  settings: SystemSettings;
  onUpdate: (settings: Partial<SystemSettings>) => void;
}> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    siteUrl: settings.siteUrl,
    adminEmail: settings.adminEmail,
    maintenanceMode: settings.maintenanceMode,
    registrationEnabled: settings.registrationEnabled
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            사이트 이름
          </label>
          <input
            type="text"
            value={formData.siteName}
            onChange={(e) => setFormData({...formData, siteName: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            관리자 이메일
          </label>
          <input
            type="email"
            value={formData.adminEmail}
            onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          사이트 설명
        </label>
        <textarea
          value={formData.siteDescription}
          onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          사이트 URL
        </label>
        <input
          type="url"
          value={formData.siteUrl}
          onChange={(e) => setFormData({...formData, siteUrl: e.target.value})}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={formData.maintenanceMode}
            onChange={(e) => setFormData({...formData, maintenanceMode: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
            유지보수 모드 활성화
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="registrationEnabled"
            checked={formData.registrationEnabled}
            onChange={(e) => setFormData({...formData, registrationEnabled: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="registrationEnabled" className="ml-2 block text-sm text-gray-900">
            사용자 회원가입 허용
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          저장
        </button>
      </div>
    </form>
  );
};

/**
 * 보안 설정 탭
 */
const SecuritySettings: React.FC<{
  settings: SystemSettings;
  onUpdate: (settings: Partial<SystemSettings>) => void;
}> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    sessionTimeout: settings.sessionTimeout,
    maxLoginAttempts: settings.maxLoginAttempts,
    passwordMinLength: settings.passwordMinLength,
    requireStrongPassword: settings.requireStrongPassword,
    twoFactorEnabled: settings.twoFactorEnabled
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            세션 타임아웃 (분)
          </label>
          <input
            type="number"
            value={formData.sessionTimeout}
            onChange={(e) => setFormData({...formData, sessionTimeout: parseInt(e.target.value)})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            최대 로그인 시도 횟수
          </label>
          <input
            type="number"
            value={formData.maxLoginAttempts}
            onChange={(e) => setFormData({...formData, maxLoginAttempts: parseInt(e.target.value)})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          비밀번호 최소 길이
        </label>
        <input
          type="number"
          value={formData.passwordMinLength}
          onChange={(e) => setFormData({...formData, passwordMinLength: parseInt(e.target.value)})}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireStrongPassword"
            checked={formData.requireStrongPassword}
            onChange={(e) => setFormData({...formData, requireStrongPassword: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="requireStrongPassword" className="ml-2 block text-sm text-gray-900">
            강력한 비밀번호 요구 (대소문자, 숫자, 특수문자 포함)
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="twoFactorEnabled"
            checked={formData.twoFactorEnabled}
            onChange={(e) => setFormData({...formData, twoFactorEnabled: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-900">
            2단계 인증 사용
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">보안 주의사항</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="pl-5 space-y-1">
                <li>• 세션 타임아웃을 너무 길게 설정하면 보안 위험이 증가합니다.</li>
                <li>• 강력한 비밀번호 정책을 사용하는 것을 권장합니다.</li>
                <li>• 2단계 인증을 활성화하면 계정 보안이 향상됩니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          저장
        </button>
      </div>
    </form>
  );
};

/**
 * 알림 설정 탭
 */
const NotificationSettings: React.FC<{
  settings: SystemSettings;
  onUpdate: (settings: Partial<SystemSettings>) => void;
}> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    emailNotifications: settings.emailNotifications,
    smsNotifications: settings.smsNotifications,
    orderNotifications: settings.orderNotifications
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">이메일 알림</label>
            <p className="text-sm text-gray-500">시스템 이벤트에 대한 이메일 알림을 받습니다.</p>
          </div>
          <input
            type="checkbox"
            checked={formData.emailNotifications}
            onChange={(e) => setFormData({...formData, emailNotifications: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">SMS 알림</label>
            <p className="text-sm text-gray-500">중요한 이벤트에 대한 SMS 알림을 받습니다.</p>
          </div>
          <input
            type="checkbox"
            checked={formData.smsNotifications}
            onChange={(e) => setFormData({...formData, smsNotifications: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">주문 알림</label>
            <p className="text-sm text-gray-500">새로운 주문이 들어올 때 알림을 받습니다.</p>
          </div>
          <input
            type="checkbox"
            checked={formData.orderNotifications}
            onChange={(e) => setFormData({...formData, orderNotifications: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          저장
        </button>
      </div>
    </form>
  );
};

/**
 * 백업 설정 탭
 */
const BackupSettings: React.FC<{
  settings: SystemSettings;
  onUpdate: (settings: Partial<SystemSettings>) => void;
}> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    backupEnabled: settings.backupEnabled,
    backupFrequency: settings.backupFrequency
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleManualBackup = async () => {
    if (confirm('수동 백업을 시작하시겠습니까?')) {
      try {
        // 실제 환경에서는 백업 API 호출
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('백업이 성공적으로 완료되었습니다.');
      } catch (error) {
        alert('백업 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="backupEnabled"
            checked={formData.backupEnabled}
            onChange={(e) => setFormData({...formData, backupEnabled: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="backupEnabled" className="ml-2 block text-sm text-gray-900">
            자동 백업 활성화
          </label>
        </div>

        {formData.backupEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              백업 빈도
            </label>
            <select
              value={formData.backupFrequency}
              onChange={(e) => setFormData({...formData, backupFrequency: e.target.value as 'daily' | 'weekly' | 'monthly'})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
            </select>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            저장
          </button>
        </div>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">수동 백업</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-4">
            언제든지 수동으로 백업을 생성할 수 있습니다. 백업에는 데이터베이스와 파일이 포함됩니다.
          </p>
          <button
            onClick={handleManualBackup}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            지금 백업하기
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">백업 이력</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {[
              { date: '2024-01-11 02:00:00', type: '자동', status: '성공', size: '45.2MB' },
              { date: '2024-01-10 02:00:00', type: '자동', status: '성공', size: '44.8MB' },
              { date: '2024-01-09 14:30:00', type: '수동', status: '성공', size: '44.5MB' },
              { date: '2024-01-09 02:00:00', type: '자동', status: '실패', size: '-' },
              { date: '2024-01-08 02:00:00', type: '자동', status: '성공', size: '44.1MB' }
            ].map((backup, index) => (
              <li key={index} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        backup.status === '성공' ? 'bg-green-400' : 'bg-red-400'
                      }`}></span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{backup.date}</p>
                      <p className="text-sm text-gray-500">{backup.type} 백업</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{backup.status}</p>
                    <p className="text-sm text-gray-500">{backup.size}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * 시스템 로그 탭
 */
const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLogs: SecurityLog[] = [
        {
          id: '1',
          timestamp: '2024-01-11 10:30:00',
          action: '로그인',
          user: 'admin@bkpop.com',
          ip: '192.168.1.100',
          status: 'success',
          details: '관리자 계정으로 로그인'
        },
        {
          id: '2',
          timestamp: '2024-01-11 10:25:00',
          action: '설정 변경',
          user: 'admin@bkpop.com',
          ip: '192.168.1.100',
          status: 'success',
          details: '보안 설정 업데이트'
        },
        {
          id: '3',
          timestamp: '2024-01-11 09:15:00',
          action: '로그인 시도',
          user: 'unknown@example.com',
          ip: '203.0.113.1',
          status: 'failed',
          details: '잘못된 비밀번호'
        },
        {
          id: '4',
          timestamp: '2024-01-11 08:00:00',
          action: '백업',
          user: 'system',
          ip: 'localhost',
          status: 'success',
          details: '자동 백업 완료'
        },
        {
          id: '5',
          timestamp: '2024-01-10 22:30:00',
          action: '로그인 시도',
          user: 'test@example.com',
          ip: '203.0.113.2',
          status: 'warning',
          details: '계정 잠금 해제'
        }
      ];
      
      setLogs(mockLogs);
    } catch (error) {
      console.error('로그 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">로그를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">시스템 로그</h3>
        <button
          onClick={fetchLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          새로고침
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP 주소
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    세부사항
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 설정 페이지
 */
const SettingsPage: React.FC = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'BKPOP',
    siteDescription: '전문 인쇄 서비스 플랫폼',
    siteUrl: 'https://bkpop.com',
    adminEmail: 'admin@bkpop.com',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    backupEnabled: true,
    backupFrequency: 'daily',
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'ai', 'psd'],
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    twoFactorEnabled: false
  });

  const handleUpdateSettings = async (updatedSettings: Partial<SystemSettings>) => {
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({ ...prev, ...updatedSettings }));
      alert('설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('설정 저장 실패:', error);
      alert('설정 저장에 실패했습니다.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings settings={settings} onUpdate={handleUpdateSettings} />;
      case 'security':
        return <SecuritySettings settings={settings} onUpdate={handleUpdateSettings} />;
      case 'notifications':
        return <NotificationSettings settings={settings} onUpdate={handleUpdateSettings} />;
      case 'backup':
        return <BackupSettings settings={settings} onUpdate={handleUpdateSettings} />;
      case 'logs':
        return <SystemLogs />;
      default:
        return <GeneralSettings settings={settings} onUpdate={handleUpdateSettings} />;
    }
  };

  return (
    <AdminLayout title="설정" currentPath={pathname}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
          <p className="text-sm text-gray-600 mt-1">
            시스템의 전반적인 설정을 관리합니다.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <SettingsTab activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <div className="px-6 py-6 border-t border-gray-200">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage; 