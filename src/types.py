"""型定義・Pydanticモデル"""

from typing import Optional
from pydantic import BaseModel, Field


class NewsArticle(BaseModel):
    """ニュース記事の基本構造"""

    id: int
    title: str
    link: str
    published: Optional[str] = None
    summary: Optional[str] = ""
    site_name: str = "不明"


class TitleOnlyItem(BaseModel):
    """タイトル一覧用の簡略構造"""

    id: int
    title: str
    site_name: str
    original_index: int


class ScoredArticle(BaseModel):
    """AI判定後の記事"""

    id: int
    title: str
    link: str
    site_name: str
    primary_category: str
    reason: str
    score: int
    is_highly_important: bool


class ArticleGroup(BaseModel):
    """グルーピング結果"""

    topic_name: str
    article_ids: list[int]
    is_grouped: bool


class AnalysisResult(BaseModel):
    """統合分析結果"""

    summary_points: list[str]
    insight: str


class FinalReport(BaseModel):
    """最終レポート"""

    topic_name: str
    article_ids: list[int]
    articles: list[ScoredArticle]
    is_grouped: bool
    analysis: AnalysisResult
