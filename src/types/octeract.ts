/**
 * Table 2.1: General-Purpose 8-Bit Feature Vector Schema
 * Bit 0 (LSB) to Bit 7 (MSB) define the 8 orthogonal axes of Q_8.
 */
export interface FeatureSchema8 {
  bit0_high_frequency: boolean;      // 1. Frequency (e.g., > median)
  bit1_pos_initial: boolean;         // 2. Positional (Start) preference
  bit2_pos_final: boolean;           // 3. Positional (End) preference
  bit3_func_class_primary: boolean;  // 4. Functional Class 1 (e.g., logogram / basic sign)
  bit4_func_class_secondary: boolean;// 5. Functional Class 2 (e.g., votive context / fish variant)
  bit5_paleo_complex: boolean;       // 6. Paleographic Complexity (e.g., > 3 strokes / modifier)
  bit6_paleo_curved: boolean;        // 7. Paleographic Form (e.g., curved elements / numeral)
  bit7_structural_role: boolean;     // 8. Structural Role (e.g., pure vowel / jar-associated)
}

export interface SignRecord {
  sign_id: string;
  frequency: number;
  features: FeatureSchema8;
  initial_vector_u8?: number; // 0..255 in (F_2)^8
}

export interface NonLinguisticTriggers {
  extreme_corpus_brevity: boolean;   // e.g., Phaistos Disk (241 tokens), Cascajal Block (62 glyphs)
  statistical_isolation: boolean;    // Hapax legomenon script on 1 or very few artifacts
  manufacturing_paradox: boolean;    // High-investment stamps/type for single-use artifact
  deliberate_permanence: boolean;    // Intentionally fired clay in temporary-record context
}

export interface LigatureCandidate {
  composite_sign_id: string;
  base_sign_a_id: string;
  base_sign_b_id: string;
}

export interface HomomorphicPair {
  ancestral_sign_id: string;
  descendant_sign_vector_u8: number;
}

export interface LockedConstraint {
  sign_id: string;
  locked_value: string;
}

export interface OcteractInput {
  corpus_name: string;
  unique_sign_count: number;
  total_token_count: number;
  signs: SignRecord[];
  /** Symmetric N x N similarity matrix S_ij (scaled fixed-point u16: 0..1000) */
  similarity_matrix_q1000: number[][];
  ligature_candidates: LigatureCandidate[];
  homomorphic_pairs: HomomorphicPair[];
  triggers: NonLinguisticTriggers;
  locked_constraints: LockedConstraint[];
  sa_seed: number;
}

export interface ScalabilityStatus {
  halted: boolean;
  unique_signs_n: number;
  required_dimension_n: number;
  hypercube_designation: string; // e.g., "Octeract (8-cube)" or "Enneact (9-cube)"
  state_space_capacity: number;  // 2^n
  explanation: string;
}

export interface OcmResult {
  initial_qap_cost: number;
  optimized_qap_cost: number;
  cost_reduction_ratio_q1000: number;
  assigned_vectors: Record<string, number>; // sign_id -> 8-bit vertex (0..255)
}

export interface SubspaceCluster {
  subspace_mask_wildcard: string; // e.g., "01101***" (3-cube, size 8)
  dimension_k: number;
  member_sign_ids: string[];
}

export interface LigaturePathEvaluation {
  composite_sign_id: string;
  on_shortest_hamming_path: boolean;
  xor_interaction_weight: number; // w(V(C) XOR (V(A) XOR V(B)))
}

export interface StructuralResonanceMatch {
  parameter_name: string;
  observed_value: number;
  octeract_entity: string;
  canonical_octeract_value: number;
}

export type ScriptTypology =
  | "Alphabet"
  | "Syllabary"
  | "Logo-Syllabic"
  | "Compact / Proto-Script"
  | "Non-Linguistic / Structural System";

export type RecommendedPathway =
  | "ConstrainedLinguisticHypothesis"
  | "NonLinguisticStructuralResonance"
  | "ScaleToHigherDimensionalHypercube";

export interface OcteractOutput {
  scalability: ScalabilityStatus;
  inferred_script_typology: ScriptTypology;
  ocm?: OcmResult;
  clusters: SubspaceCluster[];
  ligature_paths: LigaturePathEvaluation[];
  paleogenetic_divergence_q1000?: number;
  recommended_pathway: RecommendedPathway;
  structural_resonance_matches: StructuralResonanceMatch[];
  propagated_constraints: Record<string, string[]>;
  model_commitment_blake3: string;
}

export interface KFaceSpec {
  geometric_element: string;
  dimension_k: number;
  free_bits_k: number;
  fixed_bits: number;
  subspace_size: number;
  total_count_in_q8: number;
}
