export interface ArticleDetail {
  id: number;
  title: string;
  link: string;
  site_name: string;
}

export interface AnalysisReport {
  topic_name: string;
  article_ids: number[];
  is_grouped: boolean;
  analysis: {
    summary_points: string[];
    insight: string;
  };
  articles: ArticleDetail[]; // Joined article data
}

// GitHub の RAW データを取得するためのベース URL
const GITHUB_RAW_BASE_URL = process.env.NEXT_PUBLIC_DATA_URL || 'https://raw.githubusercontent.com/yamahei21python/EV-News-Intelligence/main';

export async function getAvailableDates(): Promise<string[]> {
  try {
    // dates.json をフェッチ
    const res = await fetch(`${GITHUB_RAW_BASE_URL}/dates.json`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching dates:', error);
    return [];
  }
}

export async function getReports(date?: string): Promise<AnalysisReport[]> {
  const url = date 
    ? `${GITHUB_RAW_BASE_URL}/archive/${date}.json`
    : `${GITHUB_RAW_BASE_URL}/final_reports.json`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    
    return await res.json();
  } catch (error) {
    console.error('Error loading reports:', error);
    return [];
  }
}
