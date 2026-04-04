# 🏎️ EV News Intelligence Pipeline

AI (Gemini 2.0 Flash & GLM-5.1) を活用した、次世代 EV 業界のインテリジェンス・収集・分析パイプラインです。

## 🌟 プロジェクトの概要
このシステムは、単なるニュースアグリゲーターではありません。複数のニュースソースから「同じトピック」を賢く抽出・結合し、アナリスト級の深い洞察（インサイト）を自動生成するインテリジェンス・ツールです。

- **スマート・フィルタリング**: Gemini を使用し、ノイズ（有料記事制限や地方の些細なニュース）を徹底排除。
- **インテリジェント・名寄せ**: 同一トピックの複数記事を特定し、文脈を統合。
- **ディープ・アナリシス**: GLM-5.1 による統合分析で、3行要約と業界へのインパクト（インサイト）を生成。

## ⚙️ 自動化サイクル
GitHub Actions を利用した「自律型」の運用を実現しています。
- **18:00 JST**: ニュースの差分収集 (Fetch)
- **06:00 JST**: 24時間分の全自動統合分析 ＆ アーカイブ生成 ♻️
- **Web App**: Vercel と連携し、分析結果を Next.js ダッシュボードで公開（準備中）。

## 🛠️ セットアップ

### 必要条件
- Python 3.10+
- [Crawl4AI](https://crawl4ai.com/) (Playwright インストール済み)
- Gemini API Key / Z.ai (GLM) API Key

### ローカルでの実行
```bash
# 依存関係のインストール
pip install -r requirements.txt
playwright install

# 全工程の実行
python fetch_news.py
python process_news.py
python bulk_extract_crawl4ai.py
python group_news.py
python analyze_articles.py
```

## 🔐 GitHub Secrets 設定
自動化を有効にするため、GitHub リポジトリに以下の Secrets を設定してください：
- `GEMINI_API_KEY`
- `ZAI_API_KEY`
- `ZAI_BASE_URL`
- `ZAI_MODEL_large`

---
Developed with ❤️ by Antigravity AI
