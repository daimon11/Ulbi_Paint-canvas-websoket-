import { makeAutoObservable } from "mobx";

class ToolState {
    tool = null
    constructor() {
        makeAutoObservable(this)
    }

    setTool (tool) {
        this.tool = tool;

        console.log('tool', tool)
    }
    setFillColor (color) {
        this.tool.fillColor = color
    }
    setStrokeColor (color) {
        this.tool.strokeColor = color
    }
    setLineWidth (width) {
        this.tool.lineWidth = width;
        console.log(width)
    }
}

export default new ToolState()
