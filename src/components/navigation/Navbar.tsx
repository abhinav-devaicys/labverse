import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLearningStore } from '../../stores/useLearningStore';

export const Navbar: React.FC = () => {
  const view = useLearningStore((s) => s.view);
  const navigate = useLearningStore((s) => s.navigate);
  const savedCount = useLearningStore((s) => s.savedSubjects.length);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleGoSubjects = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate({ type: 'home' }, 'subjects-section');
  };

  const handleGoHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate({ type: 'home' }, 'philosophy-section');
  };

  const handleGoAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate({ type: 'about' });
  };

  const handleGoMyLearning = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate({ type: 'my-learning' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5F4EF]/95 backdrop-blur-md border-b border-[#171C24]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Left: LABVERSE Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setMobileOpen(false);
            navigate({ type: 'home' });
          }}
          className="font-display text-lg font-bold tracking-tight text-[#171C24] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5] rounded-sm"
        >
          LABVERSE
        </a>

        {/* Center: Real Crawlable Primary Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#474F5C]"
        >
          <a
            href="/#subjects-section"
            onClick={handleGoSubjects}
            className={`hover:text-[#171C24] transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              view.type === 'subject'
                ? 'text-[#171C24] border-[#5578F5]'
                : 'border-transparent hover:border-[#171C24]/25'
            }`}
          >
            Subjects
          </a>

          <a
            href="/#philosophy-section"
            onClick={handleGoHowItWorks}
            className="hover:text-[#171C24] transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 border-transparent hover:border-[#171C24]/25"
          >
            How It Works
          </a>

          <a
            href="/about"
            onClick={handleGoAbout}
            className={`hover:text-[#171C24] transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              view.type === 'about'
                ? 'text-[#171C24] border-[#5578F5]'
                : 'border-transparent hover:border-[#171C24]/25'
            }`}
          >
            About
          </a>
        </nav>

        {/* Right: My Learning + Get Started */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <a
            href="/my-learning"
            onClick={handleGoMyLearning}
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              view.type === 'my-learning'
                ? 'text-[#5578F5]'
                : 'text-[#474F5C] hover:text-[#171C24]'
            }`}
          >
            My Learning
            {savedCount > 0 && (
              <span className="ml-1.5 font-mono text-xs text-[#5578F5] tabular-nums">
                ({savedCount})
              </span>
            )}
          </a>

          <a
            href="/#subjects-section"
            onClick={handleGoSubjects}
            className="px-4 py-2 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]/60"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden p-2 rounded-lg text-[#171C24] hover:bg-[#171C24]/5 transition-colors cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Responsive Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#171C24]/10 bg-[#F5F4EF] px-4 py-4 space-y-2">
          <a
            href="/#subjects-section"
            onClick={handleGoSubjects}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#171C24] hover:bg-[#171C24]/5 transition-colors"
          >
            Subjects
          </a>
          <a
            href="/#philosophy-section"
            onClick={handleGoHowItWorks}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#171C24] hover:bg-[#171C24]/5 transition-colors"
          >
            How It Works
          </a>
          <a
            href="/about"
            onClick={handleGoAbout}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#171C24] hover:bg-[#171C24]/5 transition-colors"
          >
            About
          </a>
          <a
            href="/my-learning"
            onClick={handleGoMyLearning}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#171C24] hover:bg-[#171C24]/5 transition-colors"
          >
            My Learning {savedCount > 0 ? `(${savedCount})` : ''}
          </a>
          <div className="pt-2">
            <a
              href="/#subjects-section"
              onClick={handleGoSubjects}
              className="block w-full text-center px-4 py-2.5 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
