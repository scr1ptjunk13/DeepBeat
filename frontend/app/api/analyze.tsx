// pages/api/analyze.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const formData = new FormData();
      if (req.body.file) {
        formData.append('file', req.body.file as any);
      } else {
        return res.status(400).json({ error: 'No file provided' });
      }

      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      res.status(200).json({ genre: response.data, confidence: 90 }); // Replace with actual confidence score
    } catch (error) {
      res.status(500).json({ error: 'Error analyzing music' });
    }
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set the desired file size limit
    },
  },
};