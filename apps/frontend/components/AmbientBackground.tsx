'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue,
} from 'framer-motion';

/**
 * Fondo ambiental de toda la app (receta 2 de /diseno: terreno de ondas).
 * Para NEXUS LATAM el terreno es un océano de datos cian que ondula hacia el
 * horizonte (las rutas del comercio B2B), y encima flotan tres contenedores de
 * carga en CSS 3D real (lo que se liquida), en ámbar, cian y morado, a distintas
 * profundidades. El puntero inclina la cámara del terreno; el scroll desplaza
 * cada capa a su velocidad. Completo en la landing, tranquilo en el resto.
 */

function useCanvasLoop(
  el: HTMLCanvasElement | null,
  reduce: boolean,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void,
) {
  useEffect(() => {
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;
    const resize = () => {
      w = el.clientWidth; h = el.clientHeight;
      el.width = w * dpr; el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(ctx, w, h, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    if (reduce) return () => window.removeEventListener('resize', resize);
    const loop = (t: number) => { draw(ctx, w, h, t / 1000); raf = requestAnimationFrame(loop); };
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', vis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', vis);
    };
  }, [el, reduce, draw]);
}

function WaveTerrain({ reduce, dense, px }: { reduce: boolean; dense: boolean; px: MotionValue<number> }) {
  const [el, setEl] = useState<HTMLCanvasElement | null>(null);
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const css = getComputedStyle(document.documentElement);
    const cyan = css.getPropertyValue('--cyan').trim() || '#00D4FF';
    const purple = css.getPropertyValue('--purple').trim() || '#9B30FF';
    const small = w < 768;
    const COLS = small ? 26 : dense ? 56 : 40;
    const ROWS = small ? 16 : 26;
    const FOV = 500;
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    const tilt = px.get() * 0.15;
    for (let r = 0; r < ROWS; r++) {
      ctx.beginPath();
      for (let c = 0; c <= COLS; c++) {
        const x = (c / COLS - 0.5) * w * 2.2;
        const z = r * 60 + 40;
        const y = Math.sin(c * 0.35 + t * 0.8) * 22 + Math.cos(r * 0.45 + t * 0.6) * 18 + 160;
        const xr = x * Math.cos(tilt) - z * Math.sin(tilt);
        const zr = x * Math.sin(tilt) + z * Math.cos(tilt);
        const k = FOV / (FOV + zr);
        const sx = w / 2 + xr * k;
        const sy = h * (small ? 0.62 : 0.7) + y * k;
        if (c) ctx.lineTo(sx, sy); else ctx.moveTo(sx, sy);
      }
      // Las filas lejanas toman el morado: el horizonte se tiñe.
      ctx.strokeStyle = r > ROWS * 0.6 ? purple : cyan;
      ctx.globalAlpha = (dense ? 0.42 : 0.24) * (1 - r / ROWS);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [dense, px]);
  useCanvasLoop(el, reduce, draw);
  return <canvas ref={setEl} className="amb-terrain" />;
}

type Box = { x: string; y: string; w: number; tone: string; depth: number; spin: number; label: string; mobile?: boolean };
const BOXES: Box[] = [
  { x: '5%', y: '34%', w: 110, tone: 'var(--amber)', depth: 0.85, spin: 26, label: 'MX→AR', mobile: true },
  { x: '84%', y: '42%', w: 92, tone: 'var(--cyan)', depth: 0.6, spin: 32, label: 'LC-NFT', mobile: true },
  { x: '88%', y: '82%', w: 68, tone: 'var(--purple)', depth: 0.4, spin: 22, label: 'USDC' },
];

/** Contenedor de carga: caja de 6 caras con nervaduras y una etiqueta de ruta. */
function Container({ b }: { b: Box }) {
  const w = b.w, h = b.w * 0.42, d = b.w * 0.42;
  const faces: [string, number, number][] = [
    [`translateZ(${d / 2}px)`, w, h],
    [`rotateY(180deg) translateZ(${d / 2}px)`, w, h],
    [`rotateY(90deg) translateZ(${w / 2}px)`, d, h],
    [`rotateY(-90deg) translateZ(${w / 2}px)`, d, h],
    [`rotateX(90deg) translateZ(${h / 2}px)`, w, d],
    [`rotateX(-90deg) translateZ(${h / 2}px)`, w, d],
  ];
  return (
    <>
      {faces.map(([t, fw, fh], i) => (
        <span
          key={i}
          className="amb-box-face"
          style={{
            width: fw, height: fh, marginLeft: -fw / 2, marginTop: -fh / 2, transform: t,
            color: b.tone, fontSize: Math.max(9, b.w * 0.11),
          }}
        >
          {i < 2 ? b.label : null}
        </span>
      ))}
    </>
  );
}

function FloatBox({ b, i, px, py, scroll, reduce }: {
  b: Box; i: number; px: MotionValue<number>; py: MotionValue<number>; scroll: MotionValue<number>; reduce: boolean;
}) {
  const range = 40 * b.depth;
  const x = useTransform(px, (v) => v * range);
  const yp = useTransform(py, (v) => v * range);
  // scroll en píxeles (no en progreso 0–1): el progreso arrancaba en 1 cuando
  // el alto de la página aún no era el final, y todo salía desplazado.
  const ys = useTransform(scroll, (v) => -v * 0.18 * b.depth);
  const y = useTransform([yp, ys] as MotionValue<number>[], ([a, c]: number[]) => a + c);
  return (
    <motion.div
      className="amb-float"
      style={{ left: b.x, top: b.y, x: reduce ? 0 : x, y: reduce ? 0 : y, scale: 0.7 + b.depth * 0.5, opacity: 0.35 + b.depth * 0.45 }}
    >
      <div
        className={`amb-box ${reduce ? '' : 'amb-animate'}`}
        style={{ animationDuration: `${b.spin}s`, animationDelay: `${-i * 5}s` }}
      >
        <Container b={b} />
      </div>
    </motion.div>
  );
}

export function AmbientBackground() {
  const full = usePathname() === '/';
  const reduce = useReducedMotion() ?? false;
  const [mobile, setMobile] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const u = () => setMobile(mq.matches);
    u();
    mq.addEventListener('change', u);
    return () => mq.removeEventListener('change', u);
  }, []);

  const rx = useMotionValue(0), ry = useMotionValue(0);
  const px = useSpring(rx, { stiffness: 40, damping: 18 });
  const py = useSpring(ry, { stiffness: 40, damping: 18 });
  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const on = (e: PointerEvent) => {
      rx.set((e.clientX / window.innerWidth - 0.5) * 2);
      ry.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [reduce, rx, ry]);

  const { scrollY } = useScroll();
  const scroll = useSpring(scrollY, { stiffness: 60, damping: 20 });
  const terrainY = useTransform(scroll, (v) => Math.min(v * 0.04, 120));
  const auroraY = useTransform(scroll, (v) => Math.max(v * -0.06, -160));

  const boxes = BOXES.filter((b) => !mobile || b.mobile).slice(0, full ? 3 : 1);

  return (
    <div aria-hidden="true" className={`amb-root ${full ? 'amb-full' : 'amb-calm'}`}>
      <motion.div className="amb-aurora" style={{ y: reduce ? 0 : auroraY }} />
      <motion.div className="amb-layer" style={{ y: reduce ? 0 : terrainY }}>
        <WaveTerrain reduce={reduce} dense={full} px={px} />
      </motion.div>
      <div className="amb-stage">
        {boxes.map((b, i) => (
          <FloatBox key={b.label} b={b} i={i} px={px} py={py} scroll={scroll} reduce={reduce} />
        ))}
      </div>
      <div className="amb-vignette" />
    </div>
  );
}
