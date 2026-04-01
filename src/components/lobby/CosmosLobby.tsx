'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import type { LobbyParticipant } from '@/app/(app)/lobby/page';

/* ================================================================== */
/* COSMOS LOBBY — A alma do Sommar                                     */
/* Cada pessoa é uma estrela. Matches são constelações se formando.    */
/* ================================================================== */

const COSMOS_PALETTE = ['#1DFFA8', '#FF6B3D', '#FFB840', '#00D4FF', '#A855F7', '#EC4899'];

/* ── Helpers ─────────────────────────────────────────── */
function hex2rgb(h: string): [number, number, number] {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

/* ── Types ───────────────────────────────────────────── */
interface Star { x: number; y: number; r: number; rgb: [number, number, number]; a: number; phase: number; sp: number; vx: number; vy: number; }
interface OrbNode {
  p: LobbyParticipant;
  x: number; y: number;
  baseX: number; baseY: number;
  targetR: number; currentR: number;
  rgbA: [number, number, number]; rgbB: [number, number, number];
  phase: number;
  orbitR: number; orbitSp: number; orbitPh: number;
  breatheSp: number;
  ringAngle: number; ringSp: number;
}
interface ZigzagPoint { x: number; y: number; }
interface Synapse { chain: number[]; born: number; dur: number; peak: number; rgbA: [number, number, number]; zigzagCache: ZigzagPoint[][]; }
interface MatchToast { name: string; born: number; }

interface CosmosLobbyProps {
  participants: LobbyParticipant[];
  onPersonClick: (person: LobbyParticipant) => void;
}

/* ================================================================== */
export function CosmosLobby({ participants, onPersonClick }: CosmosLobbyProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const S = useRef({
    nodes: [] as OrbNode[],
    stars: [] as Star[],
    synapses: [] as Synapse[],
    toasts: [] as MatchToast[],
    w: 0, h: 0,
    animId: 0,
    t0: 0,
    hovered: -1,
    nextSyn: 2,
    nextToast: 5,
    // Pan/drag
    panX: 0, panY: 0,
    dragStart: null as { x: number; y: number; px: number; py: number } | null,
    isDragging: false,
  });
  const [cursor, setCursor] = useState<string>('default');

  /* ── Build ─────────────────────────────────────── */
  const buildStars = useCallback((w: number, h: number): Star[] =>
    Array.from({ length: 80 }, () => {
      const rgb = hex2rgb(COSMOS_PALETTE[Math.floor(Math.random() * COSMOS_PALETTE.length)]);
      return { x: Math.random() * w * 1.4 - w * 0.2, y: Math.random() * h * 1.4 - h * 0.2, r: 0.4 + Math.random() * 1.6, rgb, a: 0.08 + Math.random() * 0.25, phase: Math.random() * 6.28, sp: 0.15 + Math.random() * 0.5, vx: (Math.random() - 0.5) * 0.06, vy: (Math.random() - 0.5) * 0.06 };
    }), []);

  const buildNodes = useCallback((w: number, h: number): OrbNode[] => {
    const cx = w / 2, cy = h / 2;
    const maxR = Math.min(w, h) * 0.42;
    const sorted = [...participants].sort((a, b) => (a.match ? -1 : 0) - (b.match ? -1 : 0));
    return sorted.map((p, i) => {
      const angle = i * 2.399963 + Math.random() * 0.3;
      const d = 35 + Math.sqrt((i + 0.5) / sorted.length) * maxR;
      const bx = cx + Math.cos(angle) * d;
      const by = cy + Math.sin(angle) * d;
      return {
        p, x: bx, y: by, baseX: bx, baseY: by,
        targetR: p.match ? 18 : 12 + Math.random() * 4,
        currentR: 0.3,
        rgbA: hex2rgb(p.colorA), rgbB: hex2rgb(p.colorB),
        phase: Math.random() * 6.28,
        orbitR: 4 + Math.random() * 10,
        orbitSp: 0.08 + Math.random() * 0.18,
        orbitPh: Math.random() * 6.28,
        breatheSp: 0.3 + Math.random() * 0.5,
        ringAngle: 0, ringSp: 0.2 + Math.random() * 0.4,
      };
    });
  }, [participants]);

  /* ── Hit test (world coords) ───────────────────── */
  const hitTest = useCallback((wx: number, wy: number): number => {
    const { nodes } = S.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const d = dist(wx, wy, n.x, n.y);
      if (d < Math.max(n.currentR + 12, 20)) return i;
    }
    return -1;
  }, []);

  /* ── Screen → world coords ────────────────────── */
  const screen2world = useCallback((sx: number, sy: number) => {
    const c = canvasRef.current;
    if (!c) return { wx: 0, wy: 0 };
    const rect = c.getBoundingClientRect();
    const { panX, panY } = S.current;
    return {
      wx: (sx - rect.left) * (c.width / rect.width) - panX,
      wy: (sy - rect.top) * (c.height / rect.height) - panY,
    };
  }, []);

  /* ── Mouse/Touch events ────────────────────────── */
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const { wx, wy } = screen2world(e.clientX, e.clientY);
    const idx = hitTest(wx, wy);
    if (idx >= 0) {
      // Click on node, don't start drag
      S.current.isDragging = false;
      S.current.dragStart = null;
      return;
    }
    S.current.dragStart = { x: e.clientX, y: e.clientY, px: S.current.panX, py: S.current.panY };
    S.current.isDragging = false;
  }, [screen2world, hitTest]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const ds = S.current.dragStart;
    if (ds) {
      const dx = e.clientX - ds.x;
      const dy = e.clientY - ds.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) S.current.isDragging = true;
      S.current.panX = ds.px + dx;
      S.current.panY = ds.py + dy;
      setCursor('grabbing');
      return;
    }
    const { wx, wy } = screen2world(e.clientX, e.clientY);
    const idx = hitTest(wx, wy);
    S.current.hovered = idx;
    setCursor(idx >= 0 ? 'pointer' : 'default');
  }, [screen2world, hitTest]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!S.current.isDragging) {
      const { wx, wy } = screen2world(e.clientX, e.clientY);
      const idx = hitTest(wx, wy);
      if (idx >= 0) onPersonClick(S.current.nodes[idx].p);
    }
    S.current.dragStart = null;
    S.current.isDragging = false;
    setCursor('default');
  }, [screen2world, hitTest, onPersonClick]);

  /* ── Render loop ───────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = S.current;

    function resize() {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w; canvas.height = h;
      s.w = w; s.h = h;
      s.nodes = buildNodes(w, h);
      s.stars = buildStars(w, h);
      s.synapses = []; s.toasts = [];
      s.t0 = performance.now();
      s.panX = 0; s.panY = 0;
    }

    function draw(now: number) {
      if (!ctx) return;
      const { w, h, nodes, stars, synapses, toasts, panX, panY } = s;
      const t = (now - s.t0) / 1000;

      // Growth: 0→1 over 6s with smooth ease
      const gRaw = Math.min(1, t / 6);
      const g = gRaw < 0.5 ? 2 * gRaw * gRaw : 1 - Math.pow(-2 * gRaw + 2, 2) / 2; // ease in-out quad

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(panX, panY);

      /* ── Background stars ──────────────────── */
      for (const st of stars) {
        st.x += st.vx; st.y += st.vy;
        if (st.x < -20) st.x = w + 20;
        if (st.x > w + 20) st.x = -20;
        if (st.y < -20) st.y = h + 20;
        if (st.y > h + 20) st.y = -20;

        const pulse = 0.5 + 0.5 * Math.sin(t * st.sp + st.phase);
        const a = st.a * pulse;
        const gr = st.r * 4;
        const grad = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, gr);
        grad.addColorStop(0, `rgba(${st.rgb[0]},${st.rgb[1]},${st.rgb[2]},${a})`);
        grad.addColorStop(1, `rgba(${st.rgb[0]},${st.rgb[1]},${st.rgb[2]},0)`);
        ctx.beginPath();
        ctx.arc(st.x, st.y, gr, 0, 6.28);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      /* ── Update nodes ──────────────────────── */
      for (const n of nodes) {
        n.x = n.baseX + Math.cos(t * n.orbitSp + n.orbitPh) * n.orbitR;
        n.y = n.baseY + Math.sin(t * n.orbitSp * 0.7 + n.orbitPh + 1) * n.orbitR * 0.8;
        n.currentR = lerp(0.3, n.targetR, g);
        n.ringAngle = t * n.ringSp;
      }

      /* ── Spawn synapses (golden zigzag) ───── */
      if (g > 0.25 && t > s.nextSyn) {
        const count = nodes.length;
        if (count >= 2) {
          // 30% chance of multi-node chain (3-5 nodes), 70% pair
          const isChain = Math.random() < 0.3 && count >= 3;
          const chainLen = isChain ? 3 + Math.floor(Math.random() * 3) : 2; // 3-5 or 2
          const picked = new Set<number>();
          const chain: number[] = [];
          while (chain.length < Math.min(chainLen, count)) {
            const idx = Math.floor(Math.random() * count);
            if (!picked.has(idx)) { picked.add(idx); chain.push(idx); }
          }
          const hasMatch = chain.some(idx => nodes[idx].p.match);
          // Golden base color #FFB840 = rgb(255, 184, 64)
          const goldenRgb: [number, number, number] = hasMatch ? [255, 215, 100] : [255, 184, 64];
          synapses.push({
            chain, born: t,
            dur: 1.5 + Math.random() * 2,
            peak: hasMatch ? 0.5 : 0.15 + Math.random() * 0.35,
            rgbA: goldenRgb,
            zigzagCache: [], // will be computed during draw
          });
          if (synapses.length > 18) synapses.shift();
        }
        s.nextSyn = t + 0.3 + Math.random() * 0.5;
      }

      /* ── Helper: build zigzag path between two points ── */
      function buildZigzag(x1: number, y1: number, x2: number, y2: number, segments: number): ZigzagPoint[] {
        const pts: ZigzagPoint[] = [{ x: x1, y: y1 }];
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        // Perpendicular direction
        const perpX = -dy / (len || 1), perpY = dx / (len || 1);
        for (let i = 1; i < segments; i++) {
          const frac = i / segments;
          const baseX = x1 + dx * frac;
          const baseY = y1 + dy * frac;
          // Alternate direction, random magnitude 8-15px
          const sign = i % 2 === 0 ? 1 : -1;
          const mag = sign * (8 + Math.random() * 7);
          pts.push({ x: baseX + perpX * mag, y: baseY + perpY * mag });
        }
        pts.push({ x: x2, y: y2 });
        return pts;
      }

      /* ── Helper: interpolate along zigzag path ──────── */
      function zigzagLerp(pts: ZigzagPoint[], frac: number): { x: number; y: number } {
        if (pts.length < 2) return pts[0] || { x: 0, y: 0 };
        const totalSegs = pts.length - 1;
        const segF = frac * totalSegs;
        const segIdx = Math.min(Math.floor(segF), totalSegs - 1);
        const segT = segF - segIdx;
        return {
          x: pts[segIdx].x + (pts[segIdx + 1].x - pts[segIdx].x) * segT,
          y: pts[segIdx].y + (pts[segIdx + 1].y - pts[segIdx].y) * segT,
        };
      }

      /* ── Draw synapses (golden zigzag) ─────── */
      for (let si = synapses.length - 1; si >= 0; si--) {
        const syn = synapses[si];
        const age = t - syn.born;
        if (age > syn.dur) { synapses.splice(si, 1); continue; }

        // Validate all chain nodes exist
        const chainNodes = syn.chain.map(idx => nodes[idx]).filter(Boolean);
        if (chainNodes.length < 2) { synapses.splice(si, 1); continue; }

        const progress = age / syn.dur;
        const env = progress < 0.2 ? progress / 0.2 : progress > 0.7 ? (1 - progress) / 0.3 : 1;
        const alpha = syn.peak * env;
        if (alpha < 0.003) continue;

        // Build or refresh zigzag segments between chain nodes (rebuild each frame since nodes move)
        const allZigzagPts: ZigzagPoint[] = [];
        // Store segment lengths for pulse interpolation
        if (syn.zigzagCache.length !== chainNodes.length - 1) {
          syn.zigzagCache = [];
          for (let ci = 0; ci < chainNodes.length - 1; ci++) {
            syn.zigzagCache.push([]);
          }
        }
        for (let ci = 0; ci < chainNodes.length - 1; ci++) {
          const nFrom = chainNodes[ci], nTo = chainNodes[ci + 1];
          const segPts = buildZigzag(nFrom.x, nFrom.y, nTo.x, nTo.y, 8);
          syn.zigzagCache[ci] = segPts;
          // Concatenate all points (skip first of subsequent segments to avoid duplicates)
          if (ci === 0) {
            allZigzagPts.push(...segPts);
          } else {
            allZigzagPts.push(...segPts.slice(1));
          }
        }

        // Draw zigzag line
        const [r, g2, b] = syn.rgbA;
        ctx.beginPath();
        ctx.moveTo(allZigzagPts[0].x, allZigzagPts[0].y);
        for (let pi = 1; pi < allZigzagPts.length; pi++) {
          ctx.lineTo(allZigzagPts[pi].x, allZigzagPts[pi].y);
        }
        ctx.strokeStyle = `rgba(${r},${g2},${b},${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Traveling pulse along the full zigzag chain
        const pulseT = (age * 1.5 / syn.dur) % 1;
        const pulsePos = zigzagLerp(allZigzagPts, pulseT);
        const pr = 2.5 + syn.peak * 12;
        const pGrad = ctx.createRadialGradient(pulsePos.x, pulsePos.y, 0, pulsePos.x, pulsePos.y, pr);
        pGrad.addColorStop(0, `rgba(${r},${g2},${b},${Math.min(1, alpha * 1.8)})`);
        pGrad.addColorStop(1, `rgba(${r},${g2},${b},0)`);
        ctx.beginPath();
        ctx.arc(pulsePos.x, pulsePos.y, pr, 0, 6.28);
        ctx.fillStyle = pGrad;
        ctx.fill();
      }

      /* ── Draw person orbs ──────────────────── */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const r = n.currentR;
        if (r < 0.5) continue;
        const px = n.x, py = n.y;
        const isHov = s.hovered === i;

        const breathe = 0.88 + 0.12 * Math.sin(t * n.breatheSp + n.phase);
        const vr = r * breathe;

        // Large outer aura
        const auraR = vr * (isHov ? 4.5 : 3.2);
        const aA = (isHov ? 0.35 : 0.12 + 0.06 * breathe) * Math.min(1, g * 3);
        const [rA, gA, bA] = n.rgbA;
        const aGrad = ctx.createRadialGradient(px, py, vr * 0.15, px, py, auraR);
        aGrad.addColorStop(0, `rgba(${rA},${gA},${bA},${aA})`);
        aGrad.addColorStop(0.35, `rgba(${rA},${gA},${bA},${aA * 0.4})`);
        aGrad.addColorStop(1, `rgba(${rA},${gA},${bA},0)`);
        ctx.beginPath();
        ctx.arc(px, py, auraR, 0, 6.28);
        ctx.fillStyle = aGrad;
        ctx.fill();

        // Rotating ring (subtle orbital line)
        if (g > 0.4 && (n.p.match || isHov)) {
          const ringR = vr * 1.6;
          const ra = (g - 0.4) * 0.3 * (isHov ? 2 : 1);
          ctx.beginPath();
          ctx.ellipse(px, py, ringR, ringR * 0.35, n.ringAngle, 0, 6.28);
          ctx.strokeStyle = `rgba(${rA},${gA},${bA},${ra})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Core orb with multi-color gradient (colorA → white center → colorB)
        const [rB, gB, bB] = n.rgbB;
        const cGrad = ctx.createRadialGradient(
          px - vr * 0.2, py - vr * 0.25, vr * 0.02,
          px + vr * 0.1, py + vr * 0.1, vr
        );
        cGrad.addColorStop(0, `rgba(255,255,255,0.7)`);
        cGrad.addColorStop(0.25, `rgba(${rA},${gA},${bA},0.95)`);
        cGrad.addColorStop(0.6, `rgba(${lerp(rA, rB, 0.5)},${lerp(gA, gB, 0.5)},${lerp(bA, bB, 0.5)},0.85)`);
        cGrad.addColorStop(1, `rgba(${rB},${gB},${bB},0.5)`);
        ctx.beginPath();
        ctx.arc(px, py, vr, 0, 6.28);
        ctx.fillStyle = cGrad;
        ctx.fill();

        // Specular highlight (top-left)
        const specR = vr * 0.4;
        const sGrad = ctx.createRadialGradient(px - vr * 0.3, py - vr * 0.3, 0, px - vr * 0.3, py - vr * 0.3, specR);
        sGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
        sGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(px - vr * 0.3, py - vr * 0.3, specR, 0, 6.28);
        ctx.fillStyle = sGrad;
        ctx.fill();

        // Online dot
        if (n.p.online && g > 0.5) {
          const dR = Math.max(2, vr * 0.16);
          const dx = px + vr * 0.75, dy = py + vr * 0.75;
          ctx.beginPath(); ctx.arc(dx, dy, dR + 1.2, 0, 6.28); ctx.fillStyle = '#000'; ctx.fill();
          ctx.beginPath(); ctx.arc(dx, dy, dR, 0, 6.28); ctx.fillStyle = '#1DFFA8'; ctx.fill();
        }

        // Match sparkle
        if (n.p.match && g > 0.5) {
          const sa = 0.4 + 0.6 * Math.sin(t * 2 + n.phase);
          ctx.globalAlpha = sa * Math.min(1, (g - 0.5) * 4);
          const sz = Math.max(6, vr * 0.6);
          ctx.font = `${sz}px sans-serif`;
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.fillText('\u2726', px + vr * 0.6, py - vr * 0.5 + 3);
          ctx.globalAlpha = 1;
        }

        // Name (appears slowly)
        if (g > 0.65) {
          const na = Math.min(1, (g - 0.65) / 0.2) * (isHov ? 1 : 0.55);
          ctx.globalAlpha = na;
          ctx.font = `${isHov ? 11 : 9}px sans-serif`;
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(n.p.nome, px, py + vr + 6);
          ctx.globalAlpha = 1;
        }
      }

      /* ── "você" center ─────────────────────── */
      if (g > 0.4) {
        const cx = w / 2, cy = h / 2;
        const va = Math.min(0.7, (g - 0.4) * 1.2);
        const vb = 0.8 + 0.2 * Math.sin(t * 0.5);
        const vr = 4 * vb;

        // Soft ring
        ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 6.28);
        ctx.strokeStyle = `rgba(29,255,168,${va * 0.15})`; ctx.lineWidth = 0.6; ctx.stroke();

        // Core glow
        const vGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, vr * 4);
        vGrad.addColorStop(0, `rgba(29,255,168,${va * 0.5})`);
        vGrad.addColorStop(0.3, `rgba(29,255,168,${va * 0.15})`);
        vGrad.addColorStop(1, 'rgba(29,255,168,0)');
        ctx.beginPath(); ctx.arc(cx, cy, vr * 4, 0, 6.28); ctx.fillStyle = vGrad; ctx.fill();

        ctx.beginPath(); ctx.arc(cx, cy, vr, 0, 6.28);
        ctx.fillStyle = `rgba(29,255,168,${va * 0.7})`; ctx.fill();

        ctx.globalAlpha = va * 0.6;
        ctx.font = '8px sans-serif'; ctx.fillStyle = 'rgba(29,255,168,0.9)';
        ctx.textAlign = 'center'; ctx.fillText('você', cx, cy + 22);
        ctx.globalAlpha = 1;
      }

      ctx.restore(); // End pan transform

      /* ── Match toasts (screen space) ───────── */
      if (g > 0.6 && t > s.nextToast) {
        const matchNodes = nodes.filter(n => n.p.match);
        if (matchNodes.length > 0) {
          const mn = matchNodes[Math.floor(Math.random() * matchNodes.length)];
          toasts.push({ name: mn.p.nome, born: t });
          if (toasts.length > 3) toasts.shift();
        }
        s.nextToast = t + 8 + Math.random() * 12;
      }

      for (let ti = toasts.length - 1; ti >= 0; ti--) {
        const toast = toasts[ti];
        const age = t - toast.born;
        if (age > 4) { toasts.splice(ti, 1); continue; }
        const fadeIn = Math.min(1, age / 0.5);
        const fadeOut = age > 3 ? (4 - age) : 1;
        const a = fadeIn * fadeOut * 0.85;
        const y = h - 180 - ti * 40;
        ctx.globalAlpha = a;
        ctx.fillStyle = 'rgba(29,158,117,0.12)';
        ctx.beginPath();
        const tw = 200, th = 30, tx = w / 2 - tw / 2;
        ctx.roundRect(tx, y, tw, th, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(29,255,168,0.15)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.font = '10px sans-serif';
        ctx.fillStyle = 'rgba(29,255,168,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(`\u2726 Seu Ori conectou com ${toast.name}`, w / 2, y + 19);
        ctx.globalAlpha = 1;
      }

      s.animId = requestAnimationFrame(draw);
    }

    const initId = requestAnimationFrame(() => { resize(); s.animId = requestAnimationFrame(draw); });
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(initId); cancelAnimationFrame(s.animId); };
  }, [buildNodes, buildStars, hitTest]);

  return (
    <div className="absolute inset-0" style={{ top: '60px', bottom: '80px' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        style={{ cursor }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="img"
        aria-label={`Cosmos com ${participants.length} Oris. Arraste para explorar. Toque em uma estrela para ver o perfil.`}
      />
    </div>
  );
}
