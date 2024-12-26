import React, { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { videoFilePathAtom } from '../atoms/state'
import { Play, Pause } from 'lucide-react'
import { selectedSystemChangeAtom } from '../atoms/state'
import { systemChangesAtom } from '../atoms/state'
import { setVideoRef } from '../atoms/state'
import { SheetUtils } from '../utils/sheetUtils'
import { osmdAtom } from '../atoms/state'

export const VideoPlayer: React.FC = () => {
  const [osmd] = useAtom(osmdAtom)
  const [videoSrc, setVideoSrc] = useState<string>()
  const [selectedVideo, setSelectedVideo] = useAtom(videoFilePathAtom)
  const [systemChanges, setSystemChanges] = useAtom(systemChangesAtom)
  const [selectedSystemChange, setSelectedSystemChange] = useAtom(selectedSystemChangeAtom) 
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [duration, setDuration] = useState(0)

  /*
  useEffect(() => {
    if (selectedVideo) {
      setVideoSrc(window.electron.getVideoUrl(selectedVideo))
    }
  }, [selectedVideo])
  */

  useEffect(() => {
    if (videoRef.current) {
      setVideoRef(videoRef.current)
    }
  }, [videoRef])

  // Update the current time every 100ms
  // Check if the next system change is reached
  useEffect(() => {
    let interval: number;
      interval = setInterval(() => {

        // set elapsed time ui
        setElapsedTime(videoRef.current?.currentTime || 0)

        const nextSystemIndex = selectedSystemChange + 1;

        if (selectedSystemChange === -1 || systemChanges[selectedSystemChange]?.startTime === -1 || systemChanges[nextSystemIndex]?.startTime === -1) {
          return;
        }
        //console.log(systemChanges[nextSystemIndex].startTime)
        
        if (osmd && nextSystemIndex < systemChanges.length) {
          if (videoRef && videoRef.current && videoRef.current.currentTime >= systemChanges[nextSystemIndex].startTime) {
            setSelectedSystemChange(nextSystemIndex)

            console.log(systemChanges)
            console.log(nextSystemIndex)
            console.log(systemChanges[nextSystemIndex])

            SheetUtils.scrollToMeasure(
              osmd.Zoom, 
              systemChanges[nextSystemIndex]
            )
            //SheetUtils.draw(osmd, systemChanges, nextSystemIndex)
          }
        }
      }, 100)

    return () => clearInterval(interval)
  }, [selectedSystemChange, systemChanges])

  const handleClickSetTime = () => {
    if (selectedSystemChange !== null && systemChanges.length > 0) {
      const newSystemChange = { ...systemChanges[selectedSystemChange], startTime: elapsedTime }
      const newSystemChanges = [...systemChanges]
      newSystemChanges[selectedSystemChange] = newSystemChange
      setSystemChanges(newSystemChanges)
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setPlaying( p=> !p)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = Number(e.target.value)
      videoRef.current.currentTime = newTime
      setElapsedTime(newTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0)
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 10);

    // Pad the minutes, seconds, and milliseconds to ensure proper format
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}.${String(milliseconds).padStart(1, '0')}`;
  };

  return (
    <div style={{ position: 'relative', width: '100%', margin: '0 auto' }}>
      <video
        ref={videoRef}
        src={window.electron.getVideoUrl(selectedVideo)}
        style={{ width: '100%', height: '0px', visibility: 'hidden', opacity: 0 }}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: 'none', width: '80%' }}>
        <button onClick={handlePlayPause} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px', marginRight: '10px' }}>
          {playing ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          value={elapsedTime}
          onChange={handleSeek}
          style={{ width: 'calc(100% - 60px)', height: '20px', margin: '0 10px' }}
        />
        <span style={{ color: 'white', fontSize: '16px' }}>
          {formatTime(elapsedTime)}
        </span>
        <button onClick={handleClickSetTime} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px', marginLeft: '10px' }}> 
          Set
        </button>
      </div>
    </div>
  )
}

export default VideoPlayer
