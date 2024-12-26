import { useEffect, useMemo, useState } from 'react';
import { CursorHelper } from '../utils/CursorHelpler';
import { CursorOptions, CursorType, DrawingParametersEnum, GraphicalMeasure, OpenSheetMusicDisplay, VexFlowMeasure } from 'opensheetmusicdisplay';
import { useRef } from 'react';
import { ISystemChange } from '../types/SystemChange';
import { useAtom } from 'jotai';
import { systemChangesAtom, osmdAtom, mxlFilePathAtom } from '../atoms/state';
import { useOSMD } from '../hooks/useOSMD';
import { isLoadingAtom } from '../atoms/state';

export default function SheetMusic() {
  const osmdContainerRef = useRef<HTMLDivElement>(null);
  const [mxlFilePath] = useAtom(mxlFilePathAtom);
  const { osmd, systemChanges, loading, error } = useOSMD(osmdContainerRef, mxlFilePath);
  const [isLoading] = useAtom(isLoadingAtom);

  let loadingStyle =  isLoading ? { backgroundColor: "#181818", opacity: 0.5 } : {};
  let loadingClass = isLoading ? "loading-container" : "";

  return ( 
    <>
    { /*isLoading && <div>Loading...</div>*/}
    <div 
      ref={osmdContainerRef} 
      id="osmdContainer" 
      className={"osmd-container" + " " + loadingClass}
      style={{ width: '500px', height: '100%', ...loadingStyle}}
    /> 
    </>
  );
}