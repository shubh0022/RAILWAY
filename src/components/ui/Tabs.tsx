import React from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'segmented' | 'underlined';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'segmented'
}) => {
  const listRef = React.useRef<HTMLDivElement>(null);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = -1;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== -1 && listRef.current) {
      const buttons = listRef.current.querySelectorAll('button');
      const targetButton = buttons[nextIndex] as HTMLButtonElement;
      targetButton.focus();
      onChange(tabs[nextIndex].id);
    }
  };

  const isSegmented = variant === 'segmented';

  return (
    <div 
      ref={listRef}
      role="tablist" 
      aria-label="Booking Options"
      className={`
        flex items-center w-full
        ${isSegmented 
          ? 'glass-panel p-1 rounded-2xl bg-white/5 dark:bg-brand-blue-dark/50' 
          : 'border-b border-slate-200 dark:border-slate-800 gap-6'}
        ${className}
      `}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;
        
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`
              flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 outline-none cursor-pointer flex-1
              ${isSegmented 
                ? `py-3.5 px-4 rounded-xl
                   ${isActive 
                     ? 'bg-white dark:bg-brand-blue text-brand-orange shadow-md shadow-brand-orange/5 scale-102 font-bold' 
                     : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/5'}` 
                : `py-3.5 px-1 border-b-2 -mb-[2px]
                   ${isActive 
                     ? 'border-brand-orange text-brand-orange font-bold' 
                     : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            `}
          >
            {tab.icon && <span className={`shrink-0 ${isActive ? 'text-brand-orange' : 'text-slate-400 dark:text-slate-500'}`}>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tabId,
  activeTab,
  children,
  className = ''
}) => {
  const isActive = tabId === activeTab;
  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      className={`animate-fade-in focus:outline-none ${className}`}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default Tabs;
