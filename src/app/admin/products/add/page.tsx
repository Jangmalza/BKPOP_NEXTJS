/**
 * 상품 추가 페이지
 * @fileoverview 관리자 상품 추가 - 새로운 상품 등록 폼
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminLayout from '@/components/Admin/AdminLayout';

interface ProductFormData {
  title: string;
  description: string;
  category: string;
  size: string;
  price: string;
  quantity: string;
  status: 'active' | 'inactive';
  image: string;
}

/**
 * 상품 추가 페이지
 */
const AddProductPage: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    category: '',
    size: '',
    price: '',
    quantity: '',
    status: 'active',
    image: ''
  });
  
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'commercial-print', label: '상업인쇄' },
    { value: 'digital-print', label: '디지털인쇄' },
    { value: 'large-format', label: '대형인쇄' },
    { value: 'package', label: '패키지' },
    { value: 'planning', label: '기획' },
    { value: 'promotional', label: '판촉물' },
    { value: 'self-design', label: '셀프디자인' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    if (errors[name as keyof ProductFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = '상품명을 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    if (!formData.size.trim()) {
      newErrors.size = '크기를 입력해주세요.';
    }

    if (!formData.price.trim()) {
      newErrors.price = '가격을 입력해주세요.';
    } else if (!/^\d+$/.test(formData.price.replace(/,/g, ''))) {
      newErrors.price = '유효한 가격을 입력해주세요.';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = '재고를 입력해주세요.';
    } else if (!/^\d+$/.test(formData.quantity)) {
      newErrors.quantity = '유효한 재고 수량을 입력해주세요.';
    }

    if (!formData.description.trim()) {
      newErrors.description = '상품 설명을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 임시 로직
      console.log('상품 추가:', formData);
      
      alert('상품이 성공적으로 추가되었습니다.');
      router.push('/admin/products');
      
    } catch (error) {
      console.error('상품 추가 실패:', error);
      alert('상품 추가에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?')) {
      router.push('/admin/products');
    }
  };

  return (
    <AdminLayout title="상품 추가" currentPath={pathname}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">새 상품 등록</h3>
            <p className="text-sm text-gray-500 mt-1">새로운 상품을 등록합니다.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 상품명 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                상품명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="상품명을 입력하세요"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* 카테고리 */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">카테고리를 선택하세요</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* 크기 */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                크기 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.size ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="예: 90x50mm"
              />
              {errors.size && (
                <p className="mt-1 text-sm text-red-600">{errors.size}</p>
              )}
            </div>

            {/* 가격 */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                가격 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="10000"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">원</span>
                </div>
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* 재고 */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                재고 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.quantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="100"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">매</span>
                </div>
              </div>
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            {/* 상태 */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                상태
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>

            {/* 이미지 URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                이미지 URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                상품 이미지 URL을 입력하세요. (선택사항)
              </p>
            </div>

            {/* 상품 설명 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                상품 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="상품에 대한 상세한 설명을 입력하세요"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></span>
                    등록 중...
                  </>
                ) : (
                  '상품 등록'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage; 