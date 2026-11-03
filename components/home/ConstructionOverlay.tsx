export default function ConstructionOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-slate-950/60 backdrop-blur-[1px]">
      <span className="rounded-full border border-orange-400/30 bg-slate-950/90 px-4 py-2 text-lg font-black tracking-wider text-orange-300 shadow-lg sm:px-5 sm:py-2.5 sm:text-xl">
        建设中
      </span>
    </div>
  );
}
