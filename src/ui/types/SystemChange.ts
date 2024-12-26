export class SystemChange implements ISystemChange {
  startMeasure: number;
  ceilingY: number;
  floorY: number;
  endMeasure: number;
  startTime: number;
  yPosition: number;

  constructor(systemChange: ISystemChange) {
    this.ceilingY = systemChange.ceilingY;
    this.floorY = systemChange.floorY;
    this.startMeasure = systemChange.startMeasure;
    this.endMeasure = systemChange.endMeasure;
    this.startTime = systemChange.startTime;
    this.yPosition = systemChange.yPosition;
  }

  updateStartTime(startTime: number) {
    this.startTime = startTime;
  }
}

/**
 * In manual sync mode, ISystemChange is used to know when
 * the system will iterate. 
 */
export interface ISystemChange {
    ceilingY: number
    floorY: number
    startMeasure: number
    endMeasure: number
    startTime: number
    yPosition: number
}