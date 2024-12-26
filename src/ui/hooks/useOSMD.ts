import { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay, CursorType } from 'opensheetmusicdisplay';
import { useAtom } from 'jotai';
import { systemChangesAtom, osmdAtom } from '../atoms/state';
import { ISystemChange, SystemChange } from '../types/SystemChange';
import { selectedSystemChangeAtom } from '../atoms/state';
import { CursorHelper } from '../utils/CursorHelpler';
import { SheetUtils } from '../utils/sheetUtils';
import { isLoadingAtom } from '../atoms/state';

export const useOSMD = (containerRef: React.RefObject<HTMLDivElement>, selectedMusicXML: string | null) => {
  const [osmd, setOsmd] = useAtom(osmdAtom);
  const [systemChanges, setSystemChanges] = useAtom(systemChangesAtom);
  const [loading, setLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useState<string | null>(null);
  const [selectedSystemChange, setSelectedSystemChange] = useAtom(selectedSystemChangeAtom);

  useEffect(() => {
    const loadSheetMusic = async () => {
      setLoading(true);
      setError(null);

      try {
        if (containerRef.current === null || selectedMusicXML === null) {
          return;
        }
        if (osmd) {
          osmd.clear();
        }
        let { osmd: newOsmd, newSystemChanges, error: newError } = await SheetUtils.load(containerRef, selectedMusicXML);
        setOsmd(newOsmd);
        if (systemChanges.at(-1)?.endMeasure !== newSystemChanges.at(-1)?.endMeasure) {
          setSystemChanges(newSystemChanges);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSheetMusic();

    return () => {
      osmd?.clear();
      osmd?.reset();
      setError(null);
      setLoading(false);
    };
  }, [selectedMusicXML]);

  return { osmd, systemChanges, loading, error };
};