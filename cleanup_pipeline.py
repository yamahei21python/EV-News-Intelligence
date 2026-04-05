import os
import shutil
import argparse

def cleanup(mode):
    """
    パイプラインの実行モードに応じてファイルを掃除します。
    """
    print(f"🧹 クリーンアップを開始します (モード: {mode})")

    # 1. 常に削除する中間ファイル
    intermediate_files = [
        "featured_news.json",
        "grouped_news.json",
        "only_title.json"
    ]
    
    # 2. 本文ディレクトリ（常に初期化）
    md_dir = "articles_md"
    if os.path.exists(md_dir):
        shutil.rmtree(md_dir)
        print(f"  🗑️ {md_dir}/ を削除しました。")
    os.makedirs(md_dir, exist_ok=True)
    print(f"  📁 {md_dir}/ を初期化しました。")

    # 3. 中間JSONの削除
    for f in intermediate_files:
        if os.path.exists(f):
            os.remove(f)
            print(f"  🗑️ {f} を削除しました。")

    # 4. モード別の処理
    if mode == "evening":
        # 18時の実行時：news_data.jsonを削除してフレッシュスタート
        if os.path.exists("news_data.json"):
            os.remove("news_data.json")
            print("  🔥 news_data.json を削除しました (18時リセット)。")
    elif mode == "morning":
        # 06時の実行時：news_data.jsonは維持（18時のニュースを保持）
        print("  ✅ news_data.json は維持します (06時まとめ用)。")

    print(f"✨ クリーンアップ完了 ({mode})")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="EV News Pipeline Cleanup Script")
    parser.add_argument("--mode", choices=["morning", "evening"], required=True, help="morning (06:00) or evening (18:00)")
    args = parser.parse_args()
    
    cleanup(args.mode)
