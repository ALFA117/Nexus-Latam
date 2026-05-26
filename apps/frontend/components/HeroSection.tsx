'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const WORDS = ['COMERCIO B2B', 'LIQUIDEZ DIGITAL', 'TRADE FINANCE', 'COMPLIANCE IA'];

export function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Typewriter ─────────────────────────────────────────────── */
  useEffect(() => {
    const target = WORDS[wordIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < target.length) {
      timer = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === target.length) {
      timer = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % WORDS.length);
    }

    return () => clearTimeout(timer);
  }, [displayed, deleting, wordIdx]);

  /* ── Particle canvas ────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    }> = [];

    const colors = ['#00D4FF', '#9B30FF', '#F7B731', '#00FF94'];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = () => {
      particles.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        vx:    (Math.random() - 0.5) * 0.4,
        vy:    (Math.random() - 0.5) * 0.4,
        size:  Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    resize();
    for (let i = 0; i < 120; i++) spawn();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Connection lines */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      /* Dots */
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg"
    >
      {/* Scan line */}
      <div className="scan-line" />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-24 left-8 w-20 h-20 border-l border-t border-[#00D4FF44] pointer-events-none" />
      <div className="absolute top-24 right-8 w-20 h-20 border-r border-t border-[#00D4FF44] pointer-events-none" />
      <div className="absolute bottom-12 left-8 w-20 h-20 border-l border-b border-[#F7B73144] pointer-events-none" />
      <div className="absolute bottom-12 right-8 w-20 h-20 border-r border-b border-[#F7B73144] pointer-events-none" />

      {/* Floating hex rings */}
      <div className="absolute top-1/4 left-16 opacity-10 float-slow pointer-events-none">
        <div className="w-32 h-32 rounded-full border border-[#9B30FF] spin-slow" />
        <div className="absolute inset-4 rounded-full border border-[#00D4FF]" style={{ animation: 'spin-slow 15s linear infinite reverse' }} />
      </div>
      <div className="absolute bottom-1/4 right-16 opacity-10 float pointer-events-none">
        <div className="w-48 h-48 rounded-full border border-[#F7B731] spin-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 glass border-cyan rounded-full px-4 py-2 text-xs font-mono text-[#00D4FF] uppercase tracking-widest">
          <span className="status-dot status-online" />
          ETH México 2026 · Arbitrum Track · Live on Sepolia
        </div>

        {/* Main title */}
        <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-4 tracking-tighter">
          <span className="glitch text-white">NEXUS</span>
          <br />
          <span className="gradient-text-cyan">LATAM</span>
        </h1>

        {/* Typewriter subtitle */}
        <div className="flex items-center justify-center gap-3 mb-6 h-12">
          <span className="text-[#00D4FF55] font-orbitron text-sm tracking-widest uppercase">
            PROTOCOLO DE
          </span>
          <span className="font-orbitron text-xl md:text-2xl font-bold text-white tracking-wide min-w-[280px] text-left">
            {displayed}
            <span className="blink text-[#00D4FF]">_</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          5 agentes de IA que liquidan, financian y auditan el comercio B2B de LATAM
          en menos de <span className="text-[#F7B731] font-semibold">60 segundos</span>.
          Powered by{' '}
          <span className="text-[#00D4FF]">Arbitrum Stylus</span> ·{' '}
          <span className="text-[#9B30FF]">Claude AI</span> ·{' '}
          <span className="text-[#00FF94]">Bitso Business</span>
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/trades">
            <button className="btn-solid-cyan">
              LANZAR PROTOCOLO
            </button>
          </Link>
          <Link href="#agents">
            <button className="btn-neon">
              VER AGENTES IA
            </button>
          </Link>
          <a
            href="https://github.com/ALFA117/Nexus-Latam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-mono transition-colors border border-white/10 hover:border-white/20 px-5 py-3 rounded"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>

        {/* Live stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {[
            { value: '$1.2M+', label: 'Volumen 24h', color: '#00D4FF' },
            { value: '60s',     label: 'Settlement avg', color: '#F7B731' },
            { value: '5',       label: 'Agentes IA',     color: '#9B30FF' },
            { value: '0.3%',    label: 'Fee protocolo',  color: '#00FF94' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-orbitron text-2xl font-black" style={{ color: s.color, textShadow: `0 0 20px ${s.color}60` }}>
                {s.value}
              </p>
              <p className="text-white/40 text-xs uppercase tracking-wider mt-1 font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-white/50 text-xs font-mono tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#00D4FF] to-transparent" />
      </div>
    </section>
  );
}
