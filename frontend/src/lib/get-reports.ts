import fs from 'fs';
import path from 'path';

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

export async function getAvailableDates(): Promise<string[]> {
  const archivePath = path.join(process.cwd(), '../archive');
  if (!fs.existsSync(archivePath)) return [];

  const files = fs.readdirSync(archivePath);
  return files
    .filter((f) => f.endsWith('.json') && /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.replace('.json', ''))
    .sort((a, b) => b.localeCompare(a)); // Newest first
}

export async function getReports(date?: string): Promise<AnalysisReport[]> {
  const reportsPath = date 
    ? path.join(process.cwd(), `../archive/${date}.json`)
    : path.join(process.cwd(), '../final_reports.json');
  
  const newsPath = path.join(process.cwd(), '../featured_news.json');

  try {
    if (!fs.existsSync(reportsPath)) return [];
    
    const reportsData = JSON.parse(fs.readFileSync(reportsPath, 'utf8'));

    // Archived reports (new version) already have embedded 'articles'
    // But we still handle the old case or the latest one that might not be enriched yet
    if (reportsData.length > 0 && reportsData[0].articles) {
      return reportsData;
    }

    // Fallback: Join with latest featured_news.json (for final_reports.json)
    if (!fs.existsSync(newsPath)) return reportsData;
    const newsData: ArticleDetail[] = JSON.parse(fs.readFileSync(newsPath, 'utf8'));

    return reportsData.map((report: any) => ({
      ...report,
      articles: report.article_ids
        .map((id: number) => newsData.find((news) => news.id === id))
        .filter(Boolean) as ArticleDetail[],
    }));
  } catch (error) {
    console.error('Error loading reports or news:', error);
    return [];
  }
}
