import React from 'react';
import { NoticeItem, EventItem } from '@/types';
import { NOTICE_DATA, EVENT_DATA } from '@/constants';
import { getEventColor, getContainerClasses } from '@/utils';

interface NoticeSectionProps {
  notices?: NoticeItem[];
  events?: EventItem[];
  title?: string;
}

const NoticeSection: React.FC<NoticeSectionProps> = ({
  notices = NOTICE_DATA,
  events = EVENT_DATA,
  title = '공지사항 & 이벤트',
}) => {
  return (
    <section className="w-full py-16 bg-gray-100 border-b">
      <div className={getContainerClasses()}>
        <h2 className="text-2xl font-bold mb-8 text-blue-900">{title}</h2>
        <div className="grid grid-cols-2 gap-8">
          {/* 공지사항 */}
          <div className="bg-white p-8 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4 text-blue-900">📢 최신 공지사항</h3>
            <div className="space-y-4">
              {notices.map((notice, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{notice.date}</span>
                  <span className="font-medium text-blue-900">{notice.title}</span>
                  {notice.isNew && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">NEW</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 이벤트 */}
          <div className="bg-white p-8 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4 text-blue-900">🎉 진행중인 이벤트</h3>
            <div className="space-y-4">
              {events.map((event, index) => {
                const colors = getEventColor(event.type);
                return (
                  <div key={index} className={`p-4 ${colors.bg} border-l-4 ${colors.border} rounded-lg`}>
                    <h4 className={`font-bold mb-2 ${colors.text}`}>{event.title}</h4>
                    <p className={`text-sm ${colors.textLight}`}>{event.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeSection; 