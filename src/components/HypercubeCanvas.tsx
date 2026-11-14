import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  hammingDistance,
  hammingWeight,
  latticeComplementNot,
  toBitString8,
  toHexString8,
} from '../engine/octeractEngine';
import { OcteractInput, OcteractOutput } from '../types/octeract';
import { Crosshair, Eye, Layers, Maximize2, ShieldAlert } from 'lucide-react';

interface HypercubeCanvasProps {
  input: OcteractInput;
  output: OcteractOutput;
  selectedVertex: number | null;
  onSelectVertex: (vertex: number) => void;
  highlightedClusterMask: string | null;
}

interface VertexCoord {
  v: number;
  x: number;
  y: number;
  weight: number;
}

const CANVAS_WIDTH = 760;
const CANVAS_HEIGHT = 500;

export const HypercubeCanvas: React.FC<HypercubeCanvasProps> = ({
  input,
  output,
  selectedVertex,
  onSelectVertex,
  highlightedClusterMask,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<number | null>(null);
  const [showQ8Edges, setShowQ8Edges] = useState<boolean>(true);
  const [showAntipodalAxis, setShowAntipodalAxis] = useState<boolean>(true);
  const [weightFilter, setWeightFilter] = useState<number | null>(null);

  // Precompute deterministic 2D Petrie-style harmonic coordinates for all 256 vertices of Q_8
  const coords = useMemo<VertexCoord[]>(() => {
    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2 - 14;
    const list: VertexCoord[] = [];

    for (let v = 0; v < 256; v++) {
      const w = hammingWeight(v);
      // Concentric shell radius based on Hamming weight w(v) in 0..8 plus fine sub-shell offset
      const baseRadius = 36 + w * 20;
      // Golden-ratio / Gray-code angular spread so nearby vertices don't pile onto one pixel
      const gray = v ^ (v >> 1);
      const primaryAngle = (gray / 256) * Math.PI * 2;
      let harmonicX = 0;
      let harmonicY = 0;
      for (let b = 0; b < 8; b++) {
        const bitAngle = (b * Math.PI) / 4;
        const dir = (v >> b) & 1 ? 1 : -1;
        harmonicX += Math.cos(bitAngle) * dir * 9;
        harmonicY += Math.sin(bitAngle) * dir * 9;
      }

      const x = cx + Math.cos(primaryAngle) * baseRadius * 1.18 + harmonicX;
      const y = cy + Math.sin(primaryAngle) * baseRadius * 0.88 + harmonicY;

      list.push({
        v,
        x,
        y,
        weight: w,
      });
    }
    return list;
  }, []);

  // Map vertex -> sign_id
  const vertexToSignMap = useMemo(() => {
    const map = new Map<number, string>();
    if (output.ocm) {
      for (const [signId, v] of Object.entries(output.ocm.assigned_vectors)) {
        map.set(v, signId);
      }
    }
    return map;
  }, [output.ocm]);

  const lockedSignIds = useMemo(
    () => new Set(input.locked_constraints.map((c) => c.sign_id)),
    [input.locked_constraints]
  );

  // Draw the Q_8 projection whenever state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle polar calibration rings
    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2 - 14;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
    ctx.lineWidth = 1;
    for (const r of [65, 130, 195]) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshair axes
    ctx.beginPath();
    ctx.moveTo(cx - 250, cy);
    ctx.lineTo(cx + 250, cy);
    ctx.moveTo(cx, cy - 205);
    ctx.lineTo(cx, cy + 205);
    ctx.stroke();

    // 1. Draw Q_8 background skeleton edges (1,024 edges of Hamming distance 1)
    if (showQ8Edges) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 0.6;
      for (let v = 0; v < 256; v++) {
        if (weightFilter !== null && coords[v].weight !== weightFilter) continue;
        for (let b = 0; b < 8; b++) {
          const u = v ^ (1 << b);
          if (u > v) {
            if (weightFilter !== null && coords[u].weight !== weightFilter) continue;
            ctx.beginPath();
            ctx.moveTo(coords[v].x, coords[v].y);
            ctx.lineTo(coords[u].x, coords[u].y);
            ctx.stroke();
          }
        }
      }
    }

    // 2. Highlight selected 3-cube subspace cluster if active
    const clusterPrefix = highlightedClusterMask
      ? parseInt(highlightedClusterMask.slice(0, 5), 2) << 3
      : null;

    if (clusterPrefix !== null && !Number.isNaN(clusterPrefix)) {
      const subVertices: number[] = [];
      for (let low = 0; low < 8; low++) {
        subVertices.push(clusterPrefix | low);
      }
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.48)';
      ctx.lineWidth = 1.6;
      for (let i = 0; i < subVertices.length; i++) {
        for (let j = i + 1; j < subVertices.length; j++) {
          const va = subVertices[i];
          const vb = subVertices[j];
          if (hammingDistance(va, vb) === 1) {
            ctx.beginPath();
            ctx.moveTo(coords[va].x, coords[va].y);
            ctx.lineTo(coords[vb].x, coords[vb].y);
            ctx.stroke();
          }
        }
      }
    }

    // 3. Draw all 256 vertices of (F_2)^8
    for (let v = 0; v < 256; v++) {
      const pt = coords[v];
      const matchesFilter = weightFilter === null || pt.weight === weightFilter;
      const inHighlightedCluster =
        clusterPrefix !== null && (v & 0b1111_1000) === clusterPrefix;

      if (!matchesFilter && !vertexToSignMap.has(v) && v !== selectedVertex) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.07)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      if (inHighlightedCluster) {
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle =
          pt.weight === 1
            ? 'rgba(56, 189, 248, 0.55)'
            : 'rgba(148, 163, 184, 0.28)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.weight === 1 ? 3.0 : 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Draw antipodal oppositional chord between selectedVertex and NOT selectedVertex
    if (selectedVertex !== null && showAntipodalAxis) {
      const anti = latticeComplementNot(selectedVertex);
      const p1 = coords[selectedVertex];
      const p2 = coords[anti];

      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.65)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.restore();

      // Draw antipodal vertex marker
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 6.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 5. If OCM is present, draw geodesic edges between mapped signs (d <= 2)
    if (output.ocm) {
      const entries = Object.entries(output.ocm.assigned_vectors);
      for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
          const va = entries[i][1];
          const vb = entries[j][1];
          const d = hammingDistance(va, vb);
          if (d <= 2) {
            ctx.strokeStyle = d === 1 ? '#a855f7' : 'rgba(168, 85, 247, 0.65)';
            ctx.lineWidth = d === 1 ? 2.4 : 1.7;
            ctx.beginPath();
            ctx.moveTo(coords[va].x, coords[va].y);
            ctx.lineTo(coords[vb].x, coords[vb].y);
            ctx.stroke();
          }
        }
      }

      // Draw mapped sign vertices and non-overlapping callout boxes
      const placedBoxes: { x: number; y: number; w: number; h: number }[] = [];

      for (const [signId, v] of entries) {
        const pt = coords[v];
        const isLocked = lockedSignIds.has(signId);
        const isSel = selectedVertex === v;

        if (isSel) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = isLocked ? '#f59e0b' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isLocked ? 7.2 : 5.8, 0, Math.PI * 2);
        ctx.fill();

        const label = `${signId} (${toHexString8(v)})`;
        ctx.font = '500 11px "IBM Plex Mono", monospace';
        const textWidth = ctx.measureText(label).width;
        const boxW = textWidth + 10;
        const boxH = 18;

        // Candidate offsets around the vertex to avoid overlapping previously placed callouts
        const candidateOffsets = [
          { dx: 12, dy: -6 },
          { dx: 12, dy: 16 },
          { dx: -boxW - 10, dy: -6 },
          { dx: -boxW - 10, dy: 16 },
          { dx: -boxW / 2, dy: -22 },
          { dx: -boxW / 2, dy: 24 },
        ];

        let chosenX = pt.x + 12;
        let chosenY = pt.y - 6;

        for (const off of candidateOffsets) {
          const cxBox = Math.max(8, Math.min(CANVAS_WIDTH - boxW - 8, pt.x + off.dx));
          const cyBox = Math.max(16, Math.min(CANVAS_HEIGHT - 55, pt.y + off.dy));
          const collides = placedBoxes.some(
            (b) =>
              cxBox < b.x + b.w + 4 &&
              cxBox + boxW + 4 > b.x &&
              cyBox - 13 < b.y + b.h &&
              cyBox - 13 + boxH > b.y
          );
          if (!collides) {
            chosenX = cxBox;
            chosenY = cyBox;
            break;
          }
        }

        placedBoxes.push({ x: chosenX, y: chosenY - 13, w: boxW, h: boxH });

        // Leader line from vertex to label box
        ctx.strokeStyle = isLocked
          ? 'rgba(245, 158, 11, 0.45)'
          : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(chosenX + 4, chosenY - 4);
        ctx.stroke();

        ctx.fillStyle = 'rgba(11, 15, 25, 0.9)';
        ctx.fillRect(chosenX - 4, chosenY - 12, boxW, boxH);
        ctx.strokeStyle = isLocked
          ? 'rgba(245, 158, 11, 0.4)'
          : 'rgba(51, 65, 85, 0.8)';
        ctx.strokeRect(chosenX - 4, chosenY - 12, boxW, boxH);

        ctx.fillStyle = isLocked ? '#fde68a' : '#f1f5f9';
        ctx.fillText(label, chosenX + 1, chosenY + 1);
      }
    }

    // 6. Highlight selected or hovered non-sign vertex
    const activeProbe = hoveredVertex ?? selectedVertex;
    if (activeProbe !== null) {
      const pt = coords[activeProbe];
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [
    coords,
    output.ocm,
    selectedVertex,
    hoveredVertex,
    showQ8Edges,
    showAntipodalAxis,
    weightFilter,
    highlightedClusterMask,
    lockedSignIds,
    vertexToSignMap,
  ]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    let closestV: number | null = null;
    let minDistSq = 180; // within ~13.4px radius
    for (let v = 0; v < 256; v++) {
      const dx = coords[v].x - mx;
      const dy = coords[v].y - my;
      const dSq = dx * dx + dy * dy;
      if (dSq < minDistSq) {
        minDistSq = dSq;
        closestV = v;
      }
    }
    setHoveredVertex(closestV);
  };

  const handleCanvasClick = () => {
    if (hoveredVertex !== null) {
      onSelectVertex(hoveredVertex);
    }
  };

  const inspectedV = hoveredVertex ?? selectedVertex ?? 0;
  const inspectedSign = vertexToSignMap.get(inspectedV);
  const antipodalV = latticeComplementNot(inspectedV);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
      {/* Header & Canvas Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 tracking-tight">
            Q₈ Hypercube Petrie Constellation Projection
          </h2>
          <p className="text-xs text-slate-400">
            256 vertices in (𝔽₂)⁸ · 1,024 Hamming-1 edges · Click any vertex to lock probe
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowQ8Edges((prev) => !prev)}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              showQ8Edges
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Skeleton Edges
          </button>
          <button
            type="button"
            onClick={() => setShowAntipodalAxis((prev) => !prev)}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              showAntipodalAxis
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Antipodal Axis (¬v)
          </button>
          <select
            aria-label="Filter by Hamming Weight"
            value={weightFilter === null ? 'all' : String(weightFilter)}
            onChange={(e) =>
              setWeightFilter(e.target.value === 'all' ? null : Number(e.target.value))
            }
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 font-mono"
          >
            <option value="all">All Weights w(v) 0..8</option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
              <option key={w} value={w}>
                Shell w(v) = {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Canvas Container with Scalability Halt Overlay if N > 256 */}
      <div className="relative rounded-md overflow-hidden border border-slate-800 bg-[#070A12]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          data-testid="q8-constellation-canvas"
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredVertex(null)}
          onClick={handleCanvasClick}
          className="w-full h-[420px] block cursor-crosshair"
        />

        {output.scalability.halted && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
            <ShieldAlert className="w-10 h-10 text-rose-400 mb-3" />
            <h3 className="text-base font-semibold text-rose-200 mb-1">
              8-Bit Octeract Capacity Exceeded (N = {output.scalability.unique_signs_n} &gt; 256)
            </h3>
            <p className="text-xs text-slate-300 max-w-md mb-4 leading-relaxed">
              {output.scalability.explanation}
            </p>
            <div className="grid grid-cols-3 gap-4 bg-slate-900/90 border border-rose-500/30 rounded-md px-5 py-3 text-left font-mono text-xs">
              <div>
                <div className="text-slate-400 text-[11px]">REQUIRED HYPERCUBE</div>
                <div className="text-rose-300 font-semibold">
                  {output.scalability.hypercube_designation}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">DIMENSION (n)</div>
                <div className="text-slate-100 font-semibold">
                  n = {output.scalability.required_dimension_n} axes
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">STATE CAPACITY (2^n)</div>
                <div className="text-emerald-300 font-semibold">
                  {output.scalability.state_space_capacity} vertices
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Telemetry Corner HUD */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border border-slate-800/90 rounded px-3 py-1.5 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-sky-400 flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5" />
              VERTEX {toHexString8(inspectedV)}
            </span>
            <span className="text-slate-300">BITS: {toBitString8(inspectedV)}</span>
            <span className="text-slate-400">w(v) = {hammingWeight(inspectedV)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-rose-300">
              ¬v: {toHexString8(antipodalV)} ({toBitString8(antipodalV)}, d=8)
            </span>
            <span className="text-amber-300">
              {inspectedSign ? `SIGN: ${inspectedSign}` : 'UNASSIGNED STATE'}
            </span>
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-1">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sky-300 font-mono">● Mapped Sign Vertex</span>
          <span className="text-amber-300 font-mono">● Locked Constraint Root</span>
          <span className="text-purple-300 font-mono">― Geodesic Neighbor (d ≤ 2)</span>
          <span className="text-rose-300 font-mono">--- Antipodal Pair (v, ¬v)</span>
        </div>
        <div className="font-mono text-slate-400">
          |Aut(Q₈)| = 10,321,920 · 256 States
        </div>
      </div>
    </div>
  );
};
