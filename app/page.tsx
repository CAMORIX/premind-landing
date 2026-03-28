"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Monitor, Users } from "lucide-react";
import { ReactLenis } from "lenis/react";

/* ────────────────────────────────────────
   Navbar
──────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "기능", href: "#features" },
  { label: "사용 방법", href: "#how-it-works" },
];

function Navbar() {
  const rawY = useMotionValue(0);
  const smoothY = useSpring(rawY, { stiffness: 100, damping: 20, mass: 0.5 });

  // 0→1 over first 80px scroll
  const bgOpacity = useTransform(smoothY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(smoothY, [0, 80], [0, 1]);

  // scroll progress 0→1
  const rawProgress = useMotionValue(0);
  const progressWidth = useTransform(rawProgress, [0, 1], ["0%", "100%"]);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      rawY.set(y);
      rawProgress.set(max > 0 ? y / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [rawY, rawProgress]);

  // Active section via IntersectionObserver
  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.href.replace("#", ""));
    const map = new Map<string, number>();

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          map.set(e.target.id, e.intersectionRatio);
        });
        let best: string | null = null;
        let bestR = 0;
        map.forEach((ratio, id) => {
          if (ratio > bestR) {
            bestR = ratio;
            best = `#${id}`;
          }
        });
        if (bestR > 0) setActiveSection(best);
        else setActiveSection(null);
      },
      { threshold: [0, 0.1, 0.5] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ height: "64px" }}
    >
      {/* ── Frosted backdrop ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "oklch(0.09 0.018 44 / 0.92)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
          }}
        />
      </motion.div>

      {/* ── Bottom border ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          opacity: borderOpacity,
          background: "oklch(0.22 0.02 44)",
        }}
      />

      {/* ── Scroll progress line (above border) ── */}
      <div
        className="absolute bottom-0 left-0 h-px pointer-events-none overflow-hidden"
        style={{ width: "100%", zIndex: 1 }}
      >
        <motion.div
          className="h-full"
          style={{
            width: progressWidth,
            background:
              "linear-gradient(90deg, oklch(0.62 0.19 44), oklch(0.78 0.16 55))",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative h-full max-w-6xl mx-auto px-6 flex items-center">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center gap-2.5 shrink-0 select-none focus:outline-none"
          whileHover="hovered"
          initial="rest"
        >
          <motion.img
            src="/symbol.svg"
            className="w-7 h-7 shrink-0"
            alt="PREMIND symbol"
            variants={{
              rest: { scale: 1, rotate: 0 },
              hovered: { scale: 1.08, rotate: -4 },
            }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          />
          <motion.img
            src="/logo.svg"
            width={104}
            height={26}
            alt="PREMIND"
            variants={{
              rest: { x: 0, opacity: 0.85 },
              hovered: { x: 2, opacity: 1 },
            }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          />
        </motion.a>

        {/* Center nav — absolute so logo & CTA stay pinned */}
        <nav
          className="hidden md:flex items-center gap-0.5 absolute left-1/2 top-1/2"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = activeSection === href;
            return (
              <a
                key={href}
                href={href}
                onMouseEnter={() => setHoveredNav(href)}
                onMouseLeave={() => setHoveredNav(null)}
                className="relative px-4 py-[7px] rounded-lg text-[13px] font-medium select-none focus:outline-none"
                style={{
                  color: isActive
                    ? "oklch(0.92 0.004 55)"
                    : hoveredNav === href
                      ? "oklch(0.78 0 0)"
                      : "oklch(0.48 0 0)",
                  transition: "color 140ms ease",
                }}
              >
                {/* Shared sliding hover bg */}
                {hoveredNav === href && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "oklch(1 0 0 / 0.07)" }}
                    transition={{ type: "spring", stiffness: 460, damping: 34 }}
                  />
                )}

                <span className="relative z-10">{label}</span>

                {/* Active section dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -bottom-[3px] left-1/2 w-1 h-1 rounded-full"
                      style={{
                        background: "oklch(0.62 0.19 44)",
                        translateX: "-50%",
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 28,
                      }}
                    />
                  )}
                </AnimatePresence>
              </a>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] focus:outline-none"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block rounded-full origin-center"
                style={{
                  width: i === 1 ? "14px" : "20px",
                  height: "1.5px",
                  background: "oklch(0.55 0 0)",
                  marginLeft: i === 1 ? "auto" : undefined,
                }}
                animate={
                  mobileOpen
                    ? i === 0
                      ? { rotate: 45, y: 6.5, width: "20px" }
                      : i === 1
                        ? { opacity: 0, scaleX: 0 }
                        : { rotate: -45, y: -6.5 }
                    : i === 0
                      ? { rotate: 0, y: 0, width: "20px" }
                      : i === 1
                        ? { opacity: 1, scaleX: 1 }
                        : { rotate: 0, y: 0 }
                }
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              />
            ))}
          </button>

          {/* CTA */}

          {/* Mobile-only CTA (smaller) */}
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
            style={{
              background: "oklch(0.09 0.018 44 / 0.97)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderBottom: "1px solid oklch(0.20 0.02 44)",
            }}
          >
            <div className="px-6 py-3 flex flex-col gap-0.5">
              {NAV_ITEMS.map(({ label, href }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.04 + 0.05,
                    duration: 0.22,
                    ease: "easeOut",
                  }}
                  className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium"
                  style={{ color: "oklch(0.58 0 0)" }}
                >
                  {label}
                  <ArrowRight size={12} style={{ color: "oklch(0.35 0 0)" }} />
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="pt-2 pb-1"
              >
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl text-sm font-bold text-white"
                  style={{
                    background: "oklch(0.62 0.19 44)",
                    boxShadow: "0 4px 16px oklch(0.62 0.19 44 / 0.35)",
                  }}
                >
                  로그인 <ArrowRight size={13} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ────────────────────────────────────────
   Dot Grid
──────────────────────────────────────── */
function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  );
}

/* ────────────────────────────────────────
   Lecture Report — 히어로 분석 리포트 UI
──────────────────────────────────────── */
function LectureReport() {
  const data = [72, 78, 82, 85, 88, 91, 89, 87, 73, 65, 68, 75, 83, 87, 90, 88, 86, 87, 89, 91];
  const svgW = 200;
  const svgH = 48;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * svgW;
    const y = (svgH - 4) - ((v - min) / (max - min)) * (svgH - 10);
    return [x, y] as [number, number];
  });
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${svgW},${svgH} L 0,${svgH} Z`;

  const metrics = [
    { label: "청중 집중도", value: "91%", bar: 0.91, color: "oklch(0.62 0.19 44)" },
    { label: "강사 전달력", value: "8.4 / 10", bar: 0.84, color: "oklch(0.52 0.18 200)" },
    { label: "제스처 활용", value: "적극적", bar: 0.78, color: "oklch(0.60 0.17 80)" },
    { label: "발표 속도", value: "적정 범위", bar: 0.88, color: "oklch(0.62 0.19 44)" },
  ];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.11 0.018 44)",
        border: "1px solid oklch(0.20 0.02 44)",
        boxShadow:
          "0 0 0 1px oklch(0.28 0.03 44 / 0.4), 0 48px 100px oklch(0 0 0 / 0.6), 0 12px 32px oklch(0 0 0 / 0.3)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "oklch(0.20 0.02 44)" }}
      >
        <div>
          <div
            className="text-[11px] font-semibold mb-0.5"
            style={{ color: "oklch(0.92 0.005 55)" }}
          >
            마케팅 전략 특강
          </div>
          <div className="text-[10px]" style={{ color: "oklch(0.38 0 0)" }}>
            2025.03.28 · 48분 강의
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: "oklch(0.62 0.19 44 / 0.12)", border: "1px solid oklch(0.62 0.19 44 / 0.25)" }}
        >
          <span className="text-[10px] font-bold" style={{ color: "oklch(0.42 0 0)" }}>
            종합 점수
          </span>
          <span className="text-base font-black" style={{ color: "oklch(0.72 0.15 44)" }}>
            87
          </span>
          <span className="text-[10px]" style={{ color: "oklch(0.42 0 0)" }}>/ 100</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* 4-metric grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {metrics.map(({ label, value, bar, color }) => (
            <div
              key={label}
              className="rounded-xl p-3"
              style={{
                background: "oklch(0.14 0.018 44)",
                border: "1px solid oklch(0.20 0.02 44)",
              }}
            >
              <div className="text-[10px] mb-1.5" style={{ color: "oklch(0.40 0 0)" }}>
                {label}
              </div>
              <div
                className="text-sm font-black mb-2"
                style={{ color: "oklch(0.92 0.005 55)" }}
              >
                {value}
              </div>
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: "oklch(0.20 0.02 44)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${bar * 100}%`, background: color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Sparkline */}
        <div
          className="rounded-xl p-3"
          style={{
            background: "oklch(0.14 0.018 44)",
            border: "1px solid oklch(0.20 0.02 44)",
          }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-semibold" style={{ color: "oklch(0.40 0 0)" }}>
              청중 집중도 흐름
            </span>
            <span className="text-[10px]" style={{ color: "oklch(0.32 0 0)" }}>
              시작 → 종료
            </span>
          </div>
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full"
            style={{ height: "48px" }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.19 44)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="oklch(0.62 0.19 44)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#areaGrad)" />
            <path
              d={line}
              fill="none"
              stroke="oklch(0.62 0.19 44)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Improvement insight */}
        <div
          className="rounded-xl p-3 flex items-start gap-2.5"
          style={{
            background: "oklch(0.58 0.12 220 / 0.07)",
            border: "1px solid oklch(0.58 0.12 220 / 0.18)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full mt-[5px] shrink-0"
            style={{ background: "oklch(0.58 0.12 220)" }}
          />
          <div>
            <div
              className="text-[10px] font-bold mb-0.5"
              style={{ color: "oklch(0.58 0.12 220)" }}
            >
              개선 포인트
            </div>
            <div
              className="text-[11px] leading-relaxed"
              style={{ color: "oklch(0.48 0 0)" }}
            >
              23분~28분 구간에서 집중도가 18% 급락했습니다. 질문 유도나 사례 삽입을 권장합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────
   Animated Counter
──────────────────────────────────────── */
function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      setDisplay(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ────────────────────────────────────────
   Fade In on scroll
──────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────
   Section Overline
──────────────────────────────────────── */
function Overline({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5"
      style={{ color: light ? "oklch(0.70 0.14 44)" : "oklch(0.62 0.19 44)" }}
    >
      {children}
    </p>
  );
}

/* ────────────────────────────────────────
   Main
──────────────────────────────────────── */
export default function LandingPage() {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />

        {/* ── Hero ── */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden"
          style={{ background: "oklch(0.09 0.018 44)" }}
        >
          <DotGrid />

          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, oklch(0.62 0.19 44 / 0.14) 0%, transparent 65%)",
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto w-full">

            {/* ── 2-column: 텍스트 | 일러스트 ── */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-10 xl:gap-16 mb-16">

              {/* Left — text */}
              <div className="flex-1 text-center lg:text-left">
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-[11px] font-bold tracking-[0.22em] uppercase mb-8"
                  style={{ color: "oklch(0.62 0.19 44)" }}
                >
                  온·오프라인 강의 분석 플랫폼
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="font-black tracking-[-0.04em] mb-6"
                  style={{
                    fontSize: "clamp(2.6rem, 6vw, 5rem)",
                    lineHeight: 1.08,
                    color: "oklch(0.96 0.005 55)",
                  }}
                >
                  청중이 보이면,
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(120deg, oklch(0.75 0.17 44), oklch(0.82 0.13 58))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    강의가 바뀝니다
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.7 }}
                  className="text-base sm:text-lg leading-relaxed mb-10 mx-auto lg:mx-0"
                  style={{ color: "oklch(0.46 0 0)", maxWidth: "480px" }}
                >
                  오프라인 강의실 카메라 설치부터 온라인 강의 연동까지.
                  <br className="hidden sm:block" />
                  청중 집중도·강사 제스처·발표 흐름을 AI가 분석하고,
                  강의 종료 즉시 개선 리포트를 생성합니다.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
                >
                  <a
                    href="mailto:support@camorix.com"
                    className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-px"
                    style={{
                      background: "oklch(0.62 0.19 44)",
                      boxShadow: "0 4px 20px oklch(0.62 0.19 44 / 0.4)",
                    }}
                  >
                    도입 문의하기
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </a>
                  <a
                    href="#features"
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold border transition-all hover:border-white/20"
                    style={{
                      color: "oklch(0.55 0 0)",
                      borderColor: "oklch(0.22 0.02 44)",
                      background: "oklch(0.13 0.018 44)",
                    }}
                  >
                    기능 살펴보기
                  </a>
                </motion.div>
              </div>

              {/* Right — illustration */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex items-center justify-center shrink-0"
                style={{ width: "clamp(300px, 38vw, 500px)" }}
              >
                <img
                  src="/illust.png"
                  alt=""
                  className="w-full h-auto"
                  style={{ mixBlendMode: "screen" }}
                />
              </motion.div>
            </div>

            {/* ── LectureReport card ── */}
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl mx-auto"
            >
              <LectureReport />
            </motion.div>
          </div>

          {/* Bottom fade */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
            style={{
              background:
                "linear-gradient(to bottom, transparent, oklch(0.09 0.018 44))",
            }}
          />
        </section>

        {/* ── Features ── */}
        <section id="features" style={{ background: "oklch(0.978 0.003 60)" }}>
          <div className="max-w-6xl mx-auto px-6 py-28">
            <FadeIn className="mb-20">
              <Overline>핵심 기능</Overline>
              <h2
                className="text-3xl sm:text-4xl font-black tracking-[-0.025em]"
                style={{ color: "oklch(0.15 0.018 45)", lineHeight: 1.2 }}
              >
                강의를 개선하려면
                <br />
                먼저 데이터가 필요합니다
              </h2>
            </FadeIn>

            <div>
              {[
                {
                  num: "01",
                  icon: <Monitor size={18} />,
                  title: "강의실 카메라로 청중 전체를 실시간 분석합니다",
                  description:
                    "오프라인 강의실에 카메라를 설치하면, 32명의 청중이 지금 얼마나 집중하고 있는지 한눈에 보입니다. 집중도가 떨어지는 구간을 실시간으로 감지해 강의 중 즉각 대응할 수 있습니다.",
                  accent: "oklch(0.62 0.19 44)",
                },
                {
                  num: "02",
                  icon: <Brain size={18} />,
                  title: "강사의 전달력을 AI가 객관적으로 평가합니다",
                  description:
                    "말하는 속도, 시선 분배, 제스처, 질문 빈도—강사의 발표 방식을 AI가 정량 분석합니다. \"잘 가르쳤나\"를 막연히 느끼는 대신, 수치로 확인하고 다음 강의에서 정확히 개선하세요.",
                  accent: "oklch(0.52 0.18 200)",
                },
                {
                  num: "03",
                  icon: <BarChart3 size={18} />,
                  title: "강의 종료 즉시, 개선 리포트가 완성됩니다",
                  description:
                    "강의가 끝나면 분석 API가 자동으로 리포트를 생성합니다. 청중 집중도 추이, 강사 전달력 점수, 구간별 피드백까지—다음 강의를 위한 구체적인 개선점이 정리되어 전달됩니다.",
                  accent: "oklch(0.60 0.17 80)",
                },
              ].map(({ num, icon, title, description, accent }, i) => (
                <FadeIn key={num} delay={i * 0.07}>
                  <div
                    className="group grid grid-cols-[64px_1fr] md:grid-cols-[64px_1fr_40px] gap-6 md:gap-10 py-10 border-t items-start cursor-default"
                    style={{ borderColor: "oklch(0.88 0.006 55)" }}
                  >
                    {/* Step number */}
                    <span
                      className="text-3xl font-black leading-none tabular-nums select-none pt-0.5"
                      style={{ color: "oklch(0.86 0.008 55)" }}
                    >
                      {num}
                    </span>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${accent}16`, color: accent }}
                        >
                          {icon}
                        </div>
                        <h3
                          className="text-lg font-black"
                          style={{ color: "oklch(0.15 0.018 45)" }}
                        >
                          {title}
                        </h3>
                      </div>
                      <p
                        className="text-sm leading-[1.85]"
                        style={{ color: "oklch(0.48 0 0)", maxWidth: "580px" }}
                      >
                        {description}
                      </p>
                    </div>

                    {/* Arrow on hover */}
                    <div className="hidden md:flex items-start pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center border"
                        style={{ borderColor: accent, color: accent }}
                      >
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
              <div
                className="border-t"
                style={{ borderColor: "oklch(0.88 0.006 55)" }}
              />
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section style={{ background: "oklch(0.11 0.018 44)" }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                {
                  value: 3000,
                  suffix: "+",
                  label: "분석된 청중",
                  sub: "누적 기준",
                },
                {
                  value: 98,
                  suffix: "%",
                  label: "강사 만족도",
                  sub: "설문 응답 기준",
                },
                {
                  value: 50,
                  suffix: "+",
                  label: "분석 완료 강의",
                  sub: "누적 기준",
                },
                {
                  value: 12,
                  suffix: "개",
                  label: "도입 기관",
                  sub: "현재 운영 중",
                },
              ].map(({ value, suffix, label, sub }, i) => (
                <FadeIn key={label} delay={i * 0.07}>
                  <div>
                    <div
                      className="text-[2.5rem] font-black tabular-nums leading-none mb-2"
                      style={{ color: "oklch(0.96 0.005 55)" }}
                    >
                      <AnimatedNumber value={value} suffix={suffix} />
                    </div>
                    <div
                      className="text-sm font-bold mb-0.5"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.36 0 0)" }}
                    >
                      {sub}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" style={{ background: "oklch(1 0 0)" }}>
          <div className="max-w-6xl mx-auto px-6 py-28">
            <FadeIn className="mb-20">
              <Overline>시작하기</Overline>
              <h2
                className="text-3xl sm:text-4xl font-black tracking-[-0.025em]"
                style={{ color: "oklch(0.15 0.018 45)", lineHeight: 1.2 }}
              >
                3단계로 시작하는
                <br />
                강의 개선
              </h2>
            </FadeIn>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-14">
              {/* Dashed connector */}
              <div
                className="hidden md:block absolute top-[18px] left-[calc(16.5%+20px)] right-[calc(16.5%+20px)] h-px"
                style={{
                  borderTop: "1.5px dashed oklch(0.62 0.19 44 / 0.25)",
                }}
              />

              {[
                {
                  step: 1,
                  title: "환경 연동",
                  description:
                    "오프라인 강의실에 카메라를 설치하거나, 온라인 강의 플랫폼을 연동하세요. 초기 설정은 당일 완료됩니다.",
                  icon: <Users size={17} />,
                },
                {
                  step: 2,
                  title: "강의 중 실시간 분석",
                  description:
                    "강의가 진행되는 동안 AI가 청중 집중도와 강사의 전달력을 자동으로 측정합니다. 대시보드에서 현황을 확인하세요.",
                  icon: <Monitor size={17} />,
                },
                {
                  step: 3,
                  title: "개선 리포트 수령",
                  description:
                    "강의 종료 후 분석 API가 리포트를 자동 생성합니다. 다음 강의에서 무엇을 바꿔야 할지 구체적으로 알 수 있습니다.",
                  icon: <BarChart3 size={17} />,
                },
              ].map(({ step, title, description, icon }, i) => (
                <FadeIn key={step} delay={i * 0.1}>
                  <div>
                    {/* Icon box with step badge */}
                    <div className="relative w-10 h-10 mb-6">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: "oklch(0.97 0.003 60)",
                          border: "1px solid oklch(0.88 0.006 55)",
                          color: "oklch(0.62 0.19 44)",
                        }}
                      >
                        {icon}
                      </div>
                      <span
                        className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full text-[9px] font-black text-white flex items-center justify-center"
                        style={{ background: "oklch(0.62 0.19 44)" }}
                      >
                        {step}
                      </span>
                    </div>
                    <h3
                      className="text-base font-black mb-2"
                      style={{ color: "oklch(0.15 0.018 45)" }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.50 0 0)" }}
                    >
                      {description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: "oklch(0.09 0.018 44)" }}>
          <div className="relative max-w-6xl mx-auto px-6 py-28 text-center overflow-hidden">
            <DotGrid />
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px]"
              style={{
                background:
                  "radial-gradient(ellipse, oklch(0.62 0.19 44 / 0.13) 0%, transparent 65%)",
              }}
            />
            <FadeIn className="relative z-10">
              <Overline light>지금 바로 시작하세요</Overline>
              <h2
                className="font-black tracking-[-0.035em] mb-5"
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  lineHeight: 1.12,
                  color: "oklch(0.96 0.005 55)",
                }}
              >
                더 나은 강의는
                <br />
                <span style={{ color: "oklch(0.72 0.17 44)" }}>데이터에서</span> 시작됩니다
              </h2>
              <p
                className="text-base max-w-sm mx-auto mb-10 leading-relaxed"
                style={{ color: "oklch(0.44 0 0)" }}
              >
                지금 강의가 얼마나 잘 전달되는지 모른다면,
                <br />
                개선도 불가능합니다. PREMIND가 첫 번째 데이터를 만들어 드립니다.
              </p>
              <a
                href="mailto:support@camorix.com"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-px"
                style={{
                  background: "oklch(0.62 0.19 44)",
                  boxShadow: "0 8px 28px oklch(0.62 0.19 44 / 0.4)",
                }}
              >
                도입 문의하기
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </a>
            </FadeIn>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          style={{
            background: "oklch(0.07 0.015 44)",
            borderTop: "1px solid oklch(0.16 0.02 44)",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/symbol.svg"
                  className="w-6 h-6 shrink-0 opacity-30"
                  alt="PREMIND"
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.36 0 0)" }}
                >
                  주식회사 캐모릭스
                </span>
              </div>
              <div className="flex items-center gap-5">
                {["개인정보처리방침", "이용약관"].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="text-xs transition-colors hover:text-white/50"
                    style={{ color: "oklch(0.36 0 0)" }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div
              className="h-px"
              style={{ background: "oklch(0.16 0.02 44)" }}
            />

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[11px]" style={{ color: "oklch(0.48 0 0)" }}>
                  대표이사 정재민 · 사업자등록번호 594-86-03864
                </p>
                <p className="text-[11px]" style={{ color: "oklch(0.48 0 0)" }}>
                  강원특별자치도 춘천시 한림대학길 1 (옥천동) 창업보육센터
                  12112호
                </p>
              </div>
              <p
                className="text-[11px] shrink-0"
                style={{ color: "oklch(0.36 0 0)" }}
              >
                © 2026 Camorix Inc. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ReactLenis>
  );
}
