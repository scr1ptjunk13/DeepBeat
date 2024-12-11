'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import AudioWaveform from './AudioWaveform'
import AudioPlayer from './AudioPlayer'

export default function UploadComponent() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0])
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold mb-4">Analyze Your Music</h1>
      <p className="text-xl text-gray-400 mb-12">Intelligent, fast, and familiar way to classify music genres with AI.</p>
      
      <div 
        className="border border-white/10 rounded-lg p-8 mb-8 transition-colors hover:border-white/20"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {file ? (
          <div className="space-y-2">
            <p className="text-lg">{file.name}</p>
            <p className="text-sm text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Upload className="mx-auto mb-4 w-12 h-12 text-gray-400" />
            <p className="text-lg mb-2">Drop your audio file here</p>
            <p className="text-sm text-gray-400 mb-4">or</p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".wav,.mp3"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 text-sm bg-white text-black rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Choose File
            </label>
          </div>
        )}
      </div>

      {file && (
        <div className="space-y-8">
          <AudioWaveform audioUrl={URL.createObjectURL(file)} />
          
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
            <AudioPlayer audioUrl={URL.createObjectURL(file)} />
          </div>

          <button 
            className="w-full px-6 py-3 text-sm bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
          >
            Analyze Genre
          </button>
        </div>
      )}
    </div>
  )
}

