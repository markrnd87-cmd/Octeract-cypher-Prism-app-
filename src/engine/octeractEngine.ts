import {
  FeatureSchema8,
  KFaceSpec,
  LigaturePathEvaluation,
  NonLinguisticTriggers,
  OcmResult,
  OcteractInput,
  OcteractOutput,
  RecommendedPathway,
  ScalabilityStatus,
  ScriptTypology,
  SignRecord,
  StructuralResonanceMatch,
  SubspaceCluster,
} from '../types/octeract';

// ============================================================================
// 1. STRUCTURAL TRINITY & Q_8 ALGEBRAIC CORE
// ============================================================================

export const BOTTOM_ZERO = 0b0000_0000;
export const TOP_ONES = 0b1111_1111;

/** Generative Archetypes: the 8 standard basis vectors / lattice atoms (Hamming weight 1). */
export const BASIS_ATOMS: readonly number[] = [
  0b0000_0001,
  0b0000_0010,
  0b0000_0100,
  0b0000_1000,
  0b0001_0000,
  0b0010_0000,
  0b0100_0000,
  0b1000_0000,
];

export const OCTERACT_SYMMETRY_GROUP_ORDER = 10_321_920; // 2^8 * 8!

/** Table 1.2: Octeract Geometric-Computational Correspondence (k-faces of Q_8). */
export const OCTERACT_K_FACES: readonly KFaceSpec[] = [
  { geometric_element: "Vertex",    dimension_k: 0, free_bits_k: 0, fixed_bits: 8, subspace_size: 1,   total_count_in_q8: 256 },
  { geometric_element: "Edge",      dimension_k: 1, free_bits_k: 1, fixed_bits: 7, subspace_size: 2,   total_count_in_q8: 1024 },
  { geometric_element: "Square",    dimension_k: 2, free_bits_k: 2, fixed_bits: 6, subspace_size: 4,   total_count_in_q8: 1792 },
  { geometric_element: "Cube",      dimension_k: 3, free_bits_k: 3, fixed_bits: 5, subspace_size: 8,   total_count_in_q8: 1792 },
  { geometric_element: "Tesseract", dimension_k: 4, free_bits_k: 4, fixed_bits: 4, subspace_size: 16,  total_count_in_q8: 1120 },
  { geometric_element: "5-cube",    dimension_k: 5, free_bits_k: 5, fixed_bits: 3, subspace_size: 32,  total_count_in_q8: 448 },
  { geometric_element: "6-cube",    dimension_k: 6, free_bits_k: 6, fixed_bits: 2, subspace_size: 64,  total_count_in_q8: 112 },
  { geometric_element: "Hepteract", dimension_k: 7, free_bits_k: 7, fixed_bits: 1, subspace_size: 128, total_count_in_q8: 16 },
  { geometric_element: "Octeract",  dimension_k: 8, free_bits_k: 8, fixed_bits: 0, subspace_size: 256, total_count_in_q8: 1 },
];

/** Vector Addition in GF(2)^8 / Group Operation in (Z/2Z)^8 (bitwise XOR). */
export function gf2Xor(a: number, b: number): number {
  return (a ^ b) & 0xff;
}

/** Boolean Lattice Meet (bitwise AND / subspace projection). */
export function latticeMeetAnd(a: number, b: number): number {
  return a & b & 0xff;
}

/** Boolean Lattice Join (bitwise OR). */
export function latticeJoinOr(a: number, b: number): number {
  return (a | b) & 0xff;
}

/** Oppositional Archetype / Point Reflection through hypercube center (bitwise NOT). */
export function latticeComplementNot(v: number): number {
  return (~v) & 0xff;
}

/** Boolean Lattice Partial Order: a <= b iff (a & b) == a. */
export function isSubsetOf(a: number, b: number): boolean {
  return ((a & b) & 0xff) === (a & 0xff);
}

/** Hamming weight w(v): number of '1' bits in 8-bit integer. */
export function hammingWeight(v: number): number {
  let x = v & 0xff;
  let count = 0;
  while (x > 0) {
    count += x & 1;
    x >>= 1;
  }
  return count;
}

/** Fundamental Metric: Hamming distance d(a, b) = w(a XOR b). */
export function hammingDistance(a: number, b: number): number {
  return hammingWeight(gf2Xor(a, b));
}

/** Formats vertex as 8-bit binary string. */
export function toBitString8(v: number): string {
  return (v & 0xff).toString(2).padStart(8, '0');
}

/** Formats vertex as 0xXX hex string. */
export function toHexString8(v: number): string {
  return '0x' + (v & 0xff).toString(16).toUpperCase().padStart(2, '0');
}

/** Encodes the 8 binary features into a unique 8-bit coordinate in (F_2)^8. */
export function encodeFeatures(f: FeatureSchema8): number {
  let v = 0;
  if (f.bit0_high_frequency) v |= 1 << 0;
  if (f.bit1_pos_initial) v |= 1 << 1;
  if (f.bit2_pos_final) v |= 1 << 2;
  if (f.bit3_func_class_primary) v |= 1 << 3;
  if (f.bit4_func_class_secondary) v |= 1 << 4;
  if (f.bit5_paleo_complex) v |= 1 << 5;
  if (f.bit6_paleo_curved) v |= 1 << 6;
  if (f.bit7_structural_role) v |= 1 << 7;
  return v & 0xff;
}

/** Decodes an 8-bit integer back into FeatureSchema8. */
export function decodeFeatures(v: number): FeatureSchema8 {
  return {
    bit0_high_frequency: Boolean((v >> 0) & 1),
    bit1_pos_initial: Boolean((v >> 1) & 1),
    bit2_pos_final: Boolean((v >> 2) & 1),
    bit3_func_class_primary: Boolean((v >> 3) & 1),
    bit4_func_class_secondary: Boolean((v >> 4) & 1),
    bit5_paleo_complex: Boolean((v >> 5) & 1),
    bit6_paleo_curved: Boolean((v >> 6) & 1),
    bit7_structural_role: Boolean((v >> 7) & 1),
  };
}

// ============================================================================
// 2. SCALABILITY PROTOCOL (SECTION 5.3) & PROFILING (SECTION 3.2)
// ============================================================================

export function countActiveTriggers(t: NonLinguisticTriggers): number {
  return (
    (t.extreme_corpus_brevity ? 1 : 0) +
    (t.statistical_isolation ? 1 : 0) +
    (t.manufacturing_paradox ? 1 : 0) +
    (t.deliberate_permanence ? 1 : 0)
  );
}

export function shouldTriggerPivot(t: NonLinguisticTriggers): boolean {
  return countActiveTriggers(t) >= 2;
}

export function evaluateScalability(uniqueSignCount: number): ScalabilityStatus {
  if (uniqueSignCount <= 256) {
    return {
      halted: false,
      unique_signs_n: uniqueSignCount,
      required_dimension_n: 8,
      hypercube_designation: "Octeract (8-cube)",
      state_space_capacity: 256,
      explanation: `Signary size N = ${uniqueSignCount} fits within the 256-state (F_2)^8 Octeract without loss of resolution.`,
    };
  } else {
    let n = 9;
    while ((1 << n) < uniqueSignCount && n < 24) {
      n += 1;
    }
    const designationMap: Record<number, string> = {
      9: "Enneact (9-cube)",
      10: "Dekeract (10-cube)",
      11: "Hendekeract (11-cube)",
      12: "Dodekeract (12-cube)",
    };
    const designation = designationMap[n] || `${n}-Hypercube`;
    const capacity = 1 << n;
    return {
      halted: true,
      unique_signs_n: uniqueSignCount,
      required_dimension_n: n,
      hypercube_designation: designation,
      state_space_capacity: capacity,
      explanation: `HALTED: Signary size N = ${uniqueSignCount} exceeds the 256-state capacity of the 8-bit Octeract. Scale framework to the ${n}-dimensional ${designation} (2^${n} = ${capacity} states) to preserve unique 1-to-1 sign vectors.`,
    };
  }
}

export function inferScriptTypology(uniqueSignCount: number, pivot: boolean): ScriptTypology {
  if (pivot) {
    return "Non-Linguistic / Structural System";
  } else if (uniqueSignCount >= 20 && uniqueSignCount <= 40) {
    return "Alphabet";
  } else if (uniqueSignCount >= 41 && uniqueSignCount <= 90) {
    return "Syllabary";
  } else if (uniqueSignCount > 90) {
    return "Logo-Syllabic";
  } else {
    return "Compact / Proto-Script";
  }
}

// ============================================================================
// 3. OPTIMAL CONSTELLATION MAPPING (SECTION 2.2: QAP VIA SIMULATED ANNEALING)
// ============================================================================

/** Compute QAP objective: Cost(\pi) = \sum_{i,j} S_{ij} * d(\pi(i), \pi(j)). */
export function computeQapCost(simMatrix: number[][], assignment: number[]): number {
  const n = assignment.length;
  let cost = 0;
  for (let i = 0; i < n; i++) {
    const row = simMatrix[i];
    if (!row) continue;
    for (let j = 0; j < n; j++) {
      const s = row[j] ?? 0;
      const d = hammingDistance(assignment[i], assignment[j]);
      cost += s * d;
    }
  }
  return cost;
}

/** Deterministic XorShift64* style 64-bit BigInt PRNG matching Rust DeterministicRng. */
export class DeterministicRng {
  private state: bigint;

  constructor(seed: number) {
    const s = BigInt(Math.max(0, Math.floor(seed)));
    this.state = s === 0n ? 0x9e3779b97f4a7c15n : s & 0xffffffffffffffffn;
  }

  nextU64(): bigint {
    let x = this.state;
    x = (x ^ (x << 13n)) & 0xffffffffffffffffn;
    x = (x ^ (x >> 7n)) & 0xffffffffffffffffn;
    x = (x ^ (x << 17n)) & 0xffffffffffffffffn;
    this.state = x;
    return x;
  }

  nextUsize(bound: number): number {
    if (bound <= 1) return 0;
    return Number(this.nextU64() % BigInt(bound));
  }
}

/**
 * Executes Simulated Annealing over all 256 Octeract vertices using 2-opt moves
 * and an integer-scaled geometric cooling schedule, guaranteeing a bijection.
 */
export function runOptimalConstellationMapping(
  signs: SignRecord[],
  simMatrix: number[][],
  seed: number
): OcmResult {
  const n = signs.length;
  const pool: number[] = new Array(256).fill(0);
  const used: boolean[] = new Array(256).fill(false);
  const assignedIndices: number[] = [];

  for (const s of signs) {
    const preferred = s.initial_vector_u8 !== undefined
      ? (s.initial_vector_u8 & 0xff)
      : encodeFeatures(s.features);

    let slot = preferred;
    if (used[preferred]) {
      let bestCand = 0;
      let bestDist = 999;
      for (let cand = 0; cand < 256; cand++) {
        if (!used[cand]) {
          const dist = hammingDistance(preferred, cand);
          if (dist < bestDist) {
            bestDist = dist;
            bestCand = cand;
          }
        }
      }
      slot = bestCand;
    }
    used[slot] = true;
    assignedIndices.push(slot);
  }

  for (let idx = 0; idx < assignedIndices.length; idx++) {
    pool[idx] = assignedIndices[idx];
  }
  let tail = n;
  for (let cand = 0; cand < 256; cand++) {
    if (!used[cand] && tail < 256) {
      pool[tail] = cand;
      tail++;
    }
  }

  const initialCost = computeQapCost(simMatrix, pool.slice(0, n));
  let currentCost = initialCost;
  let bestPool = [...pool];
  let bestCost = initialCost;

  const rng = new DeterministicRng(seed);
  let tempQ1000 = 50_000n;
  const coolingNum = 985n;
  const coolingDen = 1000n;

  for (let step = 0; step < 1500; step++) {
    if (n === 0) break;
    const i = rng.nextUsize(n);
    const j = rng.nextUsize(256);
    if (i === j) continue;

    // 2-opt swap
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;

    const candidateCost = computeQapCost(simMatrix, pool.slice(0, n));

    let accept = false;
    if (candidateCost <= currentCost) {
      accept = true;
    } else {
      const delta = BigInt(candidateCost - currentCost);
      const threshold = (tempQ1000 * 1000n) / (tempQ1000 + delta * 100n + 1n);
      accept = (rng.nextU64() % 1000n) < threshold;
    }

    if (accept) {
      currentCost = candidateCost;
      if (currentCost < bestCost) {
        bestCost = currentCost;
        bestPool = [...pool];
      }
    } else {
      // Revert swap
      const revertTmp = pool[i];
      pool[i] = pool[j];
      pool[j] = revertTmp;
    }

    tempQ1000 = (tempQ1000 * coolingNum) / coolingDen;
    if (tempQ1000 < 10n) {
      tempQ1000 = 10n;
    }
  }

  const assignedVectors: Record<string, number> = {};
  for (let i = 0; i < signs.length; i++) {
    assignedVectors[signs[i].sign_id] = bestPool[i];
  }

  const reductionQ1000 =
    initialCost > 0 && initialCost >= bestCost
      ? Math.floor(((initialCost - bestCost) * 1000) / initialCost)
      : 0;

  return {
    initial_qap_cost: initialCost,
    optimized_qap_cost: bestCost,
    cost_reduction_ratio_q1000: reductionQ1000,
    assigned_vectors: assignedVectors,
  };
}

// ============================================================================
// 4. DETERMINISTIC BLAKE3-STYLE COMMITMENT DIGEST
// ============================================================================

export function computeModelCommitmentDigest(payload: string): string {
  // Deterministic 256-bit Mixing Hash (8x 32-bit state lanes) for pure-world commitment receipt
  const lanes = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  for (let i = 0; i < payload.length; i++) {
    const ch = payload.charCodeAt(i);
    const laneIdx = i & 7;
    lanes[laneIdx] = Math.imul(lanes[laneIdx] ^ ch, 0x9e3779b1) >>> 0;
    lanes[(laneIdx + 1) & 7] =
      (lanes[(laneIdx + 1) & 7] + ((lanes[laneIdx] << 7) | (lanes[laneIdx] >>> 25))) >>> 0;
  }
  return Array.from(lanes)
    .map((x) => x.toString(16).padStart(8, '0'))
    .join('');
}

// ============================================================================
// 5. FULL OCTERACT CYPHER EXECUTION PIPELINE
// ============================================================================

export function runOcteractCypher(req: OcteractInput): OcteractOutput {
  // Step 1: Section 5.3 Scalability Protocol Check
  const scalability = evaluateScalability(req.unique_sign_count);
  const pivot = shouldTriggerPivot(req.triggers);
  const typology = inferScriptTypology(req.unique_sign_count, pivot);

  if (scalability.halted) {
    const baseOut = {
      scalability,
      inferred_script_typology: typology,
      ocm: undefined,
      clusters: [],
      ligature_paths: [],
      paleogenetic_divergence_q1000: undefined,
      recommended_pathway: "ScaleToHigherDimensionalHypercube" as RecommendedPathway,
      structural_resonance_matches: [],
      propagated_constraints: {},
    };
    return {
      ...baseOut,
      model_commitment_blake3: computeModelCommitmentDigest(JSON.stringify(baseOut)),
    };
  }

  // Step 2: Section 2.2 Optimal Constellation Mapping (OCM)
  const ocm = runOptimalConstellationMapping(
    req.signs,
    req.similarity_matrix_q1000,
    req.sa_seed
  );

  // Step 3: Section 2.3 GSA Cluster Analysis (group by upper 5 fixed bits -> 3-cube subspaces)
  const cubeBuckets = new Map<number, string[]>();
  for (const [signId, vecU8] of Object.entries(ocm.assigned_vectors)) {
    const highPrefix = vecU8 & 0b1111_1000;
    const list = cubeBuckets.get(highPrefix) ?? [];
    list.push(signId);
    cubeBuckets.set(highPrefix, list);
  }

  const clusters: SubspaceCluster[] = Array.from(cubeBuckets.entries())
    .sort((a, b) => a[0] - b[0])
    .filter(([, members]) => members.length >= 2)
    .map(([prefix, members]) => ({
      subspace_mask_wildcard: (prefix >> 3).toString(2).padStart(5, '0') + '***',
      dimension_k: 3,
      member_sign_ids: members,
    }));

  // Step 4: Section 2.3 GSA Path Analysis (Compositional Ligatures)
  const ligaturePaths: LigaturePathEvaluation[] = [];
  for (const lig of req.ligature_candidates) {
    const vc = ocm.assigned_vectors[lig.composite_sign_id];
    const va = ocm.assigned_vectors[lig.base_sign_a_id];
    const vb = ocm.assigned_vectors[lig.base_sign_b_id];
    if (vc !== undefined && va !== undefined && vb !== undefined) {
      const dAb = hammingDistance(va, vb);
      const dAc = hammingDistance(va, vc);
      const dCb = hammingDistance(vc, vb);
      const onGeodesic = dAc + dCb === dAb;
      const xorSum = gf2Xor(va, vb);
      const epsilonWeight = hammingWeight(gf2Xor(vc, xorSum));

      ligaturePaths.push({
        composite_sign_id: lig.composite_sign_id,
        on_shortest_hamming_path: onGeodesic,
        xor_interaction_weight: epsilonWeight,
      });
    }
  }

  // Step 5: Section 2.3 GSA Paleogenetic Divergence Analysis (V_diff = V(S_1) XOR V(S_2))
  let paleogeneticDivergenceQ1000: number | undefined = undefined;
  if (req.homomorphic_pairs.length > 0) {
    let totalWeight = 0;
    let count = 0;
    for (const pair of req.homomorphic_pairs) {
      const vAnc = ocm.assigned_vectors[pair.ancestral_sign_id];
      if (vAnc !== undefined) {
        const vDiff = gf2Xor(vAnc, pair.descendant_sign_vector_u8);
        totalWeight += hammingWeight(vDiff);
        count += 1;
      }
    }
    if (count > 0) {
      paleogeneticDivergenceQ1000 = Math.floor((totalWeight * 1000) / count);
    }
  }

  // Step 6: Section 4 Non-Linguistic Pivot & Structural Resonance Analysis
  const recommendedPathway: RecommendedPathway = pivot
    ? "NonLinguisticStructuralResonance"
    : "ConstrainedLinguisticHypothesis";

  const structuralResonanceMatches: StructuralResonanceMatch[] = [];
  if (pivot) {
    for (const kface of OCTERACT_K_FACES) {
      const target = kface.total_count_in_q8;
      const tokens = req.total_token_count;
      if (Math.abs(tokens - target) <= 20) {
        structuralResonanceMatches.push({
          parameter_name: "total_token_count",
          observed_value: tokens,
          octeract_entity: `Q_8 ${kface.dimension_k}-faces (${kface.geometric_element})`,
          canonical_octeract_value: target,
        });
      }
    }
    // Also check unique_sign_count against k-face subspace sizes or counts
    for (const kface of OCTERACT_K_FACES) {
      const diff = Math.abs(req.unique_sign_count - kface.subspace_size);
      if (diff <= 16 && kface.dimension_k >= 5 && kface.dimension_k <= 6) {
        structuralResonanceMatches.push({
          parameter_name: "unique_sign_count",
          observed_value: req.unique_sign_count,
          octeract_entity: `Q_8 ${kface.dimension_k}-cube subspace capacity (${kface.geometric_element})`,
          canonical_octeract_value: kface.subspace_size,
        });
      }
    }
  }

  // Step 7: Section 3.4 Interactive Constraint Injection & Consequence Propagation
  const propagatedConstraints: Record<string, string[]> = {};
  for (const locked of req.locked_constraints) {
    const lockedV = ocm.assigned_vectors[locked.sign_id];
    if (lockedV !== undefined) {
      const affectedNeighbors: string[] = [];
      for (const [otherId, otherV] of Object.entries(ocm.assigned_vectors)) {
        if (otherId !== locked.sign_id) {
          const dist = hammingDistance(lockedV, otherV);
          if (dist <= 2) {
            affectedNeighbors.push(
              `${otherId} (d=${dist}, phonetic/semantic series bound to '${locked.locked_value}')`
            );
          }
        }
      }
      propagatedConstraints[locked.sign_id] = affectedNeighbors;
    }
  }

  const partialOutput = {
    scalability,
    inferred_script_typology: typology,
    ocm,
    clusters,
    ligature_paths: ligaturePaths,
    paleogenetic_divergence_q1000: paleogeneticDivergenceQ1000,
    recommended_pathway: recommendedPathway,
    structural_resonance_matches: structuralResonanceMatches,
    propagated_constraints: propagatedConstraints,
  };

  return {
    ...partialOutput,
    model_commitment_blake3: computeModelCommitmentDigest(JSON.stringify(partialOutput)),
  };
}
