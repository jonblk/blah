type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type View = 'CPU' | 'RAM' | 'STORAGE';

type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';

type EventPayloadMapping = {
  renderingStats: any;
  renderingProgress: any;
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
  handleMediaRequest: any;
  selectVideoFile: Promise<string | null>;
  selectMusicXMLFile: Promise<string | null>;
  readMusicXMLFile: Promise<string>;
  sendFrameAction: FrameWindowAction;
  getVideoUrl: (filePath: string) => string;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    /*
    subscribeRenderingStats: (
      callback: (stats: any) => void
    ) => UnsubscribeFunction;
    subscribeStatistics: (
      callback: (stats: any) => void
    ) 
        bypassCSP: trueaticData: () => Promise<StaticData>;
    subscribeChangeView: (
      callback: (view: View) => void
    ) => UnsubscribeFunction;
    */
    getVideoUrl: (filePath: string) => string
    handleMediaRequest: () => Promise<void>;
    sendFrameAction: (payload: FrameWindowAction) => void;
    selectVideoFile: () => Promise<string | null>;
    selectMusicXMLFile: () => Promise<string | null>;
    readMusicXMLFile: (filePath: string) => Promise<string>;
  };
}
