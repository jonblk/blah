import React from 'react';
import { RESET } from 'jotai/utils';
import { mxlFilePathAtom, videoFilePathAtom, systemChangesAtom, selectedSystemChangeAtom } from '../atoms/state';
import { useAtom } from 'jotai';
import { RefreshCcw } from 'lucide-react';
import { osmdAtom } from '../atoms/state';
import { isLoadingAtom } from '../atoms/state';

export const ResetStateButton: React.FC = () => {
  const [, setMxlFilePath] = useAtom(mxlFilePathAtom);
  const [, setVideoFilePath] = useAtom(videoFilePathAtom);
  const [, setSystemChanges] = useAtom(systemChangesAtom);
  const [, setSelectedSystemChange] = useAtom(selectedSystemChangeAtom);
  const [, setOsmd] = useAtom(osmdAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);

  return (
    <button
      onClick={() => {
        setMxlFilePath(RESET);
        setVideoFilePath(RESET);
        setSystemChanges(RESET);
        setSelectedSystemChange(RESET);
        setIsLoading(false);
        setOsmd(null);
      }}
    >
      <RefreshCcw />
    </button>
    );
};