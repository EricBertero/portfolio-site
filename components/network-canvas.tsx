"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface Node3D {
  x: number;
  y: number;
  z: number;
}

interface Packet {
  edge: number;
  progress: number;
  speed: number;
  reverse: boolean;
}

const NODE_COUNT = 96;
const NEIGHBOURS = 3;
const MAX_PACKETS = 7;
const BASE_SPIN = 0.12; // rad/s, idle auto-rotation
const DRAG_SENSITIVITY = 0.008; // rad per pixel dragged
const MOMENTUM_DECAY = 0.94; // per frame, after release
const MAX_PITCH = 1.3; // radians; short of ±π/2 so the sphere never flattens edge-on
const SETTLE_EPSILON = 0.0005;

/** Evenly spread points on a unit sphere (Fibonacci lattice). */
function fibonacciSphere(count: number): Node3D[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
  });
}

/** Undirected edges from each node to its nearest neighbours. */
function nearestEdges(nodes: Node3D[], k: number): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, k)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        edges.push([i, j]);
      });
  });
  return edges;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * A sphere of network nodes with brand-colored packets travelling its links. Idles in a slow
 * auto-rotation and can be grabbed and spun with the mouse or a finger, flinging on
 * release. The canvas is decorative (aria-hidden). Pauses off-screen, and a visible Pause
 * button stops the idle motion (WCAG 2.2.2). Dragging still works when paused or under
 * prefers-reduced-motion, but the idle spin and release momentum are switched off.
 */
export function NetworkCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The Pause button (WCAG 2.2.2) freezes the idle motion; the loop reads it through a ref.
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const resumeRef = useRef<() => void>(() => {});

  const togglePaused = () => {
    const next = !paused;
    pausedRef.current = next;
    setPaused(next);
    if (!next) resumeRef.current();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    // Colors come from the theme tokens, re-read if the system color scheme changes.
    let lineColour = "white";
    let brandColour = "#52b788";
    const readColours = () => {
      const styles = getComputedStyle(document.documentElement);
      lineColour = styles.getPropertyValue("--foreground").trim() || lineColour;
      brandColour = styles.getPropertyValue("--brand").trim() || brandColour;
    };
    readColours();
    const colorScheme = window.matchMedia("(prefers-color-scheme: light)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // No idle motion under reduced motion or while paused; dragging still works either way.
    const still = () => reduceMotion.matches || pausedRef.current;

    const nodes = fibonacciSphere(NODE_COUNT);
    const edges = nearestEdges(nodes, NEIGHBOURS);
    const packets: Packet[] = [];

    let width = 0;
    let height = 0;
    let yaw = 0.6;
    let pitch = 0.35;
    let velYaw = 0;
    let velPitch = 0;
    let frame = 0;
    let visible = false;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const project = (node: Node3D) => {
      const cosA = Math.cos(yaw);
      const sinA = Math.sin(yaw);
      const x = node.x * cosA - node.z * sinA;
      const z1 = node.x * sinA + node.z * cosA;
      const y = node.y * Math.cos(pitch) - z1 * Math.sin(pitch);
      const z = node.y * Math.sin(pitch) + z1 * Math.cos(pitch);
      const radius = Math.min(width, height) * 0.4;
      const perspective = 2.6 / (2.6 - z);
      return {
        x: width / 2 + x * radius * perspective,
        y: height / 2 + y * radius * perspective,
        depth: (z + 1) / 2, // 0 = back, 1 = front
      };
    };

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const points = nodes.map(project);

      ctx!.lineWidth = 1;
      ctx!.strokeStyle = lineColour;
      for (const [a, b] of edges) {
        const pa = points[a];
        const pb = points[b];
        ctx!.globalAlpha = 0.04 + ((pa.depth + pb.depth) / 2) * 0.2;
        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
        ctx!.stroke();
      }

      ctx!.fillStyle = lineColour;
      for (const point of points) {
        ctx!.globalAlpha = 0.15 + point.depth * 0.6;
        ctx!.beginPath();
        ctx!.arc(point.x, point.y, 0.8 + point.depth * 1.6, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.fillStyle = brandColour;
      ctx!.shadowColor = brandColour;
      for (const packet of packets) {
        const [a, b] = edges[packet.edge];
        const from = points[packet.reverse ? b : a];
        const to = points[packet.reverse ? a : b];
        const t = packet.progress;
        const depth = from.depth + (to.depth - from.depth) * t;
        ctx!.globalAlpha = 0.35 + depth * 0.65;
        ctx!.shadowBlur = 6 + depth * 8;
        ctx!.beginPath();
        ctx!.arc(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t, 1.5 + depth * 1.5, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.shadowBlur = 0;
      ctx!.globalAlpha = 1;
    }

    const step = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;

      if (dragging) {
        // yaw/pitch already follow the pointer directly; nothing to integrate here.
      } else {
        const spin = still() ? 0 : BASE_SPIN;
        yaw += velYaw + spin * dt;
        pitch = clamp(pitch + velPitch, -MAX_PITCH, MAX_PITCH);
        velYaw *= MOMENTUM_DECAY;
        velPitch *= MOMENTUM_DECAY;
        if (Math.abs(velYaw) < SETTLE_EPSILON) velYaw = 0;
        if (Math.abs(velPitch) < SETTLE_EPSILON) velPitch = 0;
      }

      if (!still()) {
        for (let i = packets.length - 1; i >= 0; i--) {
          packets[i].progress += dt * packets[i].speed;
          if (packets[i].progress >= 1) packets.splice(i, 1);
        }
        if (packets.length < MAX_PACKETS && Math.random() < dt * 3) {
          packets.push({
            edge: Math.floor(Math.random() * edges.length),
            progress: 0,
            speed: 0.6 + Math.random() * 0.6,
            reverse: Math.random() < 0.5,
          });
        }
      }

      draw();

      const settled = !dragging && velYaw === 0 && velPitch === 0 && (still() || !visible);
      frame = settled ? 0 : requestAnimationFrame(step);
    };

    const ensureRunning = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(step);
      }
    };
    const play = () => {
      if (!visible || still()) return;
      ensureRunning();
    };
    resumeRef.current = play;
    const pause = () => {
      if (dragging) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onMotionChange = () => {
      if (reduceMotion.matches) {
        if (!dragging) {
          pause();
          velYaw = 0;
          velPitch = 0;
        }
        packets.length = 0;
        draw();
      } else {
        play();
      }
    };

    // --- Grab and spin. Only the canvas is touch-action: none, so the page still scrolls. ---
    const pointerDelta = (event: PointerEvent) => ({ dx: event.clientX - lastX, dy: event.clientY - lastY });

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      velYaw = 0;
      velPitch = 0;
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // No active pointer session to capture (e.g. a synthetic event); dragging still
        // works via the move/up listeners as long as the pointer stays over the canvas.
      }
      canvas.style.cursor = "grabbing";
      ensureRunning();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const { dx, dy } = pointerDelta(event);
      lastX = event.clientX;
      lastY = event.clientY;
      const dYaw = dx * DRAG_SENSITIVITY;
      const dPitch = -dy * DRAG_SENSITIVITY;
      yaw += dYaw;
      pitch = clamp(pitch + dPitch, -MAX_PITCH, MAX_PITCH);
      velYaw = dYaw;
      velPitch = dPitch;
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Nothing to release.
      }
      canvas.style.cursor = "grab";
      if (still()) {
        velYaw = 0;
        velPitch = 0;
        if (!visible) pause();
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    visibility.observe(canvas);
    reduceMotion.addEventListener("change", onMotionChange);
    const onSchemeChange = () => {
      readColours();
      draw();
    };
    colorScheme.addEventListener("change", onSchemeChange);

    return () => {
      colorScheme.removeEventListener("change", onSchemeChange);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      reduceMotion.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full cursor-grab touch-none" />
      {/* Nothing moves on its own under reduced motion, so there's nothing to pause there. */}
      <button
        type="button"
        onClick={togglePaused}
        className="absolute right-0 bottom-0 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-background/80 px-4 text-xs font-medium text-muted backdrop-blur-sm transition-colors hover:border-line-strong hover:text-foreground motion-reduce:hidden"
      >
        {paused ? (
          <PlayIcon className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <PauseIcon className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {paused ? "Resume animation" : "Pause animation"}
      </button>
    </div>
  );
}
