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
  articles: ArticleDetail[];
}