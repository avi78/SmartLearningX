// ArticleList.tsx
import React from "react";

type ArticleProps = {
  title: string;
  description: string;
  links: {
    title: string;
    link: string;
  }[];
};

const ArticleList: React.FC<{ articles: ArticleProps[] }> = ({ articles }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Suggested Articles</h2>
      {articles.map((article, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold">{article.title}</h3>
          <p className="text-gray-600">{article.description}</p>
          <ul className="list-disc list-inside">
            {article.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;