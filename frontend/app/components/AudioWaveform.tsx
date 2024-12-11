'use client'

import React, { useRef, useEffect } from 'react'

interface AudioWaveformProps {
  audioUrl: string
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ audioUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!audioUrl) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const audio = new Audio(audioUrl)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audio)

    source.connect(analyser)
    analyser.connect(audioContext.destination)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      const WIDTH = canvas.width
      const HEIGHT = canvas.height

      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = 'rgb(0, 0, 0)'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      const barWidth = (WIDTH / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * HEIGHT

        const gradient = ctx.createLinearGradient(0, HEIGHT, 0, HEIGHT - barHeight)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)')

        ctx.fillStyle = gradient
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }

      requestAnimationFrame(draw)
    }

    audio.play()
    draw()

    return () => {
      audio.pause()
      source.disconnect()
      analyser.disconnect()
    }
  }, [audioUrl])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={200}
      className="w-full h-auto rounded-lg border border-white/10"
    />
  )
}

export default AudioWaveform

