/**
 * 파일 업로드 컴포넌트
 * @fileoverview 드래그 앤 드롭 및 파일 선택을 지원하는 업로드 컴포넌트
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Validator } from '@/utils';
import { notifyError, notifySuccess } from '@/utils/notification';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  allowedTypes?: string[];
  maxSize?: number; // MB 단위
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface UploadedFile {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

/**
 * 파일 업로드 컴포넌트
 */
const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  allowedTypes = ['jpg', 'jpeg', 'png', 'pdf', 'ai', 'eps', 'psd'],
  maxSize = 10, // 10MB
  multiple = false,
  disabled = false,
  className = '',
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 파일 검증
   */
  const validateFile = useCallback((file: File): string | null => {
    // 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      return `파일 크기는 ${maxSize}MB 이하여야 합니다.`;
    }

    // 파일 확장자 검증
    if (!Validator.isValidFileExtension(file.name, allowedTypes)) {
      return `지원되지 않는 파일 형식입니다. (${allowedTypes.join(', ')})`;
    }

    return null;
  }, [maxSize, allowedTypes]);

  /**
   * 파일 처리
   */
  const handleFiles = useCallback(async (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => {
      const error = validateFile(file);
      let preview: string | undefined;

      // 이미지 파일인 경우 미리보기 생성
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      return {
        file,
        preview,
        status: error ? 'error' : 'pending',
        error,
      } as UploadedFile;
    });

    if (!multiple) {
      setUploadedFiles(newFiles);
    } else {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }

    // 유효한 파일들만 업로드
    const validFiles = newFiles.filter(f => f.status === 'pending');
    if (validFiles.length > 0) {
      await uploadFiles(validFiles);
    }
  }, [validateFile, multiple]);

  /**
   * 파일 업로드 실행
   */
  const uploadFiles = useCallback(async (files: UploadedFile[]) => {
    setIsUploading(true);

    for (const fileItem of files) {
      try {
        // 상태를 업로딩으로 변경
        setUploadedFiles(prev => prev.map(f => 
          f.file === fileItem.file ? { ...f, status: 'uploading' } : f
        ));

        await onUpload(fileItem.file);

        // 성공 상태로 변경
        setUploadedFiles(prev => prev.map(f => 
          f.file === fileItem.file ? { ...f, status: 'success' } : f
        ));

        notifySuccess(`${fileItem.file.name} 업로드 완료`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '업로드 실패';
        
        // 에러 상태로 변경
        setUploadedFiles(prev => prev.map(f => 
          f.file === fileItem.file ? { ...f, status: 'error', error: errorMessage } : f
        ));

        notifyError(`${fileItem.file.name}: ${errorMessage}`);
      }
    }

    setIsUploading(false);
  }, [onUpload]);

  /**
   * 드래그 이벤트 핸들러
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  /**
   * 파일 입력 핸들러
   */
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, [handleFiles]);

  /**
   * 파일 선택 버튼 클릭
   */
  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  /**
   * 파일 삭제
   */
  const handleRemoveFile = useCallback((file: File) => {
    setUploadedFiles(prev => {
      const updatedFiles = prev.filter(f => f.file !== file);
      // 미리보기 URL 정리
      const fileItem = prev.find(f => f.file === file);
      if (fileItem?.preview) {
        URL.revokeObjectURL(fileItem.preview);
      }
      return updatedFiles;
    });
  }, []);

  /**
   * 파일 상태 아이콘
   */
  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return <span className="text-yellow-500">⏳</span>;
      case 'uploading':
        return <LoadingSpinner size="sm" color="blue" />;
      case 'success':
        return <span className="text-green-500">✅</span>;
      case 'error':
        return <span className="text-red-500">❌</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`file-upload ${className}`}>
      {/* 업로드 영역 */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.map(type => `.${type}`).join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {children || (
          <div className="space-y-2">
            <div className="text-4xl">📁</div>
            <div className="text-gray-600">
              <p className="text-lg font-medium">파일을 드래그하여 업로드하거나 클릭하세요</p>
              <p className="text-sm text-gray-500">
                지원 형식: {allowedTypes.join(', ')} | 최대 크기: {maxSize}MB
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <LoadingSpinner size="lg" color="blue" text="업로드 중..." />
          </div>
        )}
      </div>

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">업로드된 파일</h4>
          <div className="space-y-2">
            {uploadedFiles.map((fileItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  {fileItem.preview && (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {fileItem.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {fileItem.error && (
                      <p className="text-xs text-red-500">{fileItem.error}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusIcon(fileItem.status)}
                  <button
                    onClick={() => handleRemoveFile(fileItem.file)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    disabled={fileItem.status === 'uploading'}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 