import { IManualVideoRenderer } from "../types/ManualVideoRenderer";
import { atom } from "jotai";
import { atomWithReset, atomWithStorage } from 'jotai/utils'
import { splitAtom } from 'jotai/utils'
import { ISystemChange } from "../types/SystemChange";
import { getDefaultStore } from "jotai";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

// file paths
export const mxlFilePathAtom = atomWithStorage('mxlFilePath', '')
export const videoFilePathAtom = atomWithStorage('videoFilePath', '')

// video player
export const durationAtom = atomWithStorage('duration', 0)
export const titleAtom = atomWithStorage('title', '')
export const isPlayingAtom = atom(false)
let videoRef: HTMLVideoElement | null = null

export const setVideoRef = (v: HTMLVideoElement) => {
  videoRef = v
}

export const updateVideoRefCurrentTime = (time: number) => {
  if (videoRef) {
    videoRef.currentTime = time;
  }
}

// OSMD
export const systemsPerFrameAtom = atomWithStorage('systemsPerFrame', 1) // default to 1 system per frame (0)
export const osmdAtom = atomWithReset<OpenSheetMusicDisplay | null>(null)
export const systemChangesAtom = atomWithStorage<ISystemChange[]>('systemChanges', [])
export const selectedSystemChangeAtom = atomWithStorage<number>('selectedSystemChange', -1)
export const isLoadingAtom = atomWithReset(false)
export const isRenderingAtom = atomWithReset(false)

export const updatedSystemChangeStartTime = (systemChanges: ISystemChange[], index: number, startTime: number) => {
  const updatedChanges = [...systemChanges];
  updatedChanges[index] = {
    ...updatedChanges[index],
    startTime
  };
  return updatedChanges;
}