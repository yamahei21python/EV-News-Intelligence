# 🏎️ EV News Intelligence Pipeline

AI (Gemini 3.1 Flash & GLM-5.1) を活用した、次世代 EV 業界の自律型インテリジェンス・パイプラインです。

## 🌟 プロジェクトの概要
このシステムは、膨大な EV 関連ニュースから「真に価値のあるインサイト」を抽出・統合するために設計されました。

- **Precision Recovery Protocol (PRP)**: 
  Crawl4AI と Playwright を組み合わせ、AI アナリストが構造を再構築することで、ノイズを排除した純粋な本文のみを復元・抽出します。
- **Intelligent Deduplication**: 
  12時間ごとの収集において、URLベースでの重複排除を行い、常にフレッシュなデータセットを維持します。
- **Analytical Synthesis**: 
  同一トピックの複数ソースを GLM-5.1 が統合的に分析。多角的な視点から「3行要約」と「業界インサイト」を導き出します。

## ⚙️ オペレーション・サイクル (JST)
GitHub Actions により、サーバーレスで以下のサイクルが自動実行されます。

- **🕕 18:00 JST (09:00 UTC)**  
  **[Fetch]** 中間ニュース取得。日中の主要ニュースを `news_data.json` に蓄積。
- **🕕 06:00 JST (21:00 UTC)**  
  **[Analyze & Reset]** 
  1.  直近24時間分の最終 Fetch を実行。
  2.  PRP プロトコルによる本文抽出 ➔ 統合分析を実施。
  3.  `final_reports.json` を更新 ➔ アーカイブ生成。
  4.  翌日のために収集データを **リセット (Daily Clear)** ♻️

## 🎨 データ構造
成果物は軽量な JSON 形式で管理され、Vercel 上のダッシュボード（準備中）に即座に反映されます。
- `final_reports.json`: 本日の分析結果
- `archive/YYYY-MM-DD.json`: 過去のインテリジェンス・ログ

## 🛠️ 技術スタック
- **Language**: Python 3.11+
- **Agentic Scraping**: Crawl4AI / Playwright
- **AI Models**: Gemini 3.1 Flash (Filtering/Grouping), GLM-5.1 via Z.ai (Analysis)
- **CI/CD**: GitHub Actions

---
Developed with ❤️ by Antigravity AI
