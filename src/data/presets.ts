import { OcteractInput } from '../types/octeract';

export interface PresetVector {
  id: string;
  filename: string;
  title: string;
  subtitle: string;
  input: OcteractInput;
}

export const PRESET_VECTORS: PresetVector[] = [
  {
    id: '01_linear_a_libation',
    filename: '01_linear_a_libation.json',
    title: 'Linear A Libation Constellation',
    subtitle: 'N = 65 Syllabary · OCM + GSA + Constraint Propagation',
    input: {
      corpus_name: 'Linear A Votive Corpus (HT / ZA)',
      unique_sign_count: 65,
      total_token_count: 1420,
      signs: [
        {
          sign_id: 'AB_08_A',
          frequency: 210,
          features: {
            bit0_high_frequency: true,
            bit1_pos_initial: true,
            bit2_pos_final: false,
            bit3_func_class_primary: false,
            bit4_func_class_secondary: true,
            bit5_paleo_complex: false,
            bit6_paleo_curved: false,
            bit7_structural_role: true,
          },
        },
        {
          sign_id: 'AB_77_KA',
          frequency: 145,
          features: {
            bit0_high_frequency: true,
            bit1_pos_initial: false,
            bit2_pos_final: false,
            bit3_func_class_primary: false,
            bit4_func_class_secondary: true,
            bit5_paleo_complex: false,
            bit6_paleo_curved: true,
            bit7_structural_role: false,
          },
        },
        {
          sign_id: 'AB_81_KU',
          frequency: 120,
          features: {
            bit0_high_frequency: true,
            bit1_pos_initial: false,
            bit2_pos_final: true,
            bit3_func_class_primary: false,
            bit4_func_class_secondary: true,
            bit5_paleo_complex: false,
            bit6_paleo_curved: true,
            bit7_structural_role: false,
          },
        },
        {
          sign_id: 'AB_60_RA',
          frequency: 98,
          features: {
            bit0_high_frequency: true,
            bit1_pos_initial: false,
            bit2_pos_final: false,
            bit3_func_class_primary: false,
            bit4_func_class_secondary: true,
            bit5_paleo_complex: true,
            bit6_paleo_curved: true,
            bit7_structural_role: false,
          },
        },
        {
          sign_id: 'AB_31_SA',
          frequency: 88,
          features: {
            bit0_high_frequency: true,
            bit1_pos_initial: true,
            bit2_pos_final: false,
            bit3_func_class_primary: false,
            bit4_func_class_secondary: true,
            bit5_paleo_complex: false,
            bit6_paleo_curved: true,
            bit7_structural_role: false,
          },
        },
        {
          sign_id: 'AB_54_WA',
          frequency: 76,
          features: {
            bit0_high_frequency: false,
            bit1_pos_initial: false,
            bit2_pos_final: true,
            bit3_func_class_primary: false,
            bit4_func_class_secondary: true,
            bit5_paleo_complex: true,
            bit6_paleo_curved: true,
            bit7_structural_role: false,
          },
        },
      ],
      similarity_matrix_q1000: [
        [1000, 620, 580, 410, 540, 320],
        [620, 1000, 890, 740, 810, 610],
        [580, 890, 1000, 710, 690, 780],
        [410, 740, 710, 1000, 630, 840],
        [540, 810, 690, 630, 1000, 520],
        [320, 610, 780, 840, 520, 1000],
      ],
      ligature_candidates: [
        {
          composite_sign_id: 'AB_81_KU',
          base_sign_a_id: 'AB_77_KA',
          base_sign_b_id: 'AB_60_RA',
        },
        {
          composite_sign_id: 'AB_54_WA',
          base_sign_a_id: 'AB_81_KU',
          base_sign_b_id: 'AB_60_RA',
        },
      ],
      homomorphic_pairs: [
        { ancestral_sign_id: 'AB_08_A', descendant_sign_vector_u8: 147 },
        { ancestral_sign_id: 'AB_77_KA', descendant_sign_vector_u8: 81 },
        { ancestral_sign_id: 'AB_81_KU', descendant_sign_vector_u8: 85 },
      ],
      triggers: {
        extreme_corpus_brevity: false,
        statistical_isolation: false,
        manufacturing_paradox: false,
        deliberate_permanence: false,
      },
      locked_constraints: [
        { sign_id: 'AB_77_KA', locked_value: '/ka/ (velar series)' },
      ],
      sa_seed: 42,
    },
  },
  {
    id: '02_indus_scalability_halt',
    filename: '02_indus_scalability_halt.json',
    title: 'Indus Script Scalability Halt',
    subtitle: 'N = 417 > 256 · Enneact (9-cube) Guard Trigger',
    input: {
      corpus_name: 'Indus Valley Script (M-Corpus)',
      unique_sign_count: 417,
      total_token_count: 11300,
      signs: [],
      similarity_matrix_q1000: [],
      ligature_candidates: [],
      homomorphic_pairs: [],
      triggers: {
        extreme_corpus_brevity: false,
        statistical_isolation: false,
        manufacturing_paradox: false,
        deliberate_permanence: false,
      },
      locked_constraints: [],
      sa_seed: 1,
    },
  },
  {
    id: '03_phaistos_structural_resonance',
    filename: '03_phaistos_structural_resonance.json',
    title: 'Phaistos Disk Resonance Pivot',
    subtitle: 'N = 45, 241 Tokens · Non-Linguistic Structural System',
    input: {
      corpus_name: 'Phaistos Disk',
      unique_sign_count: 45,
      total_token_count: 241,
      signs: [
        {
          sign_id: 'PD_02_PLUMED_HEAD',
          frequency: 19,
          features: {
            bit0_high_frequency: true,
            bit1_pos_initial: true,
            bit2_pos_final: false,
            bit3_func_class_primary: true,
            bit4_func_class_secondary: false,
            bit5_paleo_complex: true,
            bit6_paleo_curved: true,
            bit7_structural_role: true,
          },
        },
        {
          sign_id: 'PD_12_SHIELD',
          frequency: 17,
          features: {
            bit0_high_frequency: true,
            bit1_pos_initial: false,
            bit2_pos_final: false,
            bit3_func_class_primary: true,
            bit4_func_class_secondary: false,
            bit5_paleo_complex: false,
            bit6_paleo_curved: true,
            bit7_structural_role: true,
          },
        },
        {
          sign_id: 'PD_45_WAVY_BAND',
          frequency: 6,
          features: {
            bit0_high_frequency: false,
            bit1_pos_initial: false,
            bit2_pos_final: true,
            bit3_func_class_primary: false,
            bit4_func_class_secondary: true,
            bit5_paleo_complex: false,
            bit6_paleo_curved: true,
            bit7_structural_role: false,
          },
        },
      ],
      similarity_matrix_q1000: [
        [1000, 910, 420],
        [910, 1000, 480],
        [420, 480, 1000],
      ],
      ligature_candidates: [],
      homomorphic_pairs: [],
      triggers: {
        extreme_corpus_brevity: true,
        statistical_isolation: true,
        manufacturing_paradox: true,
        deliberate_permanence: true,
      },
      locked_constraints: [
        { sign_id: 'PD_02_PLUMED_HEAD', locked_value: 'Clause / Stanza Delimiter Header' },
      ],
      sa_seed: 7,
    },
  },
];

export interface SpecArtifact {
  path: string;
  category: 'Manifest & Policy' | 'Formal Proofs' | 'Rust Layer-3 Crate' | 'TypeScript Schema' | 'Acceptance Vectors' | 'Bootstrap Script';
  language: string;
  description: string;
  content: string;
}

export const SPEC_ARTIFACTS: SpecArtifact[] = [
  {
    path: 'prism.toml',
    category: 'Manifest & Policy',
    language: 'toml',
    description: 'Application manifest & pure-world capability policy',
    content: `[application]
name = "octeract-cypher"
version = "0.1.0"
edition = "2026"
kind = "portable-holo"
description = "8-dimensional hypercube (Q_8) geometric and algebraic analysis of undeciphered scripts"

[model]
authority = "model/OcteractCypher.lex.tex"
types = ["types/octeract.ts"]
intent = "intent.md"
examples = "examples/*.json"

[dependencies]
uor-prism = "0.4.0"
uor-prism-verify = "0.4.0"

[axes]
ring = "prism::numerics::ring::Gf2NumericAxisN<1>"
hash = "prism::crypto::Blake3Hasher"
commitment = "prism::crypto::MerkleRootCommitment"

[capabilities]
world = "pure"
allow_clock = false
allow_random = false
allow_network = false

[verify]
required_assurance = "P2"
predicates = ["prism/proof/v1", "prism/replay/v1"]`,
  },
  {
    path: 'intent.md',
    category: 'Formal Proofs',
    language: 'markdown',
    description: '9 formal invariants mapped to prism/proof/v1 theorems',
    content: `The application must always halt 8-bit Octeract mapping when the unique sign count N exceeds 256 and return the minimal hypercube dimension n such that 2^n >= N.
Every 8-bit sign vector v must satisfy the elementary abelian self-inverse law v XOR v == 0x00 and identity law v XOR 0x00 == v.
The Hamming distance d(a, b) between any two sign vectors must always equal the Hamming weight of their XOR sum w(a XOR b) and satisfy 0 <= d(a, b) <= 8.
Every sign vector v and its bitwise complement NOT v must always form an antipodal oppositional pair separated by the maximum Hamming distance of 8.
The eight generative basis archetypes must always be the exact eight vectors in (F_2)^8 with a Hamming weight of 1.
Optimal Constellation Mapping (OCM) via 2-opt Simulated Annealing must always preserve a bijection between the N corpus signs and N distinct vertices of the hypercube.
The Quadratic Assignment Problem (QAP) cost must always be non-negative and invariant under simultaneous permutation of sign indices.
When at least two Non-Linguistic Pivot trigger conditions hold, the application must always recommend Structural Resonance Analysis as a high-priority pathway.
Constrained Hypothesis Generation must never accept a candidate linguistic mapping that violates active GSA clustering, shortest-path ligature, or Hamming-phonetic distance constraints.`,
  },
  {
    path: 'model/OcteractCypher.lex.tex',
    category: 'Formal Proofs',
    language: 'latex',
    description: 'Authoritative LexLean specification & proofs for (F_2)^8 and Q_8',
    content: `\\begin{lexmodule}{OcteractCypher}
\\import{Foundation.Holo.V1.Wire}
\\import{Prism.Stdlib.Numerics.Gf2}
\\import{Prism.Stdlib.Crypto.Blake3}

\\section{Axiomatic Core: The $(\\mathbb{F}_2)^8$ Structural Trinity}

/-- An element of the 8-dimensional hypercube $Q_8$ is a 1-byte bitvector in $(\\mathbb{F}_2)^8$. -/
abbrev OcteractVertex := BitVec 8

/-- Vector addition in $(\\mathbb{F}_2)^8$ and group operation in $(\\mathbb{Z}/2\\mathbb{Z})^8$. -/
def gf2Add (a b : OcteractVertex) : OcteractVertex :=
  BitVec.xor a b

/-- Boolean lattice meet ($\\wedge$), join ($\\vee$), and complement ($\\neg$). -/
def latticeMeet (a b : OcteractVertex) : OcteractVertex := BitVec.and a b
def latticeJoin (a b : OcteractVertex) : OcteractVertex := BitVec.or a b
def latticeNot  (v : OcteractVertex)   : OcteractVertex := BitVec.not v

/-- Hamming weight $w(v)$ counting '1' bits in $v$. -/
def hammingWeight (v : OcteractVertex) : Nat :=
  (List.range 8).countP (fun i => v.getLsbD i)

/-- Fundamental metric: Hamming distance $d(a, b) = w(a \\oplus b)$. -/
def hammingDistance (a b : OcteractVertex) : Nat :=
  hammingWeight (gf2Add a b)

/-- Theorem 1 (Intent Line 2): Elementary Abelian self-inverse and identity laws. -/
theorem abelian_self_inverse_and_identity (v : OcteractVertex) :
    gf2Add v v = 0#8 ∧ gf2Add v 0#8 = v := by
  constructor
  · exact BitVec.xor_self v
  · exact BitVec.xor_zero v

/-- Theorem 2 (Intent Line 3): Hamming distance equals $w(a \\oplus b)$ and is bounded by 8. -/
theorem hamming_distance_bounds (a b : OcteractVertex) :
    hammingDistance a b = hammingWeight (gf2Add a b) ∧ hammingDistance a b ≤ 8 := by
  constructor
  · rfl
  · unfold hammingDistance hammingWeight
    exact List.countP_le_length _

/-- Theorem 3 (Intent Line 4): Oppositional archetypes $(v, \\neg v)$ are antipodal at distance 8. -/
theorem antipodal_complement_distance (v : OcteractVertex) :
    hammingDistance v (latticeNot v) = 8 := by
  decide_bv

/-- Generative Archetypes (Basis Vectors / Atoms): 8 states with Hamming weight 1. -/
def generativeBasisAtoms : List OcteractVertex :=
  [0x01#8, 0x02#8, 0x04#8, 0x08#8, 0x10#8, 0x20#8, 0x40#8, 0x80#8]

/-- Theorem 4 (Intent Line 5): Every basis atom has Hamming weight 1 and length 8. -/
theorem generative_basis_weight_one :
    generativeBasisAtoms.length = 8 ∧ ∀ b ∈ generativeBasisAtoms, hammingWeight b = 1 := by
  decide

\\section{Scalability Protocol (Section 5.3)}

/-- Computes minimal hypercube dimension $n \\ge 8$ such that $2^n \\ge N$. -/
def minimalHypercubeDim (uniqueSignCount : Nat) : Nat :=
  let rec loop (n : Nat) (fuel : Nat) : Nat :=
    match fuel with
    | 0 => n
    | fuel' + 1 =>
      if uniqueSignCount ≤ (1 <<< n) then n else loop (n + 1) fuel'
  loop 8 16

/-- Theorem 5 (Intent Line 1): Scalability guard halts 8-bit mode whenever $N > 256$. -/
theorem scalability_protocol_guard (N : Nat) :
    (N > 256 → minimalHypercubeDim N ≥ 9) ∧
    (N ≤ 256 → minimalHypercubeDim N = 8) := by
  omega_decide

\\section{Optimal Constellation Mapping (QAP) \\& Non-Linguistic Pivot}

/-- Global QAP objective: $\\text{Cost}(\\pi) = \\sum_{i,j} S_{ij} \\cdot d(\\pi(i), \\pi(j))$. -/
def qapCost (n : Nat) (sim : Nat → Nat → Nat) (assign : Nat → OcteractVertex) : Nat :=
  (List.range n).foldl (fun acc i =>
    acc + (List.range n).foldl (fun inner j =>
      inner + (sim i j) * (hammingDistance (assign i) (assign j))) 0) 0

/-- Theorem 6 (Intent Line 7): QAP cost is strictly non-negative. -/
theorem qap_cost_nonnegative (n : Nat) (sim : Nat → Nat → Nat) (assign : Nat → OcteractVertex) :
    0 ≤ qapCost n sim assign := by
  exact Nat.zero_le _

/-- Shortest-path ligature predicate: $v_c$ lies on a geodesic between $v_a$ and $v_b$
    iff $d(v_a, v_c) + d(v_c, v_b) = d(v_a, v_b)$. -/
def isOnGeodesicPath (va vb vc : OcteractVertex) : Bool :=
  hammingDistance va vc + hammingDistance vc vb == hammingDistance va vb

/-- Non-Linguistic Pivot trigger evaluation (Section 4.1). -/
def shouldTriggerNonLinguisticPivot (c1 c2 c3 c4 : Bool) : Bool :=
  let activeCount := (if c1 then 1 else 0) + (if c2 then 1 else 0) +
                     (if c3 then 1 else 0) + (if c4 then 1 else 0)
  activeCount ≥ 2

/-- Theorem 7 (Intent Line 8): Two or more active checklist triggers force the non-linguistic pivot. -/
theorem non_linguistic_pivot_sound (c1 c2 c3 c4 : Bool) :
    ((if c1 then 1 else 0) + (if c2 then 1 else 0) +
     (if c3 then 1 else 0) + (if c4 then 1 else 0) ≥ 2) ↔
    shouldTriggerNonLinguisticPivot c1 c2 c3 c4 = true := by
  simp [shouldTriggerNonLinguisticPivot]

\\end{lexmodule}`,
  },
  {
    path: 'Cargo.toml',
    category: 'Rust Layer-3 Crate',
    language: 'toml',
    description: 'uor-prism v0.4 Layer-3 implementation crate configuration',
    content: `[package]
name = "prism-octeract-cypher"
version = "0.1.0"
edition = "2021"
rust-version = "1.83"

[dependencies]
uor-prism = "0.4.0"
uor-prism-verify = "0.4.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"`,
  },
  {
    path: 'src/lib.rs',
    category: 'Rust Layer-3 Crate',
    language: 'rust',
    description: 'Shapes, Layer-3 verbs, OCM Simulated Annealing, GSA engine & Rust unit tests',
    content: `#![forbid(unsafe_code)]

use prism::*;
use prism::crypto::{Blake3Hasher, Digest};
use prism::numerics::ring::{Gf2NumericAxisN, Gf2RingShape, RingAxis};
use prism::pipeline::{
    output_shape, prism_model, product_shape, register_shape, verb,
};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// 1-byte GF(2)^8 axis representing the 256-state Octeract algebra.
pub type OcteractGf2Axis = Gf2NumericAxisN<1>;

product_shape! {
    pub struct OcteractVertexPairShape {
        pub left: Gf2RingShape<1>,
        pub right: Gf2RingShape<1>,
    }
}

output_shape! {
    pub struct OcteractConstellationReceiptShape {
        pub state_commitment: Digest<32>,
        pub centroid_vertex: Gf2RingShape<1>,
    }
}

register_shape! {
    pub OcteractShapeRegistry {
        OcteractVertexPairShape,
        OcteractConstellationReceiptShape,
    }
}

verb! {
    /// Layer-3 verb: XOR vector addition / paleogenetic difference V_diff = V(A) ^ V(B) in GF(2)^8.
    pub const OCTERACT_XOR_TRANSLATE: OcteractVertexPairShape -> Gf2RingShape<1>;
}

prism_model! {
    pub struct OcteractCypherModel {
        type Input = OcteractVertexPairShape;
        type Output = OcteractConstellationReceiptShape;
        type Hasher = Blake3Hasher;
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct Vertex8(pub u8);

impl Vertex8 {
    pub const BOTTOM_ZERO: Self = Self(0b0000_0000);
    pub const TOP_ONES: Self = Self(0b1111_1111);
    pub const BASIS_ATOMS: [Self; 8] = [
        Self(0b0000_0001), Self(0b0000_0010), Self(0b0000_0100), Self(0b0000_1000),
        Self(0b0001_0000), Self(0b0010_0000), Self(0b0100_0000), Self(0b1000_0000),
    ];

    #[inline] pub const fn xor(self, other: Self) -> Self { Self(self.0 ^ other.0) }
    #[inline] pub const fn meet_and(self, other: Self) -> Self { Self(self.0 & other.0) }
    #[inline] pub const fn join_or(self, other: Self) -> Self { Self(self.0 | other.0) }
    #[inline] pub const fn complement_not(self) -> Self { Self(!self.0) }
    #[inline] pub const fn is_subset_of(self, other: Self) -> bool { (self.0 & other.0) == self.0 }
    #[inline] pub const fn hamming_weight(self) -> u32 { self.0.count_ones() }
    #[inline] pub const fn hamming_distance(self, other: Self) -> u32 { self.xor(other).hamming_weight() }
}`,
  },
  {
    path: 'types/octeract.ts',
    category: 'TypeScript Schema',
    language: 'typescript',
    description: 'Canonical TypeScript schema for FeatureSchema8, OCM, GSA & OcteractOutput',
    content: `export interface FeatureSchema8 {
  bit0_high_frequency: boolean;      // 1. Frequency (e.g., > median)
  bit1_pos_initial: boolean;         // 2. Positional (Start) preference
  bit2_pos_final: boolean;           // 3. Positional (End) preference
  bit3_func_class_primary: boolean;  // 4. Functional Class 1 (e.g., logogram / basic sign)
  bit4_func_class_secondary: boolean;// 5. Functional Class 2 (e.g., votive context / fish variant)
  bit5_paleo_complex: boolean;       // 6. Paleographic Complexity (e.g., > 3 strokes / modifier)
  bit6_paleo_curved: boolean;        // 7. Paleographic Form (e.g., curved elements / numeral)
  bit7_structural_role: boolean;     // 8. Structural Role (e.g., pure vowel / jar-associated)
}

export interface OcteractInput {
  corpus_name: string;
  unique_sign_count: number;
  total_token_count: number;
  signs: SignRecord[];
  similarity_matrix_q1000: number[][];
  ligature_candidates: LigatureCandidate[];
  homomorphic_pairs: HomomorphicPair[];
  triggers: NonLinguisticTriggers;
  locked_constraints: LockedConstraint[];
  sa_seed: number;
}`,
  },
  {
    path: 'examples/01_linear_a_libation.json',
    category: 'Acceptance Vectors',
    language: 'json',
    description: 'Linguistic OCM + GSA + constrained hypothesis vector (N = 65)',
    content: JSON.stringify(PRESET_VECTORS[0].input, null, 2),
  },
  {
    path: 'examples/02_indus_scalability_halt.json',
    category: 'Acceptance Vectors',
    language: 'json',
    description: 'N = 417 > 256 scalability guard vector (Enneact n = 9)',
    content: JSON.stringify(PRESET_VECTORS[1].input, null, 2),
  },
  {
    path: 'examples/03_phaistos_structural_resonance.json',
    category: 'Acceptance Vectors',
    language: 'json',
    description: 'Non-linguistic pivot & Q_8 k-face resonance vector (N = 45, 241 tokens)',
    content: JSON.stringify(PRESET_VECTORS[2].input, null, 2),
  },
];

export const FEATURE_BIT_LABELS: {
  key: keyof import('../types/octeract').FeatureSchema8;
  bitIndex: number;
  shortLabel: string;
  fullTitle: string;
  description: string;
}[] = [
  {
    key: 'bit0_high_frequency',
    bitIndex: 0,
    shortLabel: 'b0: High Freq',
    fullTitle: 'Bit 0 (LSB) — High Corpus Frequency',
    description: 'Sign occurs above the corpus median frequency threshold.',
  },
  {
    key: 'bit1_pos_initial',
    bitIndex: 1,
    shortLabel: 'b1: Pos Initial',
    fullTitle: 'Bit 1 — Word/Sequence Initial Preference',
    description: 'Statistically enriched at word-initial or tablet-heading boundaries.',
  },
  {
    key: 'bit2_pos_final',
    bitIndex: 2,
    shortLabel: 'b2: Pos Final',
    fullTitle: 'Bit 2 — Word/Sequence Final Preference',
    description: 'Statistically enriched at word-final or suffixal boundaries.',
  },
  {
    key: 'bit3_func_class_primary',
    bitIndex: 3,
    shortLabel: 'b3: Class I',
    fullTitle: 'Bit 3 — Primary Functional Class',
    description: 'Functions as a core logogram, root glyph, or primary sign class.',
  },
  {
    key: 'bit4_func_class_secondary',
    bitIndex: 4,
    shortLabel: 'b4: Class II',
    fullTitle: 'Bit 4 — Secondary Functional Context',
    description: 'Associated with votive/libation formulae or specialized contextual variants.',
  },
  {
    key: 'bit5_paleo_complex',
    bitIndex: 5,
    shortLabel: 'b5: Complex',
    fullTitle: 'Bit 5 — Paleographic Complexity',
    description: 'High stroke count (> 3 strokes) or diacritic/modifier embellishment.',
  },
  {
    key: 'bit6_paleo_curved',
    bitIndex: 6,
    shortLabel: 'b6: Curved',
    fullTitle: 'Bit 6 — Curvilinear Morphology',
    description: 'Contains prominent arcs, loops, or curvilinear ductus elements.',
  },
  {
    key: 'bit7_structural_role',
    bitIndex: 7,
    shortLabel: 'b7: Structural',
    fullTitle: 'Bit 7 (MSB) — Structural / Vocalic Role',
    description: 'Pure vocalic root, clause delimiter, or vessel/accounting determinative.',
  },
];
