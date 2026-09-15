"use client";

import { MessageCircle, HeartHandshake, ShieldAlert, Sparkles } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer id="footer-about" className="pt-10 pb-12 border-t border-slate-800/80 mt-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* 1. 微信公众号入口 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-white">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold">微信公众号关注</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              微信搜索关注 <span className="text-emerald-400 font-bold">【弹壳呱呱】</span>。每日持续更新弹壳活动提醒日历、阶梯消耗精算及深度避坑指南。
            </p>
          </div>

          {/* 2. 内容反馈与纠错 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-white">
              <HeartHandshake className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold">内容反馈与交流</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              攻略观点与数值测算基于实测。若发现错漏或有最新实战技巧分享，欢迎在公众号后台发送消息或在推文评论区留言。
            </p>
          </div>

          {/* 3. 关于本站与版权声明 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-white">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold">关于本站与免责说明</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              本站为玩家自建攻略站点，数据与策略仅供参考。游戏内所有角色、装备名称与美术素材版权均归开发商 Habby 公司所有。
            </p>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} 弹壳特攻队攻略站 (DANKE HUB)</p>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>以玩家体验为核心 · 持续更新中</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
