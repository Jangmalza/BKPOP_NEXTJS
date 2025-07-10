import React from 'react';
import { ServiceStep } from '@/types';
import { SERVICE_STEPS } from '@/constants';
import { getContainerClasses } from '@/utils';

interface ServiceGuideSectionProps {
  steps?: ServiceStep[];
  title?: string;
}

const ServiceGuideSection: React.FC<ServiceGuideSectionProps> = ({
  steps = SERVICE_STEPS,
  title = '인쇄 가이드 & 서비스 소개',
}) => {
  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBgColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      yellow: 'bg-yellow-100',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="w-full py-16 bg-white border-b">
      <div className={getContainerClasses()}>
        <h2 className="text-2xl font-bold mb-8 text-blue-900">{title}</h2>
        <div className="grid grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-20 h-20 ${getBgColor(step.color)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`${step.icon} ${getIconColor(step.color)} text-3xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-900">{step.title}</h3>
              <p className="text-gray-600 whitespace-pre-line">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGuideSection; 