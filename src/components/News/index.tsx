import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

interface NewsItem {
  id: number;
  title: string;
  content: string;
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(() => {
    const savedNews = localStorage.getItem('news');
    return savedNews ? JSON.parse(savedNews) : [];
  });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('news', JSON.stringify(news));
  }, [news]);

  const handleAddOrUpdate = () => {
    if (editingId !== null) {
      setNews((prevNews) =>
        prevNews.map((item) =>
          item.id === editingId ? { ...item, title, content } : item
        )
      );
      setEditingId(null);
    } else {
      const newNewsItem: NewsItem = {
        id: Date.now(),
        title,
        content,
      };
      setNews((prevNews) => [...prevNews, newNewsItem]);
    }
    setTitle('');
    setContent('');
  };

  const handleEdit = (id: number) => {
    const newsItem = news.find((item) => item.id === id);
    if (newsItem) {
      setTitle(newsItem.title);
      setContent(newsItem.content);
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    setNews((prevNews) => prevNews.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.newsListContainer}>
      <h1 className={styles.title}>Список новостей</h1>
      <div className={styles.formContainer}>
        <input
          type="text"
          placeholder="Введите заголовок статьи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Введите текст статьи"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
        />
        <button key={news.length} disabled={!content || !title} onClick={handleAddOrUpdate} className={styles.button}>
          {editingId !== null ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
      <ul className={styles.newsList}>
        {news.map((item) => (
          <li key={item.id} className={styles.newsItem}>
            <h2 className={styles.newsTitle}>{item.title}</h2>
            <p className={styles.newsContent}>{item.content}</p>
            <button onClick={() => handleEdit(item.id)} className={styles.editButton}>
              Редактировать
            </button>
            <button onClick={() => handleDelete(item.id)} className={styles.deleteButton}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;