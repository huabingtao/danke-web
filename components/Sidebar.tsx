"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  ShieldAlert, 
  Cpu,
  Sparkles,
  PawPrint,
  Trophy,
  Rocket,
  Wrench, 
  ExternalLink, 
  Flame, 
  User, 
  LogIn, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ activeTab = 'overview', onTabChange }: SidebarProps) {
  const pathname = usePathname();
  // 用户登录状态模拟（未来接入三方登录）
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState('弹壳硬核特工');

  const showBuildingNotice = (name: string) => {
    setToastMessage(`🚧【${name}】图鉴数据库正在建档中，即将上线！`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const navCategories = [
    {
      group: '核心概览',
      items: [
        { id: 'overview', name: '首页概览', icon: Home, isBuilding: false },
        { id: 'strategies', name: '攻略文章', icon: BookOpen, badge: 'HOT', isBuilding: false },
      ]
    },
    {
      group: '战术图鉴文库',
      items: [
        { id: 'agents', name: '特工图鉴', icon: ShieldAlert, isBuilding: false },
        { id: 'tech-parts', name: '科技配件', icon: Cpu, isBuilding: true, badge: '待建' },
        { id: 'consciousness', name: '意识核心', icon: Sparkles, isBuilding: true, badge: '待建' },
        { id: 'pets', name: '战术宠物', icon: PawPrint, isBuilding: true, badge: '待建' },
        { id: 'collectibles', name: '藏品图鉴', icon: Trophy, isBuilding: true, badge: '待建' },
        { id: 'vehicles', name: '作战载具', icon: Rocket, isBuilding: true, badge: '待建' },
      ]
    },
    {
      group: '实用体系',
      items: [
        { id: 'tools', name: '工具大厅', icon: Wrench, isBuilding: false },
        { id: 'ecosystem', name: '生态外链', icon: ExternalLink, isBuilding: false },
      ]
    }
  ];

  return (
    <>
      <aside className="w-64 shrink-0 hidden lg:flex flex-col h-[calc(100vh-2rem)] sticky top-4 rounded-3xl glass-panel p-4 sm:p-5 justify-between overflow-y-auto no-scrollbar">
        {/* Top Section: Logo & Brand & Navigation */}
        <div className="space-y-5">
          {/* Logo & Pure Chinese Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-[2px] glow-orange transition-transform duration-300 group-hover:scale-105 shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400 animate-pulse-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black tracking-wider text-white">弹壳空间</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                  战术门户
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-400 tracking-wider">呱呱特攻战术空间</p>
            </div>
          </Link>

          {/* Grouped Navigation */}
          <nav className="space-y-4">
            {navCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-0.5">
                  {cat.group}
                </p>
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.isBuilding) {
                          showBuildingNotice(item.name);
                        } else {
                          onTabChange?.(item.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-orange-500 text-zinc-950 shadow-lg shadow-orange-500/20 font-black'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-950' : item.isBuilding ? 'text-zinc-500' : 'text-zinc-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive 
                            ? 'bg-zinc-950 text-orange-400' 
                            : item.isBuilding
                            ? 'bg-zinc-800/80 text-zinc-400 border border-white/5'
                            : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section: User Account & Third-Party Auth Entry */}
        <div className="pt-4 border-t border-white/5">
          <div 
            onClick={() => setShowLoginModal(true)}
            className="p-3 rounded-2xl bg-gradient-to-b from-zinc-900/70 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${
                  isLoggedIn 
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 border-orange-400 text-zinc-950 font-black text-sm'
                    : 'bg-zinc-800 border-white/10 text-zinc-400'
                }`}>
                  {isLoggedIn ? '指挥' : <User className="w-5 h-5" />}
                </div>

                {/* Name & Status */}
                <div className="truncate text-left">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-bold text-white truncate">
                      {isLoggedIn ? userName : '未登录'}
                    </p>
                    {isLoggedIn && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {isLoggedIn ? 'VIP 特工特权已激活' : '点击登录 / 接入三方'}
                  </p>
                </div>
              </div>

              {/* Action Indicator */}
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-orange-400 group-hover:bg-orange-500/10 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Login / Auth Placeholder Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl glass-panel border border-white/20 p-6 space-y-5 animate-in fade-in zoom-in duration-200 text-center">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {isLoggedIn ? '当前登录特工账号' : '特工中心 · 账号登录'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {isLoggedIn 
                  ? '已成功接入弹壳特工身份，数据将实时云端同步' 
                  : '未来将支持微信一键授权、QQ与手机号免密登录'}
              </p>
            </div>

            {/* Actions / Mock Switch */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsLoggedIn(!isLoggedIn);
                  setShowLoginModal(false);
                }}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                {isLoggedIn ? '退出当前登录状态' : '模拟微信一键快捷登录'}
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl glass-panel border border-orange-500/40 text-xs font-bold text-orange-300 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          {toastMessage}
        </div>
      )}
    </>
  );
}
