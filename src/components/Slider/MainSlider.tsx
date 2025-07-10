// components/Slider/MainSlider.tsx
import React, { useEffect } from 'react';

const slides = [
  {
    title: '명함 최저가 도전!',
    desc: '명함 100장 1,700원부터, 국내 최저가에 도전하세요!',
    image: 'https://picsum.photos/1200/350?random=1',
    cta: '명함 주문하기',
  },
  {
    title: '전단지 대량 할인',
    desc: 'A4 전단지 3,500원부터, 대량 주문시 추가 할인!',
    image: 'https://picsum.photos/1200/350?random=2',
    cta: '전단지 주문하기',
  },
  {
    title: '스티커/봉투/패키지',
    desc: '다양한 인쇄물, 빠른 납기와 합리적 가격!',
    image: 'https://picsum.photos/1200/350?random=3',
    cta: '전체 상품 보기',
  },
];

const MainSlider: React.FC = () => {
  const [current, setCurrent] = React.useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gray-100 border-b">
      <div className="max-w-[1400px] mx-auto relative overflow-hidden">
        <img
          src={slides[current].image}
          alt={slides[current].title}
          className="w-full h-[350px] object-cover rounded-xl"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-start px-16 bg-gradient-to-r from-black/60 to-transparent">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{slides[current].title}</h2>
          <p className="text-lg text-white mb-6 drop-shadow">{slides[current].desc}</p>
          <button className="bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full text-lg shadow hover:bg-yellow-300 transition">{slides[current].cta}</button>
        </div>
        {/* 좌우 화살표 */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          aria-label="이전 슬라이드"
        >
          <i className="fas fa-chevron-left text-2xl"></i>
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          aria-label="다음 슬라이드"
        >
          <i className="fas fa-chevron-right text-2xl"></i>
        </button>
        {/* 하단 인디케이터 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`w-4 h-4 rounded-full border-2 ${current === idx ? 'bg-yellow-400 border-yellow-400' : 'bg-white border-gray-300'} transition`}
              onClick={() => setCurrent(idx)}
              aria-label={`슬라이드 ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainSlider;