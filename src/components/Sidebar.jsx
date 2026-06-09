
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FlaskConical, label: 'WhatsApp Onboarding', path: '/meta-onboarding' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg shadow-[#25D366]/30">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight leading-none block">Meta Hub</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold',
                isActive
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'hover:bg-gray-100 hover:text-brand'
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-brand")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-brand rounded-xl shadow-lg border border-brand/10 transition-transform active:scale-90"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-30 shadow-sm">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="lg:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[50]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden flex flex-col w-72 bg-white fixed h-full z-[55] shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
