"use client";

export default function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Tactical Game Slate Canvas */}
      <div className="absolute inset-0 bg-[#0a0f1d]" />

      {/* Ambient Tactical Energy Glows (Top-Right Hero Orange + Bottom-Left Tech Cyan) */}
      <div className="absolute -top-40 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-orange-500/12 via-amber-500/6 to-transparent blur-[120px]" />
      <div className="absolute top-1/3 -left-40 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-600/5 to-transparent blur-[100px]" />
      <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-purple-600/8 via-indigo-500/4 to-transparent blur-[110px]" />

      {/* Tactical Cyber Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.045]" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,transparent_0%,rgba(10,15,29,0.7)_100%)]" />
    </div>
  );
}
