# Graph DSL JSON Schemas

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JSON Schemas for eight graph DSL formats designed for efficient graph representation and validation.

このリポジトリには、8種類のグラフDSL形式に対するJSON Schemaが含まれています。

## スキーマ一覧

### 1. VEグラフDSL Schema (`ve/ve-schema.json`)
- **形式**: `v, e, e.ends` を使用
- **対象**: 一般グラフ/多部グラフ/ハイパーグラフ
- **特徴**:
  - `v`: 頂点集合（`part` で多部を表現可能）
  - `e`: エッジ集合（`ends` に端点列を直持ち）
  - ハイパーエッジ（3つ以上の端点）に対応
  - 拡張属性（`attrs`）でばね、重みなどを表現

### 2. VEIグラフDSL Schema (`vei/vei-schema.json`)
- **形式**: `v, e, i` を使用
- **対象**: 一般グラフ/多部グラフ/ハイパーグラフ
- **特徴**:
  - `v`: 頂点集合
  - `e`: エッジ集合
  - `i`: インシデンスリスト（頂点とエッジの接続を定義）
  - `ends` の冗長性を排除

### 3. 二部グラフDSL Schema (`uwi/bipartite-graph-schema.json`)
- **形式**: `u, w, i` を使用
- **対象**: 二部グラフ専用（糖衣構文）
- **特徴**:
  - `u`: 左側頂点集合
  - `w`: 右側頂点集合
  - `i`: インシデンスリスト（U-W間の接続）
  - LLMに優しい短いキー名

### 4. 量子グラフDSL Schema (`spin/quantum-graph-schema.json`)
- **形式**: `V, E, i, ρ` を使用
- **対象**: 量子スピンネットワーク（QG: Quantum Graph）
- **特徴**:
  - `V`: 体積量子頂点（リンクによって定義されるノード）
  - `E`: 面積・接続性を決めるリンク（エッジ）
  - `i`: インシデデンス/インデックス写像
  - `ρ`: 密度/状態パラメータ
  - SU(2)ラベル付（スピン量子数）
  - プロセス代数構造 `(E,≤,#)` でイベント・通信・同期を表現

### 5. ENGIグラフDSL Schema (`engi/engi-graph-schema.json`)
- **形式**: `node, edge, incidence` を使用
- **対象**: 一般グラフ/多部グラフ/ハイパーグラフ
- **特徴**:
  - `node`: ノード集合
  - `edge`: エッジ集合
  - `incidence`: インシデンスリスト（ノードとエッジの接続を定義）

### 6. ENCIグラフDSL Schema (`enci/enci-graph-schema.json`)
- **形式**: `node, edge, incidence` with `capability`
- **対象**: Capability-based Graph（能力ベースグラフ）
- **特徴**:
  - `node`, `edge` は `id` に加えて偽造困難な `capability` トークンを持つ
  - `incidence` は `id` の代わりに `capability` で接続を表現
  - 各要素へのアクセス権とアドレスを一体化
  - 分散環境下でグラフの一部を安全に共有・操作するためのスキーマ

### 7. INGAグラフDSL Schema (`inga/inga-graph-schema.json`)
- **形式**: `node, edge, incidence` (Typed Property Graph)
- **対象**: 一般グラフ/多部グラフ/ハイパーグラフ
- **特徴**:
  - `node`: ノード集合 (`type` と `attrs` を持つ)
  - `edge`: エッジ集合 (`type` と `attrs` を持つ)
  - `incidence`: インシデンスリスト（ノードとエッジの接続を定義）
  - 型付きプロパティグラフの汎用的なスキーマ

### 8. ENISHIグラフDSL Schema (`enishi/enishi-graph-schema.json`)
- **形式**: `node, edge, incidence` (Typed Property Graph)
- **対象**: 一般グラフ/多部グラフ/ハイパーグラフ
- **特徴**:
  - `node`: ノード集合 (`type` と `attrs` を持つ)
  - `edge`: エッジ集合 (`type` と `attrs` を持つ)
  - `incidence`: インシデンスリスト（ノードとエッジの接続を定義）
  - 型付きプロパティグラフの汎用的なスキーマ

## 使用方法

### 検証スクリプト
```
```