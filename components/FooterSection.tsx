interface FooterSectionProps {
  width?: 'default' | 'wide';
}

export default function FooterSection({ width = 'default' }: FooterSectionProps) {
  const containerWidthClass = width === 'wide' ? 'max-w-[1600px]' : 'max-w-7xl';
  return (
    <footer id="footer-about" className="mt-16 border-t border-slate-800/80 py-8 text-slate-400">
      <div className={`${containerWidthClass} mx-auto px-16 text-center text-xs sm:px-20`}>
        <p>© {new Date().getFullYear()} 弹壳特攻队攻略站 (DANKE HUB)</p>
      </div>
    </footer>
  );
}
