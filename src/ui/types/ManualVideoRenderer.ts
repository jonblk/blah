import { IVideoRenderer } from "./VideoRenderer"
import { ISystemChange } from "./SystemChange"

export interface IManualVideoRenderer extends IVideoRenderer {
    systemsPerFrame: number
    systemChanges: ISystemChange[]
}