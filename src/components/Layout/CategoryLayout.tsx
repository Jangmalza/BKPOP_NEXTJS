'use client';
import React from 'react';
import TopNav from '@/components/Header/TopNav';
import LogoSearch from '@/components/Header/LogoSearch';
import MainNav from '@/components/Header/MainNav';
import Footer from '@/components/Common/Footer';

interface CategoryLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

const CategoryLayout: React.FC<CategoryLayoutProps> = ({ 
  children, 
  activeTab = '상업인쇄' 
}) => {
  const [currentTab, setCurrentTab] = React.useState(activeTab);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50">
        <TopNav />
        <LogoSearch />
        <MainNav activeTab={currentTab} setActiveTab={setCurrentTab} />
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryLayout; 