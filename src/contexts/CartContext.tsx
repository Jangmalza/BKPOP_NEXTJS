/**
 * 장바구니 컨텍스트
 * @fileoverview 장바구니 상태 관리를 위한 React Context
 * @author Development Team
 * @version 1.0.0
 */

'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, CartContextType, ProductItem, ApiResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Formatter, 
  LocalStorage, 
  ErrorHandler, 
  AppError, 
  ERROR_CODES 
} from '@/utils';

/**
 * 장바구니 컨텍스트 생성
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * 장바구니 API 호출 함수들
 */
class CartAPI {
  /**
   * 서버에서 장바구니 데이터 조회
   * @param userId - 사용자 ID
   * @returns 장바구니 아이템 목록
   */
  static async getCartItems(userId: number): Promise<CartItem[]> {
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      const data: ApiResponse<{ items: CartItem[] }> = await response.json();
      
      if (!data.success) {
        throw new AppError(data.message, response.status, data.errorCode);
      }
      
      return data.data?.items || [];
    } catch (error) {
      ErrorHandler.log(error as Error, 'CartAPI.getCartItems');
      throw error;
    }
  }

  /**
   * 서버에 장바구니 아이템 추가
   * @param userId - 사용자 ID
   * @param product - 상품 정보
   * @param quantity - 수량
   */
  static async addCartItem(userId: number, product: ProductItem, quantity: number): Promise<void> {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: product.id,
          title: product.title,
          image: product.image,
          size: product.size,
          price: Formatter.parsePrice(product.price),
          quantity
        })
      });

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new AppError(data.message, response.status, data.errorCode);
      }
    } catch (error) {
      ErrorHandler.log(error as Error, 'CartAPI.addCartItem');
      throw error;
    }
  }

  /**
   * 서버에서 장바구니 아이템 수량 수정
   * @param cartId - 장바구니 아이템 ID
   * @param quantity - 새 수량
   */
  static async updateCartItem(cartId: number, quantity: number): Promise<void> {
    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new AppError(data.message, response.status, data.errorCode);
      }
    } catch (error) {
      ErrorHandler.log(error as Error, 'CartAPI.updateCartItem');
      throw error;
    }
  }

  /**
   * 서버에서 장바구니 아이템 삭제
   * @param cartId - 장바구니 아이템 ID
   */
  static async removeCartItem(cartId: number): Promise<void> {
    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'DELETE'
      });

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new AppError(data.message, response.status, data.errorCode);
      }
    } catch (error) {
      ErrorHandler.log(error as Error, 'CartAPI.removeCartItem');
      throw error;
    }
  }

  /**
   * 서버에서 장바구니 전체 비우기
   * @param userId - 사용자 ID
   */
  static async clearCart(userId: number): Promise<void> {
    try {
      const response = await fetch(`/api/cart?userId=${userId}`, {
        method: 'DELETE'
      });

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new AppError(data.message, response.status, data.errorCode);
      }
    } catch (error) {
      ErrorHandler.log(error as Error, 'CartAPI.clearCart');
      throw error;
    }
  }
}

/**
 * 로컬 스토리지 장바구니 관리
 */
class LocalCartManager {
  private static readonly CART_KEY = 'bkpop_cart';

  /**
   * 로컬 스토리지에서 장바구니 데이터 로드
   * @returns 장바구니 아이템 목록
   */
  static loadCart(): CartItem[] {
    return LocalStorage.getItem<CartItem[]>(this.CART_KEY) || [];
  }

  /**
   * 로컬 스토리지에 장바구니 데이터 저장
   * @param items - 장바구니 아이템 목록
   */
  static saveCart(items: CartItem[]): void {
    LocalStorage.setItem(this.CART_KEY, items);
  }

  /**
   * 로컬 스토리지에서 장바구니 초기화
   */
  static clearCart(): void {
    LocalStorage.removeItem(this.CART_KEY);
  }
}

/**
 * 장바구니 프로바이더 컴포넌트
 * @param children - 자식 컴포넌트
 * @returns 장바구니 컨텍스트 프로바이더
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  /**
   * 에러 상태 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 서버에서 장바구니 데이터 로드
   * @param userId - 사용자 ID
   */
  const loadCartFromServer = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const serverItems = await CartAPI.getCartItems(userId);
      const processedItems = serverItems.map(item => ({
        ...item,
        totalPrice: item.price * item.quantity
      }));
      
      setItems(processedItems);
    } catch (error) {
      const errorMessage = error instanceof AppError 
        ? error.message 
        : '장바구니 데이터를 불러오는 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      ErrorHandler.log(error as Error, 'CartProvider.loadCartFromServer');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 로컬 스토리지에서 장바구니 데이터 로드
   */
  const loadCartFromLocalStorage = useCallback(() => {
    try {
      const localItems = LocalCartManager.loadCart();
      setItems(localItems);
    } catch (error) {
      setError('로컬 장바구니 데이터를 불러오는 중 오류가 발생했습니다.');
      ErrorHandler.log(error as Error, 'CartProvider.loadCartFromLocalStorage');
    }
  }, []);

  /**
   * 로그인 상태에 따른 장바구니 데이터 로드
   */
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadCartFromServer(parseInt(user.id));
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, user?.id, loadCartFromServer, loadCartFromLocalStorage]);

  /**
   * 비로그인 상태에서 장바구니 데이터 변경 시 로컬 스토리지 저장
   */
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      LocalCartManager.saveCart(items);
    }
  }, [items, isAuthenticated]);

  /**
   * 장바구니에 상품 추가
   * @param product - 상품 정보
   * @param quantity - 수량
   */
  const addItem = useCallback(async (product: ProductItem, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated && user?.id) {
        // 로그인 상태: 서버에 저장 후 새로고침
        await CartAPI.addCartItem(parseInt(user.id), product, quantity);
        await loadCartFromServer(parseInt(user.id));
      } else {
        // 비로그인 상태: 로컬 스토리지에 저장
        const price = Formatter.parsePrice(product.price);
        const existingItem = items.find(item => item.product_id === product.id);

        if (existingItem) {
          const updatedItems = items.map(item =>
            item.product_id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  totalPrice: (item.quantity + quantity) * price
                }
              : item
          );
          setItems(updatedItems);
        } else {
          const newItem: CartItem = {
            id: Date.now(), // 임시 ID
            product_id: product.id,
            image: product.image,
            title: product.title,
            size: product.size,
            price: price,
            quantity: quantity,
            totalPrice: price * quantity
          };
          setItems(prevItems => [...prevItems, newItem]);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof AppError 
        ? error.message 
        : '장바구니에 상품을 추가하는 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      ErrorHandler.log(error as Error, 'CartProvider.addItem');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, items, loadCartFromServer]);

  /**
   * 장바구니에서 상품 제거
   * @param id - 장바구니 아이템 ID
   */
  const removeItem = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated && user?.id) {
        // 로그인 상태: 서버에서 삭제 후 새로고침
        await CartAPI.removeCartItem(id);
        await loadCartFromServer(parseInt(user.id));
      } else {
        // 비로그인 상태: 로컬에서 삭제
        setItems(prevItems => prevItems.filter(item => item.id !== id));
      }
    } catch (error) {
      const errorMessage = error instanceof AppError 
        ? error.message 
        : '장바구니에서 상품을 제거하는 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      ErrorHandler.log(error as Error, 'CartProvider.removeItem');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, loadCartFromServer]);

  /**
   * 장바구니 상품 수량 변경
   * @param id - 장바구니 아이템 ID
   * @param quantity - 새 수량
   */
  const updateQuantity = useCallback(async (id: number, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated && user?.id) {
        // 로그인 상태: 서버에서 수정 후 새로고침
        await CartAPI.updateCartItem(id, quantity);
        await loadCartFromServer(parseInt(user.id));
      } else {
        // 비로그인 상태: 로컬에서 수정
        if (quantity <= 0) {
          setItems(prevItems => prevItems.filter(item => item.id !== id));
          return;
        }

        setItems(prevItems =>
          prevItems.map(item =>
            item.id === id
              ? {
                  ...item,
                  quantity: quantity,
                  totalPrice: item.price * quantity
                }
              : item
          )
        );
      }
    } catch (error) {
      const errorMessage = error instanceof AppError 
        ? error.message 
        : '장바구니 수량을 변경하는 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      ErrorHandler.log(error as Error, 'CartProvider.updateQuantity');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, loadCartFromServer]);

  /**
   * 장바구니 전체 비우기
   */
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated && user?.id) {
        // 로그인 상태: 서버에서 비우기
        await CartAPI.clearCart(parseInt(user.id));
      } else {
        // 비로그인 상태: 로컬에서 비우기
        LocalCartManager.clearCart();
      }
      
      setItems([]);
    } catch (error) {
      const errorMessage = error instanceof AppError 
        ? error.message 
        : '장바구니를 비우는 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      ErrorHandler.log(error as Error, 'CartProvider.clearCart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  /**
   * 장바구니 총 가격 계산
   * @returns 총 가격
   */
  const getTotalPrice = useCallback((): number => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  }, [items]);

  /**
   * 장바구니 총 상품 개수 계산
   * @returns 총 상품 개수
   */
  const getTotalItems = useCallback((): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  /**
   * 장바구니 새로고침
   */
  const refreshCart = useCallback(async () => {
    if (isAuthenticated && user?.id) {
      await loadCartFromServer(parseInt(user.id));
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, user?.id, loadCartFromServer, loadCartFromLocalStorage]);

  // 컨텍스트 값 생성
  const value: CartContextType = {
    items,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    refreshCart,
    clearError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * 장바구니 컨텍스트 사용 훅
 * @returns 장바구니 컨텍스트 값
 * @throws {Error} 프로바이더 외부에서 사용 시 에러
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 