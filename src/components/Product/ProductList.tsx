'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

export interface ProductItem {
  id: number;
  image: string;
  title: string;
  size: string;
  price: string;
  quantity: string;
}

interface ProductListProps {
  title: string;
  products: ProductItem[];
  category?: string;
}

const ProductList: React.FC<ProductListProps> = ({ title, products, category }) => {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = (product: ProductItem) => {
    addItem(product, 1);
    alert(`${product.title}이(가) 장바구니에 추가되었습니다.`);
  };

  const handleDetailView = (product: ProductItem) => {
    if (category) {
      router.push(`/products/${category}/${product.id}`);
    }
  };

  return (
    <section className="w-full py-12 bg-white border-b">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-blue-900">{title}</h2>
        <div className="grid grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 rounded-xl shadow hover:shadow-xl border hover:border-yellow-400 transition p-6 flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="font-bold text-lg text-blue-900 mb-2">{product.title}</h3>
              <div className="text-sm text-gray-500 mb-1">{product.size}</div>
              <div className="text-base font-semibold text-blue-700 mb-2">{product.price} <span className="text-xs text-gray-400">/ {product.quantity}</span></div>
              <div className="mt-auto flex gap-2">
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-full text-sm shadow hover:bg-blue-700 transition"
                >
                  장바구니
                </button>
                <button 
                  onClick={() => handleDetailView(product)}
                  className="bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded-full text-sm shadow hover:bg-yellow-300 transition"
                >
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
