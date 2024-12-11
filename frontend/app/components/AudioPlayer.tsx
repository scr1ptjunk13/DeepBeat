'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'

interface AudioPlayerProps {
  audioUrl: string
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full space-y-4">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="space-y-2">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={handleSliderChange}
        >
          <Slider.Track className="bg-white/10 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-white rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-3 h-3 bg-white rounded-full hover:bg-gray-200 focus:outline-none"
            aria-label="Volume"
          />
        </Slider.Root>
        
        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-6">
        <button
          onClick={skipBackward}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
          aria-label="Skip backward 5 seconds"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-4 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        
        <button
          onClick={skipForward}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
          aria-label="Skip forward 5 seconds"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

