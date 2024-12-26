import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

export class CursorHelper {
  cursor: any;
  osmd: OpenSheetMusicDisplay
  div: HTMLDivElement

  constructor(osmd: OpenSheetMusicDisplay, div: HTMLDivElement) {
    this.osmd = osmd;
    this.div = div;
  }

  goToPrevLine() {
    const measuresInLine = this.getMeasuresInLine(
      this.getCurrentMeasureNumber()
    );
    const firstMeasureOfLineNumber = measuresInLine[0].measureNumber;
    const measuresInPreviousLine = this.getMeasuresInLine(
      firstMeasureOfLineNumber - 2
    );
    if (!measuresInPreviousLine) return;

    const firstMeasureOfPreviousLineNumber =
      measuresInPreviousLine[0].measureNumber;
    this.goToMeasure(firstMeasureOfPreviousLineNumber);
  }

  goToNextLine() {
    const measuresInLine = this.getMeasuresInLine(
      this.getCurrentMeasureNumber()
    );
    const lastMeasureOfLineNumber = measuresInLine.last().measureNumber;
    const nextMeasure = lastMeasureOfLineNumber + 1;
    if (nextMeasure > this.osmd.GraphicSheet.measureList.length) return;
    this.goToMeasure(nextMeasure);
  }

  goToMeasure(measure: number) {
    //in case we want to go back
    if (measure < this.osmd.cursor.iterator.CurrentMeasure.MeasureNumber) {
      this.osmd.cursor.reset();
    }

    while (
      this.getCurrentCursorMeasure() &&
      this.getCurrentCursorMeasure().MeasureNumber < measure
    )
      this.osmd.cursor.next();

    console.log(this.osmd.cursor.iterator.CurrentMeasure.MeasureNumber) 
    //this.scrollToCursor();
  }

  scrollToCursor() {
    const diffToBar = this.osmd.cursor.cursorElement.getBoundingClientRect().top;


    this.div.scrollBy(0, diffToBar);

    // OR

    // this.osmd.cursor.cursorElement.scrollIntoView({
    //   behavior: diff < 1000 ? "smooth" : "auto",
    //   block: "start",
    // });

    //but it cuts upper part of music sheet
  }

  //no nullchecks
  getCurrentCursorMeasure() {
    return this.osmd.cursor.iterator.CurrentMeasure
    return this.osmd.cursor.VoicesUnderCursor()[0].parentSourceStaffEntry
      .VerticalContainerParent.ParentMeasure;
  }

  getCurrentMeasureNumber() {
    return this.getCurrentCursorMeasure().MeasureNumber;
  }

  getMeasuresInLine(measureNumber: number) {
    if (measureNumber < 0) return;
    return this.osmd.GraphicSheet.measureList[measureNumber][0].parentStaffLine
      .Measures;
  }
}