/**
 * 상품 관리 페이지
 * @fileoverview 관리자 상품 관리 - 상품 목록, 검색, 필터링, 상세보기
 * @author Development Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/Admin/AdminLayout';
import { ProductItem } from '@/types';

interface ProductListItem extends ProductItem {
  description?: string;
  category_name?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

/**
 * 상품 테이블 행 컴포넌트
 */
const ProductTableRow: React.FC<{
  product: ProductListItem;
  onView: (product: ProductListItem) => void;
  onEdit: (product: ProductListItem) => void;
  onDelete: (product: ProductListItem) => void;
}> = ({ product, onView, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성';
      case 'inactive': return '비활성';
      case 'out_of_stock': return '품절';
      default: return '알 수 없음';
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">📦</span>
            )}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">{product.title}</p>
            <p className="text-sm text-gray-500">{product.category_name || '카테고리 없음'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.size}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.price}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
          {getStatusText(product.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(product.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onView(product)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          보기
        </button>
        <button
          onClick={() => onEdit(product)}
          className="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(product)}
          className="text-red-600 hover:text-red-900"
        >
          삭제
        </button>
      </td>
    </tr>
  );
};

/**
 * 상품 상세보기 모달
 */
const ProductDetailModal: React.FC<{
  product: ProductListItem | null;
  onClose: () => void;
}> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  상품 상세 정보
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">상품명</label>
                    <p className="mt-1 text-sm text-gray-900">{product.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">카테고리</label>
                    <p className="mt-1 text-sm text-gray-900">{product.category_name || '카테고리 없음'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">크기</label>
                    <p className="mt-1 text-sm text-gray-900">{product.size}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">가격</label>
                    <p className="mt-1 text-sm text-gray-900">{product.price}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">재고</label>
                    <p className="mt-1 text-sm text-gray-900">{product.quantity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">상태</label>
                    <p className="mt-1 text-sm text-gray-900">{product.status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">설명</label>
                    <p className="mt-1 text-sm text-gray-900">{product.description || '설명 없음'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">등록일</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(product.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">수정일</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(product.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 상품 관리 페이지
 */
const ProductsPage: React.FC = () => {
  const pathname = usePathname();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'out_of_stock'>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 데이터
      const mockProducts: ProductListItem[] = [
        {
          id: 1,
          title: '프리미엄 명함',
          size: '90x50mm',
          price: '15,000원',
          quantity: '100매',
          image: '/images/business-card.jpg',
          category_name: '상업인쇄',
          status: 'active',
          description: '고급 종이로 제작된 프리미엄 명함입니다.',
          created_at: '2024-01-01T10:00:00',
          updated_at: '2024-01-05T14:30:00'
        },
        {
          id: 2,
          title: '스탠다드 명함',
          size: '90x50mm',
          price: '8,000원',
          quantity: '500매',
          image: '/images/business-card-standard.jpg',
          category_name: '상업인쇄',
          status: 'active',
          description: '기본 종이로 제작된 스탠다드 명함입니다.',
          created_at: '2024-01-02T09:00:00',
          updated_at: '2024-01-05T16:00:00'
        },
        {
          id: 3,
          title: 'A4 전단지',
          size: '210x297mm',
          price: '500원',
          quantity: '0매',
          image: '/images/flyer.jpg',
          category_name: '상업인쇄',
          status: 'out_of_stock',
          description: '광고용 A4 전단지입니다.',
          created_at: '2024-01-03T11:00:00',
          updated_at: '2024-01-06T10:00:00'
        },
        {
          id: 4,
          title: '디지털 명함',
          size: '90x50mm',
          price: '12,000원',
          quantity: '200매',
          image: '/images/digital-business-card.jpg',
          category_name: '디지털인쇄',
          status: 'active',
          description: '디지털 인쇄 방식의 명함입니다.',
          created_at: '2024-01-04T13:00:00',
          updated_at: '2024-01-07T09:00:00'
        },
        {
          id: 5,
          title: '스티커',
          size: '100x100mm',
          price: '3,000원',
          quantity: '1000매',
          image: '/images/sticker.jpg',
          category_name: '상업인쇄',
          status: 'inactive',
          description: '다양한 용도로 사용할 수 있는 스티커입니다.',
          created_at: '2024-01-05T15:00:00',
          updated_at: '2024-01-08T11:00:00'
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('상품 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (product: ProductListItem) => {
    setSelectedProduct(product);
  };

  const handleEdit = (product: ProductListItem) => {
    // 수정 페이지로 이동
    console.log('상품 수정:', product);
  };

  const handleDelete = (product: ProductListItem) => {
    if (confirm(`정말로 "${product.title}" 상품을 삭제하시겠습니까?`)) {
      console.log('상품 삭제:', product);
      // 실제 삭제 로직 구현
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || product.category_name === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // 카테고리 목록 추출
  const categories = Array.from(new Set(products.map(p => p.category_name).filter(Boolean)));

  return (
    <AdminLayout title="상품 관리" currentPath={pathname}>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
          <Link
            href="/admin/products/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mr-2">+</span>
            상품 추가
          </Link>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="상품명 또는 카테고리로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 카테고리</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'out_of_stock')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="out_of_stock">품절</option>
              </select>
            </div>
          </div>
        </div>

        {/* 상품 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">총 상품</h3>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">활성 상품</h3>
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">품절 상품</h3>
            <p className="text-2xl font-bold text-red-600">
              {products.filter(p => p.status === 'out_of_stock').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">비활성 상품</h3>
            <p className="text-2xl font-bold text-gray-600">
              {products.filter(p => p.status === 'inactive').length}
            </p>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              상품 목록 ({filteredProducts.length}개)
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상품
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      크기
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      재고
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  다음
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{startIndex + 1}</span>
                    {' - '}
                    <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span>
                    {' / '}
                    <span className="font-medium">{filteredProducts.length}</span>
                    {' 결과'}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      다음
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 상품 상세보기 모달 */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </AdminLayout>
  );
};

export default ProductsPage; 