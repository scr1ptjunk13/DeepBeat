// pages/genre-result.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const GenreResultPage = () => {
  const [genre, setGenre] = useState('');
  const [confidence, setConfidence] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchGenreResult = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: JSON.stringify({ file: router.query.file }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setGenre(data.genre);
        setConfidence(data.confidence);
      } catch (error) {
        console.error('Error fetching genre result:', error);
      }
    };

    if (router.query.file) {
      fetchGenreResult();
    }
  }, [router.query.file]);

  return (
    <div className="max-w-3xl mx-auto my-16">
      <h1 className="text-5xl font-bold mb-4">Genre Analysis Result</h1>
      {genre && (
        <div>
          <p className="text-2xl font-medium">Predicted Genre: {genre}</p>
          <p className="text-xl text-gray-400 mt-2">Confidence: {confidence}%</p>
        </div>
      )}
    </div>
  );
};

export default GenreResultPage;