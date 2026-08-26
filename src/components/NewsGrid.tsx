import React from "react";
import NewsCard from "./NewsCard";
import { useNews } from "../context/NewsContext";

export default function NewsGrid() {
  const { publishedArticles } = useNews();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {publishedArticles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
