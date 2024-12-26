import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { systemChangesAtom, updatedSystemChangeStartTime, updateVideoRefCurrentTime } from '../atoms/state';
import { selectedSystemChangeAtom } from '../atoms/state';
import { SheetUtils } from '../utils/sheetUtils';
import { osmdAtom } from '../atoms/state';

const formatTime = (seconds: number) => {
  if (seconds >= 0) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  } else {
    return '';
  }
};

export default function SystemChanges() {
  const [systemChanges, setSystemChanges] = useAtom(systemChangesAtom);
  const [selectedSystemChange, setSelectedSystemChange] = useAtom(selectedSystemChangeAtom);
  const [osmd] = useAtom(osmdAtom);

  /*
  useEffect(() => {
    if (osmd !== null) {
      SheetUtils.draw(osmd, systemChanges, selectedSystemChange);
    }
  }, [systemChanges]);
  */

  const getFormattedTime = (startTime: number) => {
    if (startTime < 0)  {
      startTime = 0
    }
    const minutes = Math.floor(startTime / 60);
    const seconds = (startTime % 60).toFixed(1);
    return(`${minutes.toString().padStart(2, '0')}:${seconds.padStart(4, '0')}`);
  };

  const handleSelectItem = (index: number) => {
    setSelectedSystemChange(index);

    // Update player
    if (systemChanges[index].startTime >= 0) {
      updateVideoRefCurrentTime(systemChanges[index].startTime);
    }

    // Draw the measure(s) at selected system 
    //if (osmd !== null) {
    //  SheetUtils.draw(osmd, systemChanges, index);
    //}
    if (osmd) {
      //SheetUtils.moveCursor(osmd, systemChanges[index].startMeasure);
      SheetUtils.scrollToMeasure(osmd.Zoom, systemChanges[index])
    } 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    //if (/^\d{0,2}:\d{0,2}(\.\d{0,1})?$/.test(value)) {
      //console.log(value)
    //}

    const [minutes, seconds] = value.split(':');
      const totalSeconds = parseInt(minutes) * 60 + parseFloat(seconds);

      setSystemChanges(
        updatedSystemChangeStartTime(
          systemChanges, 
          selectedSystemChange, 
          totalSeconds
        )
      );
  };

  /*
  const handleInputBlur = () => {
      const [minutes, seconds] = editValue.split(':');
      const totalSeconds = parseInt(minutes) * 60 + parseFloat(seconds);

      setSystemChanges(
        updatedSystemChangeStartTime(
          systemChanges, 
          selectedSystemChange, 
          totalSeconds
        )
      );
  };
  */

  /*
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };
  */

  let selectedBackgroundStyle = (index: number) => index === selectedSystemChange ? {backgroundColor: "gray"} : {};

  return (
    <div>
      {systemChanges.map((change, index) => (
        <div 
          key={index}
          style={{padding: "5px", cursor: "pointer", ...selectedBackgroundStyle(index), gap: "40px", display: "flex", flexDirection: "row"} }
          onClick={() => handleSelectItem(index)}
        >
          
            <span style={{width: "30px"}}>{change.startMeasure}</span>
          
            {
            
            /*
            selectedSystemChange === index ? (
              <input
                value={getFormattedTime(change.startTime)}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : 
              <span>{ change.startTime ? formatTime(change.startTime) : "" }</span>
            */}

              <span>{ change.startTime ? formatTime(change.startTime) : "" }</span>
        </div>
      ))}
    </div>
  );
}