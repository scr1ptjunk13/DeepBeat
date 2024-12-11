import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const formData = new FormData();
      
      // Check if file is a string (base64) or file object
      if (typeof req.body.file === 'string') {
        // If it's a base64 string, convert to file
        const matches = req.body.file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches) {
          const buffer = Buffer.from(matches[2], 'base64');
          fs.writeFileSync('uploaded_audio.wav', buffer);
          formData.append('file', fs.createReadStream('uploaded_audio.wav'));
        }
      } else if (req.body.file instanceof File) {
        // If it's a File object
        formData.append('file', req.body.file);
      } else {
        return res.status(400).json({ error: 'Invalid file format' });
      }

      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      // Directly use the response data which should have genre and confidence
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error in analyze API:', error);
      res.status(500).json({ error: 'Error analyzing music' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};