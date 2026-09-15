"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Shield, Zap, Sparkles, ChevronRight, ChevronLeft, Flame, Swords, Award } from 'lucide-react';
import { fetchAgents } from '@/lib/api';

interface Agent {
  id: string;
  name: string;
  code: string;
  subtitle: string;
  tier: string;
  colorScheme: {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    textGradient: string;
    energyColor: string;
  };
  role: string;
  mainSkill: string;
  perks: string[];
  image: string;
  rating: string;
}

const FALLBACK_AGENTS: Agent[] = [
  {
    id: 'vitor',
    name: '维托尔',
    code: 'VITOR',
    subtitle: '神火狂啸 · 爆发核心',
    tier: 'SS级特工',
    rating: '99% 胜率推荐',
    colorScheme: {
      bg: 'from-orange-950/70 via-zinc-900/90 to-zinc-950',
      border: 'border-orange-500/30 hover:border-orange-500/80',
      badgeBg: 'bg-gradient-to-r from-orange-500 to-amber-500',
      badgeText: 'text-zinc-950',
      glow: 'glow-orange',
      textGradient: 'from-orange-400 to-amber-300',
      energyColor: 'rgba(249, 115, 22, 0.45)',
    },
    role: '极速清屏 / 爆发输出',
    mainSkill: '魔导爆破：发射穿透性高能魔弹并在敌群中引发连锁爆炸',
    perks: ['魔能轰炸', '肾上腺素', '暴伤加成 +40%'],
    image: '/assets/agent-vitor.png',
  },
  {
    id: 'rinne',
    name: '凛音',
    code: 'RINNE',
    subtitle: '樱落绝影 · 范围制霸',
    tier: 'S级特工',
    rating: '95% 控场优选',
    colorScheme: {
      bg: 'from-pink-950/70 via-zinc-900/90 to-zinc-950',
      border: 'border-pink-500/30 hover:border-pink-500/80',
      badgeBg: 'bg-gradient-to-r from-pink-500 to-purple-500',
      badgeText: 'text-zinc-950',
      glow: 'glow-purple',
      textGradient: 'from-pink-400 to-purple-300',
      energyColor: 'rgba(236, 72, 153, 0.45)',
    },
    role: '范围斩击 / 风暴制霸',
    mainSkill: '樱落千刃：召唤樱花风暴与刀芒切碎大批敌群',
    perks: ['樱落斩', '樱花风暴', '范围加成 +30%'],
    image: '/assets/agent-rinne.png',
  },
  {
    id: 'nezha',
    name: '哪吒',
    code: 'NEZHA',
    subtitle: '三昧真火 · 持续灼烧',
    tier: 'S级特工',
    rating: '持续输出利器',
    colorScheme: {
      bg: 'from-red-950/70 via-zinc-900/90 to-zinc-950',
      border: 'border-red-500/30 hover:border-red-500/80',
      badgeBg: 'bg-gradient-to-r from-red-500 to-orange-500',
      badgeText: 'text-zinc-950',
      glow: 'glow-orange',
      textGradient: 'from-red-400 to-orange-300',
      energyColor: 'rgba(239, 68, 68, 0.45)',
    },
    role: '真火穿透 / 持续灼烧',
    mainSkill: '乾坤火尖枪：投掷混天绫与三昧烈焰封锁战场',
    perks: ['三昧真火', '混天绫', '灼烧伤害 +35%'],
    image: '/assets/agent-nezha.png',
  },
  {
    id: 'vulcan',
    name: '伏尔甘',
    code: 'VULCAN',
    subtitle: '重装工匠 · 机械压制',
    tier: 'S级特工',
    rating: '防守反击核心',
    colorScheme: {
      bg: 'from-amber-950/70 via-zinc-900/90 to-zinc-950',
      border: 'border-amber-500/30 hover:border-amber-500/80',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      badgeText: 'text-zinc-950',
      glow: 'glow-orange',
      textGradient: 'from-amber-400 to-yellow-300',
      energyColor: 'rgba(245, 158, 11, 0.45)',
    },
    role: '重装防御 / 机械炮塔',
    mainSkill: '火神巨炮：部署超重型连发防御炮台进行大范围压制',
    perks: ['火神巨炮', '重装工匠', '护盾防御 +25%'],
    image: '/assets/agent-vulcan.png',
  },
  {
    id: 'taloshia',
    name: '塔洛西娅',
    code: 'TALOSHIA',
    subtitle: '暗夜影刃 · 裂伤暴击',
    tier: 'S级特工',
    rating: '暗夜暴击收割',
    colorScheme: {
      bg: 'from-emerald-950/70 via-zinc-900/90 to-zinc-950',
      border: 'border-emerald-500/30 hover:border-emerald-500/80',
      badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      badgeText: 'text-zinc-950',
      glow: 'glow-blue',
      textGradient: 'from-emerald-400 to-teal-300',
      energyColor: 'rgba(16, 185, 129, 0.45)',
    },
    role: '暗夜潜行 / 裂伤暴击',
    mainSkill: '幽影幻舞：进入隐身状态并造成高频高额裂伤暴击',
    perks: ['幽影之刃', '暗影裂伤', '裂伤伤害 +45%'],
    image: '/assets/agent-taloshia.png',
  },
  {
    id: 'common',
    name: '科萌',
    code: 'COMMON',
    subtitle: '初诞特工 · 万金油过渡',
    tier: '普通特工',
    rating: '萌新开荒首选',
    colorScheme: {
      bg: 'from-blue-950/70 via-zinc-900/90 to-zinc-950',
      border: 'border-blue-500/30 hover:border-blue-500/80',
      badgeBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      badgeText: 'text-zinc-950',
      glow: 'glow-blue',
      textGradient: 'from-blue-400 to-cyan-300',
      energyColor: 'rgba(59, 130, 246, 0.45)',
    },
    role: '初诞均衡 / 新手开荒',
    mainSkill: '能量集束：发射平衡稳定的能量射击弹道',
    perks: ['能量弹', '均衡射击', '基础生命 +20%'],
    image: '/assets/agent-common.png',
  },
];

export default function AgentCards() {
  const [agents, setAgents] = useState<Agent[]>(FALLBACK_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchAgents().then((data) => {
      if (data && data.length > 0) {
        setAgents(data);
      }
    });
  }, []);
  
  // 连续当前位置 (以卡片索引为单位的浮点数，如 0.0 ~ 5.999...)
  const [currentProgress, setCurrentProgress] = useState(0);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  
  // 24 槽位 360° 真实 3D 柱面环幕（每个槽位 15°，支持一屏展示 9~11 张卡片）
  const TOTAL_SLOTS = 24;
  const STEP_ANGLE = 360 / TOTAL_SLOTS; // 15°

  // 响应式 3D 柱面大半径（圆心位于卡片后方 Z 轴，大半径展开全景）
  const [config, setConfig] = useState({
    radius: 880,
    pitchAngle: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 640) {
          setConfig({
            radius: 520,
            pitchAngle: 0,
          });
        } else if (width < 1024) {
          setConfig({
            radius: 700,
            pitchAngle: 0,
          });
        } else {
          setConfig({
            radius: 880,
            pitchAngle: 0,
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 60FPS 动画循环：平滑插值 (Lerp) 与 缓速平稳巡航
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // 如果未被拖拽且未被鼠标悬停，平滑自动缓慢巡航
      if (!isDraggingRef.current && !isHovered) {
        targetProgressRef.current += 0.16 * delta; // 约每 6 秒平稳旋转一张
      }

      // 平滑逼近 targetProgress (Lerp)
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.12;
      
      setCurrentProgress(currentProgressRef.current);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isHovered]);

  // 计算当前处于最正中央的特工真实索引 (0 ~ 5)
  const activeAgentIndex = ((Math.round(currentProgress) % agents.length) + agents.length) % agents.length;

  // 左右控制箭头：平移 1 张 (22.5°)
  const handleStep = (direction: 'left' | 'right') => {
    const currentNearest = Math.round(targetProgressRef.current);
    if (direction === 'left') {
      targetProgressRef.current = currentNearest - 1;
    } else {
      targetProgressRef.current = currentNearest + 1;
    }
  };

  // 点击指示灯跳转到特定特工
  const handleJumpToAgent = (targetAgentIdx: number) => {
    const currentProg = currentProgressRef.current;
    const currentAgentIdx = ((Math.round(currentProg) % agents.length) + agents.length) % agents.length;
    let diff = targetAgentIdx - currentAgentIdx;
    if (diff > agents.length / 2) diff -= agents.length;
    if (diff < -agents.length / 2) diff += agents.length;
    targetProgressRef.current = Math.round(currentProg) + diff;
  };

  // 鼠标 / 触摸拖拽交互
  const handleDragStart = (clientX: number) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = clientX;
    lastXRef.current = clientX;
    startProgressRef.current = targetProgressRef.current;
    velocityRef.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startXRef.current;
    if (Math.abs(deltaX) > 5) {
      hasMovedRef.current = true;
    }

    // 拖拽灵敏度（像素转旋转步长）
    const sensitivity = 0.0035;
    targetProgressRef.current = startProgressRef.current - deltaX * sensitivity;
    velocityRef.current = (clientX - lastXRef.current) * sensitivity;
    lastXRef.current = clientX;
  };

  const handleDragEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;

      // 附加微惯性并吸附到最近卡牌整数位置
      const inertia = -velocityRef.current * 8;
      targetProgressRef.current += inertia;
      targetProgressRef.current = Math.round(targetProgressRef.current);

      setTimeout(() => {
        hasMovedRef.current = false;
      }, 150);
    }
  };

  const handleSeeMore = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => i);

  return (
    <section id="agents" className="mb-16 sm:mb-20 space-y-4 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-6 rounded-full bg-orange-500" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            特工图鉴
          </h2>
        </div>

        {/* Right Controls: See More + Rotate Arrows */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSeeMore}
            className="text-xs font-bold text-zinc-400 hover:text-orange-400 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all flex items-center space-x-1 cursor-pointer"
          >
            <span>查看更多</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="hidden sm:flex items-center space-x-1">
            <button
              onClick={() => handleStep('left')}
              className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 hover:border-orange-500/40 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="向前一张"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleStep('right')}
              className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 hover:border-orange-500/40 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="向后一张"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Horizon Dome Stage (以 Z 轴后方深度为圆心的纯正 3D 柱面环幕，无任何 2D 平面倾斜) */}
      <div 
        className="relative w-full h-[400px] sm:h-[440px] flex items-center justify-center overflow-hidden py-2 rounded-3xl group"
        style={{
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleDragEnd();
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {/* Subtle Sky Arc Top Glow */}
        <div 
          className="absolute -top-16 w-[720px] h-[180px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none -translate-x-1/2 left-1/2"
        />

        {/* 3D 柱面旋转转盘：圆心位于 (0, 0, -radius) 的 Z 轴深度空间 */}
        <div
          className="relative w-[190px] sm:w-[210px] h-[310px] sm:h-[330px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${config.radius}px) rotateX(${config.pitchAngle}deg) rotateY(${-currentProgress * STEP_ANGLE}deg)`,
          }}
        >
          {slots.map((slotIndex) => {
            const slotBaseAngle = slotIndex * STEP_ANGLE;
            
            // 计算当前卡片相对于观察者正前方的相对角度差 (-180° 到 +180°)
            const netAngle = ((slotBaseAngle - currentProgress * STEP_ANGLE) % 360 + 540) % 360 - 180;
            const absAngle = Math.abs(netAngle);

            // 映射到真实的特工对象
            const agentIndex = ((slotIndex % agents.length) + agents.length) % agents.length;
            const agent = agents[agentIndex];

            const isCenter = absAngle < STEP_ANGLE * 0.45;
            const isFrontHemisphere = absAngle < 98;

            // 景深与明暗
            const brightness = isFrontHemisphere ? Math.max(0.5, Math.cos((absAngle * Math.PI) / 180) * 0.5 + 0.55) : 0;
            const opacity = isFrontHemisphere ? Math.max(0.05, Math.pow(Math.cos((absAngle * Math.PI) / 180), 0.55)) : 0;
            const pointerEvents = isFrontHemisphere ? 'auto' : 'none';

            return (
              <div
                key={`slot-${slotIndex}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasMovedRef.current) return;
                  if (isCenter) {
                    setSelectedAgent(agent);
                  } else {
                    // 点击侧边卡牌，精确将该卡牌旋转至正前方
                    targetProgressRef.current = currentProgressRef.current + netAngle / STEP_ANGLE;
                  }
                }}
                className={`absolute inset-0 rounded-3xl overflow-hidden p-3 bg-gradient-to-b ${agent.colorScheme.bg} border ${agent.colorScheme.border} shadow-2xl transition-opacity duration-75 flex flex-col justify-between select-none ${
                  isCenter 
                    ? 'cursor-pointer ring-2 ring-orange-500/50 shadow-orange-500/30' 
                    : 'cursor-pointer hover:brightness-110'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  // 纯正 3D 柱面变换：绕自身 Y 轴旋转到柱面对应角度，并在自身 Z 轴方向推出半径距离
                  transform: `rotateY(${slotBaseAngle}deg) translateZ(${config.radius}px)`,
                  opacity,
                  filter: `brightness(${brightness})`,
                  pointerEvents,
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Top Bar: NO + Tier Badge */}
                <div className="flex items-center justify-between z-10 mb-1">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider">
                    NO.0{agentIndex + 1}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm ${agent.colorScheme.badgeBg} ${agent.colorScheme.badgeText}`}>
                    {agent.tier}
                  </span>
                </div>

                {/* Character Showcase: Centered inside comic orange grid box */}
                <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden border border-orange-500/40 my-1 bg-gradient-to-b from-[#f97316] via-[#ea580c] to-[#c2410c] shadow-inner flex items-center justify-center p-2 pointer-events-none isolate">
                  {/* Comic Halftone Dot Texture */}
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`,
                      backgroundSize: '8px 8px'
                    }}
                  />

                  {/* Agent Character Sprite Centered with Breathing */}
                  <div className="relative w-full h-full flex items-center justify-center animate-agent-idle">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-contain object-center drop-shadow-md pointer-events-none"
                    />
                  </div>
                </div>

                {/* Bottom Info Area */}
                <div className="pt-1 z-10 space-y-1 pointer-events-none">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-black text-white">
                      {agent.name}
                    </h3>
                    <span className="text-[9px] text-zinc-400 font-mono">
                      {agent.rating}
                    </span>
                  </div>

                  <p className="text-[10px] font-medium text-orange-300/90 truncate">
                    {agent.subtitle}
                  </p>

                  {/* Role and Skill Tags */}
                  <div className="flex items-center gap-1 pt-0.5 overflow-hidden">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-zinc-300 truncate">
                      {agent.role}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-orange-300 shrink-0">
                      {agent.perks[0]}
                    </span>
                  </div>

                  {/* Bottom Interactive Footer */}
                  <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="flex items-center space-x-1">
                      <Swords className="w-3 h-3 text-orange-400" />
                      <span>战术机制</span>
                    </span>
                    <span className="text-orange-400 font-bold">
                      {isCenter ? '查看详情 →' : '点击切至中心'}
                    </span>
                  </div>
                </div>

                {/* Hover Glow Edge Accent */}
                {isCenter && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicator Dots */}
      <div className="flex items-center justify-center space-x-2 pt-1">
        {agents.map((agent, i) => {
          const isActive = i === activeAgentIndex;
          return (
            <button
              key={agent.id}
              onClick={() => handleJumpToAgent(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-7 bg-orange-500 shadow-md shadow-orange-500/50'
                  : 'w-2 bg-white/15 hover:bg-white/30'
              }`}
              title={agent.name}
            />
          );
        })}
      </div>

      {/* Toast Notice */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl glass-panel border border-orange-500/40 text-xs font-bold text-orange-300 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          ✨ 更多特工（月咏、金、沃尔默、猫猫等）正在建档整理中...
        </div>
      )}

      {/* Selected Agent Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-white/20 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedAgent(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-b from-orange-500 to-amber-600 flex items-center justify-center p-0 shrink-0">
                <Image
                  src={selectedAgent.image}
                  alt={selectedAgent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-black text-white">{selectedAgent.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedAgent.colorScheme.badgeBg} ${selectedAgent.colorScheme.badgeText}`}>
                    {selectedAgent.tier}
                  </span>
                </div>
                <p className="text-xs text-orange-400 font-medium mt-0.5">{selectedAgent.subtitle}</p>
                <p className="text-xs text-zinc-400">{selectedAgent.role}</p>
              </div>
            </div>

            {/* Main Skill & Perks */}
            <div className="space-y-3 bg-zinc-950/60 p-4 rounded-2xl border border-white/5">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">核心战术技能</span>
                <p className="text-sm font-semibold text-zinc-200 mt-1">{selectedAgent.mainSkill}</p>
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">专属增益特性</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {selectedAgent.perks.map((perk, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300 font-medium">
                      ✓ {perk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black text-xs transition-all cursor-pointer"
              >
                关闭图鉴
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
