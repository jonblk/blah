import { useState } from 'react';
import { useAtom } from 'jotai';
import { mxlFilePathAtom, videoFilePathAtom } from '../atoms/state';

export default function FileSelectors() {
  const [selectedVideo, setSelectedVideo] = useAtom(videoFilePathAtom);
  const [selectedMusicXML, setSelectedMusicXML] = useAtom(mxlFilePathAtom);

  const handleSelectVideo = async () => {
    try {
      const filePath = await window.electron.selectVideoFile();
      if (filePath) {
        console.log('Selected video:', filePath);
        setSelectedVideo(filePath);
      }
    } catch (error) {
      console.error('Error selecting video:', error);
    }
  };

  const handleSelectMusicXML = async () => {
    try {
      const filePath = await window.electron.selectMusicXMLFile();
      if (filePath) {
        console.log('Selected MusicXML:', filePath);
        setSelectedMusicXML(filePath);
      }
    } catch (error) {
      console.error('Error selecting MusicXML:', error);
    }
  };

  return (
    <div className="file-selectors">
      <div className="video-selector">
        <button 
          className="select-video-btn"
          onClick={handleSelectVideo}
        >
          Select Video File
        </button>
        {selectedVideo && (
          <div className="selected-video">
            Selected video: {selectedVideo}
          </div>
        )}
      </div>

      <div className="musicxml-selector">
        <button 
          className="select-musicxml-btn"
          onClick={handleSelectMusicXML}
        >
          Select MusicXML File
        </button>
        {selectedMusicXML && (
          <div className="selected-musicxml">
            Selected MusicXML: {selectedMusicXML}
          </div>
        )}
      </div>
    </div>
  );
}