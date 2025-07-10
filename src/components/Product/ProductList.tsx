import React from 'react';

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
}

const ProductList: React.FC<ProductListProps> = ({ title, products }) => {
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
              <button className="mt-auto bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded-full text-base shadow hover:bg-yellow-300 transition">상세보기</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
