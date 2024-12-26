import { CursorType, DrawingParametersEnum, GraphicalMeasure, IOSMDOptions, OpenSheetMusicDisplay, PageFormat } from "opensheetmusicdisplay";
import { ISystemChange, SystemChange } from "../types/SystemChange";
import { } from 'jotai/utils';
import { CursorHelper } from "./CursorHelpler";

const defaultOptions = {
  
  backend: 'canvas',
  disableCursor: false,
  cursorsOptions: [{
    type: CursorType.ShortThinTopLeft,
    color: '#FF0000',
    follow: true,
    alpha: 0.5
  }],
  autoResize: false, // Set to true to enable auto-resizing
  drawTitle: false,
  drawSubtitle: false,
  drawComposer: false,
  drawCredits: false,
  drawPartNames: false,
  drawingParameters: DrawingParametersEnum.compact, 
  drawSlurs: true,
  drawMeasureNumbers: true,
  drawTimeSignatures: true,
  defaultColorMusic: "#000",
  defaultColorLabel: "#000",
  drawMetronomeMarks: false,
  defaultFontFamily: "System",
  drawMeasureNumbersOnlyAtSystemStart: true,
  //drawingParameters: DrawingParametersEnum.compact, 
} as IOSMDOptions

export class SheetUtils {
  static div: HTMLDivElement | null = null

  /***
   * Draws the thing
   */
  public static draw(osmd: OpenSheetMusicDisplay, systemChanges: ISystemChange[], selectedSystemChange: number) {
    const system = systemChanges[selectedSystemChange];
    osmd.setOptions({ 
      drawFromMeasureNumber: system.startMeasure, 
      drawUpToMeasureNumber: system.endMeasure 
    });
    osmd.render();
  }

  // delete this shit later
  public static moveCursor(osmd: OpenSheetMusicDisplay, selectedMeasure: number) {
    if (this.div) {
      const ch = new CursorHelper(osmd, this.div); //CursorHelper.
      ch.goToMeasure(selectedMeasure);
    } else {
      console.error("No parent div, cannot move cursor")
    }
  }

  // much faster than moveCursor
  public static scrollToMeasure(zoom: number, sc: ISystemChange) {
    console.log(`now scrolling to: ${sc.ceilingY}`)
    console.log(sc)
    this.div?.scrollTo({
      left: 0, 
      top: sc.ceilingY*10
    })
  }

  public static async load(containerRef: React.RefObject<HTMLDivElement>, selectedMusicXML: string): Promise<{ osmd: OpenSheetMusicDisplay | null, newSystemChanges: ISystemChange[], error: string | null }> {
    this.div = containerRef.current;
    let osmd: OpenSheetMusicDisplay | null = null;
    if (selectedMusicXML && containerRef.current) {
      try {
        console.log("Starting to load MusicXML file:", selectedMusicXML);
        const musicXMLContent = await window.electron.readMusicXMLFile(selectedMusicXML);
        osmd = new OpenSheetMusicDisplay(containerRef.current, defaultOptions);
        await osmd.load(musicXMLContent);

        // draw pages
        //osmd.setOptions({drawUpToPageNumber:1})
        //osmd.setPageFormat(1)
        //osmd.setCustomPageFormat(600, 800);

        osmd.Zoom = 1;
        //osmd.setOptions({drawUpToMeasureNumber: 15})
        osmd.render();
        osmd.Cursor.show();

        const systems = osmd.graphic.MeasureList;
        let lastMeasureYPosition: number = 0;
        const tempSystemChanges: ISystemChange[] = [];

        let ceilingY = 0;
        let floorY = 0;

        systems.forEach((system, index) => {
          const s0 = system[0];
          const yPosition = s0.boundingBox.absolutePosition.y;
          const lastMeasure = s0.ParentStaffLine?.Measures.at(-1)?.MeasureNumber;

          // for(let ok of s0.staffEntries) {
          //  maxHeight = Math.max(
          //    maxHeight, 
          //    ok.PositionAndShape.AbsolutePosition.y + ok.getHighestYAtEntry()
          //  );
            //console.log(ok.getHighestYAtEntry())
          // }
          //maxHeight = Math.max(yPosition + s0.boundingBox.BorderTop);

          //console.log(s0.ParentStaffLine.Measures[0].staffEntries[0].PositionAndShape.BoundingRectangle.y)
          
          ceilingY = yPosition + s0.ParentStaffLine?.SkyBottomLineCalculator.getSkyLineMin() 

          floorY = yPosition + s0.ParentStaffLine?.SkyBottomLineCalculator.getBottomLineMax() 

          if (yPosition > lastMeasureYPosition && lastMeasure) {
            console.log(ceilingY)
            tempSystemChanges.push(new SystemChange({
              startTime: -1,
              ceilingY,
              floorY,
              startMeasure: s0.measureNumber,
              endMeasure: lastMeasure,
              yPosition
            }));
            lastMeasureYPosition = yPosition;
          }
        });

        return {
          osmd,
          newSystemChanges: tempSystemChanges,
          error: null
        };
      } catch (error) {
        console.error("Error rendering MusicXML:", error);
        return {
          osmd: null,
          newSystemChanges: [],
          error: error instanceof Error ? error.message : "Failed to load music sheet"
        };
      } finally {
      }
    } else {
      return {
        osmd: null,
        newSystemChanges: [],
        error: "No music sheet selected"
      }
    }
  }
}