import os
import json
import glob
from datetime import datetime

def archive_results():
    output_file = "final_reports.json"
    archive_dir = "archive"
    
    if not os.path.exists(output_file):
        print(f"Error: {output_file} が見当たりません。")
        return

    with open(output_file, "r", encoding="utf-8") as f:
        final_reports = json.load(f)

    # アーカイブ保存 (YYYY-MM-DD.json)
    # GitHub Actions は UTC なので、日付がずれる可能性があるが、
    # 既存のロジックに合わせる
    today = datetime.now().strftime("%Y-%m-%d")
    os.makedirs(archive_dir, exist_ok=True)
    archive_file = os.path.join(archive_dir, f"{today}.json")
    
    with open(archive_file, "w", encoding="utf-8") as f:
        json.dump(final_reports, f, ensure_ascii=False, indent=4)
    print(f"📦 アーカイブ保存完了: {archive_file}", flush=True)

    # 日付インデックスの生成 (Vercel/Remote Fetch用)
    print("生成済みのアーカイブ一覧を更新中...", flush=True)
    archive_files = sorted(glob.glob(os.path.join(archive_dir, "*.json")), reverse=True)
    available_dates = [
        os.path.basename(f).replace(".json", "") 
        for f in archive_files 
        if os.path.basename(f) != "dates.json"
    ]
    
    with open("dates.json", "w", encoding="utf-8") as f:
        json.dump(available_dates, f, ensure_ascii=False, indent=2)
    print(f"📄 日付インデックス更新完了: {len(available_dates)}件", flush=True)

if __name__ == "__main__":
    archive_results()
