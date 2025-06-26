'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tabsListVariants = cva(
  'inline-flex items-center justify-center rounded-lg bg-slate-900 p-1'
);

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-slate-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'text-slate-300 hover:bg-slate-800 data-[state=active]:bg-slate-700 data-[state=active]:text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
} | null>(null);

export const Tabs = ({
  defaultValue,
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & { defaultValue: string }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('space-y-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div className={cn(tabsListVariants(), className)} {...props} />
  );
};

export const TabsTrigger = ({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<'button'> & { value: string }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      className={cn(
        tabsTriggerVariants(),
        isActive && 'bg-slate-700 text-white',
        className
      )}
      onClick={() => context.setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<'div'> & { value: string }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.activeTab !== value) {
    return null;
  }

  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};
