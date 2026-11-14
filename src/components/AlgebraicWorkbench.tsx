import React, { useState } from 'react';
import {
  BASIS_ATOMS,
  gf2Xor,
  hammingDistance,
  hammingWeight,
  isSubsetOf,
  latticeComplementNot,
  latticeJoinOr,
  latticeMeetAnd,
  OCTERACT_K_FACES,
  toBitString8,
  toHexString8,
} from '../engine/octeractEngine';
import { Calculator, CheckCircle2, Compass } from 'lucide-react';

interface AlgebraicWorkbenchProps {
  selectedVertexA: number;
  onSelectVertexA: (v: number) => void;
}

export const AlgebraicWorkbench: React.FC<AlgebraicWorkbenchProps> = ({
  selectedVertexA,
  onSelectVertexA,
}) => {
  const [vertexB, setVertexB] = useState<number>(0x51); // 01010001

  const a = selectedVertexA & 0xff;
  const b = vertexB & 0xff;

  const xorAb = gf2Xor(a, b);
  const meetAb = latticeMeetAnd(a, b);
  const joinAb = latticeJoinOr(a, b);
  const notA = latticeComplementNot(a);
  const distAb = hammingDistance(a, b);
  const subsetAb = isSubsetOf(a, b);

  // Verify the 4 formal theorems on live operands
  const selfInverseOk = gf2Xor(a, a) === 0 && gf2Xor(a, 0) === a;
  const metricBoundsOk = distAb === hammingWeight(xorAb) && distAb >= 0 && distAb <= 8;
  const antipodalOk = hammingDistance(a, notA) === 8;

  const toggleBitA = (bit: number) => {
    onSelectVertexA(a ^ (1 << bit));
  };

  const toggleBitB = (bit: number) => {
    setVertexB(b ^ (1 << bit));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 7 Cols: Live (F_2)^8 Structural Trinity Calculator */}
      <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col gap-5">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-sky-400" />
              (𝔽₂)⁸ Structural Trinity Algebraic Workbench
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive Vector Space GF(2)⁸ · Elementary Abelian Group (ℤ/2ℤ)⁸ · 8-Bit Boolean Lattice
            </p>
          </div>
          <span className="font-mono text-xs text-sky-400">
            Axis: Gf2NumericAxisN&lt;1&gt;
          </span>
        </div>

        {/* Interactive Bit Toggle Rows for Vertex A and Vertex B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vertex A */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-md p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-sky-300">
                OPERAND A (Active Canvas Vertex)
              </span>
              <span className="font-mono text-xs text-slate-200 tabular-nums">
                {toHexString8(a)} · dec {a} · w={hammingWeight(a)}
              </span>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {[7, 6, 5, 4, 3, 2, 1, 0].map((bit) => {
                const isSet = Boolean((a >> bit) & 1);
                return (
                  <button
                    key={bit}
                    type="button"
                    onClick={() => toggleBitA(bit)}
                    aria-label={`Toggle Operand A Bit ${bit}`}
                    className={`py-2 rounded font-mono text-xs font-semibold border transition-colors ${
                      isSet
                        ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div>{isSet ? '1' : '0'}</div>
                    <div className="text-[10px] font-normal opacity-75">b{bit}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vertex B */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-md p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-300">
                OPERAND B (Comparison Vector)
              </span>
              <span className="font-mono text-xs text-slate-200 tabular-nums">
                {toHexString8(b)} · dec {b} · w={hammingWeight(b)}
              </span>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {[7, 6, 5, 4, 3, 2, 1, 0].map((bit) => {
                const isSet = Boolean((b >> bit) & 1);
                return (
                  <button
                    key={bit}
                    type="button"
                    onClick={() => toggleBitB(bit)}
                    aria-label={`Toggle Operand B Bit ${bit}`}
                    className={`py-2 rounded font-mono text-xs font-semibold border transition-colors ${
                      isSet
                        ? 'bg-purple-500/25 border-purple-400 text-purple-200'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div>{isSet ? '1' : '0'}</div>
                    <div className="text-[10px] font-normal opacity-75">b{bit}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trinity Results Matrix */}
        <div className="overflow-x-auto border border-slate-800 rounded-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">OPERATION / LAW</th>
                <th className="py-2.5 px-3">SYMBOL</th>
                <th className="py-2.5 px-3">BINARY (𝔽₂)⁸</th>
                <th className="py-2.5 px-3">HEX</th>
                <th className="py-2.5 px-3">WEIGHT / METRIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono tabular-nums">
              <tr>
                <td className="py-2.5 px-3 font-sans text-slate-200">
                  GF(2)⁸ Vector Sum / Paleogenetic Diff
                </td>
                <td className="py-2.5 px-3 text-sky-400">A ⊕ B</td>
                <td className="py-2.5 px-3 text-slate-100">{toBitString8(xorAb)}</td>
                <td className="py-2.5 px-3 text-slate-300">{toHexString8(xorAb)}</td>
                <td className="py-2.5 px-3 text-amber-300">
                  d(A, B) = {distAb} bits
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans text-slate-200">
                  Boolean Lattice Meet (Subspace Shared)
                </td>
                <td className="py-2.5 px-3 text-emerald-400">A ∧ B</td>
                <td className="py-2.5 px-3 text-slate-100">{toBitString8(meetAb)}</td>
                <td className="py-2.5 px-3 text-slate-300">{toHexString8(meetAb)}</td>
                <td className="py-2.5 px-3 text-slate-400">
                  w(A ∧ B) = {hammingWeight(meetAb)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans text-slate-200">
                  Boolean Lattice Join (Feature Union)
                </td>
                <td className="py-2.5 px-3 text-purple-400">A ∨ B</td>
                <td className="py-2.5 px-3 text-slate-100">{toBitString8(joinAb)}</td>
                <td className="py-2.5 px-3 text-slate-300">{toHexString8(joinAb)}</td>
                <td className="py-2.5 px-3 text-slate-400">
                  w(A ∨ B) = {hammingWeight(joinAb)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans text-slate-200">
                  Oppositional Antipodal Complement
                </td>
                <td className="py-2.5 px-3 text-rose-400">¬A</td>
                <td className="py-2.5 px-3 text-slate-100">{toBitString8(notA)}</td>
                <td className="py-2.5 px-3 text-slate-300">{toHexString8(notA)}</td>
                <td className="py-2.5 px-3 text-rose-300">
                  d(A, ¬A) = {hammingDistance(a, notA)} (Max)
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans text-slate-200">
                  Boolean Partial Order Inclusion
                </td>
                <td className="py-2.5 px-3 text-slate-300">A ≤ B</td>
                <td className="py-2.5 px-3 text-slate-400">(A ∧ B) == A</td>
                <td className="py-2.5 px-3 text-slate-400">—</td>
                <td className="py-2.5 px-3 text-slate-200">
                  {subsetAb ? 'TRUE (Sub-feature)' : 'FALSE'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Generative Basis Atoms Selector */}
        <div>
          <div className="text-xs font-medium text-slate-300 mb-2">
            8 Generative Basis Archetypes (Atoms of Weight w(eᵢ) = 1) — Click to Load into Operand A:
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {BASIS_ATOMS.map((atom, idx) => (
              <button
                key={atom}
                type="button"
                onClick={() => onSelectVertexA(atom)}
                className={`px-2 py-1.5 rounded border font-mono text-xs transition-colors ${
                  a === atom
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>e{idx}</div>
                <div className="text-[10px] opacity-75">{toHexString8(atom)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live LexLean Theorem Verification Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-md p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-medium">
            Active LexLean Proof Predicates (prism/proof/v1):
          </span>
          <div className="flex flex-wrap items-center gap-4 font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              A ⊕ A = 0x00 ({selfInverseOk ? 'VERIFIED' : 'FAIL'})
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              0 ≤ d(A,B) ≤ 8 ({metricBoundsOk ? 'VERIFIED' : 'FAIL'})
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              d(A, ¬A) = 8 ({antipodalOk ? 'VERIFIED' : 'FAIL'})
            </span>
          </div>
        </div>
      </div>

      {/* Right 5 Cols: Table 1.2 Octeract Geometric-Computational Correspondence (k-faces) */}
      <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col gap-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-400" />
            Table 1.2: Q₈ k-Face Hierarchy & Subspaces
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Count of k-dimensional sub-cubes in Q₈ is C(8, k) · 2^(8−k), totaling 6,561 faces
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2 px-2.5">k-FACE</th>
                <th className="py-2 px-2.5">DIM k</th>
                <th className="py-2 px-2.5">FIXED BITS</th>
                <th className="py-2 px-2.5">CAPACITY (2^k)</th>
                <th className="py-2 px-2.5 text-right">COUNT IN Q₈</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono tabular-nums">
              {OCTERACT_K_FACES.map((kf) => (
                <tr key={kf.dimension_k} className="hover:bg-slate-900/50">
                  <td className="py-2 px-2.5 font-sans font-medium text-slate-200">
                    {kf.geometric_element}
                  </td>
                  <td className="py-2 px-2.5 text-sky-400">k = {kf.dimension_k}</td>
                  <td className="py-2 px-2.5 text-slate-400">{kf.fixed_bits} fixed</td>
                  <td className="py-2 px-2.5 text-slate-300">{kf.subspace_size} states</td>
                  <td className="py-2 px-2.5 text-right font-semibold text-purple-300">
                    {kf.total_count_in_q8.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-md p-3.5 text-xs text-slate-300 space-y-1.5">
          <div className="font-semibold text-slate-100">
            Hyperoctahedral Symmetry Group B₈ = Aut(Q₈)
          </div>
          <p className="text-slate-400 leading-relaxed">
            The symmetry group of the Octeract combines 2⁸ = 256 bit-flip translations with 8! = 40,320 axis permutations, yielding <span className="font-mono text-slate-200">10,321,920</span> isometric automorphisms that preserve Hamming distance.
          </p>
        </div>
      </div>
    </div>
  );
};
