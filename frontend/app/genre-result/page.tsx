'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const GenreResultPage = () => {
  const [genre, setGenre] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const fileData = searchParams.get('file');
    
    const fetchGenreResult = async () => {
      if (!fileData) {
        setError('No file uploaded');
        return;
      }

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: JSON.stringify({ file: fileData }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch genre result');
        }

        const data = await response.json();
        setGenre(data.genre);
        setConfidence(data.confidence);
      } catch (error) {
        console.error('Error fetching genre result:', error);
        setError('Could not analyze the music file');
      }
    };

    fetchGenreResult();
  }, [searchParams]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto my-16 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-16">
      <h1 className="text-5xl font-bold mb-4">Genre Analysis Result</h1>
      {genre && (
        <div>
          <p className="text-2xl font-medium">Predicted Genre: {genre}</p>
          <p className="text-xl text-gray-400 mt-2">Confidence: {confidence.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default GenreResultPage;