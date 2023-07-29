const CONSTANT = {
    TR: "transform",
    TS: (x, y) => `translate(${[x, y]})`,
    CLASS: {
        XAXIS: 'xaxis',
        YAXIS: 'yaxis',
        AXIS_LABEL_GROUP: 'axis_label_group',
        LAGEND_GROUP: 'legend_group',
        FIG: 'fig'
    }
}


class SvgContext {
    /**
     * 表示整个svg作图环境
     */
    constructor(dom) {
        this.marginTop = 50;
        this.marginLeft = 50;
        this.marginRight = 50;
        this.marginBottom = 50;

        this.svgSel = d3.select(dom);
    }

    calc() {
        this.totalWidth = this.svgSel.node().clientWidth;
        this.totalHeight = this.svgSel.node().clientHeight;

        this.figWidth = this.totalWidth - this.marginLeft - this.marginRight;
        this.figHeight = this.totalHeight - this.marginTop - this.marginBottom;

        return this;
    }

    appendFig(){
        const marginLeft = this.marginLeft;
        const marginTop = this.marginTop;
        this.figSel = this.svgSel
            .append("g")
            .attr('id', 'g-figs')
            .attr("class", CONSTANT.CLASS.FIG)
            .attr(CONSTANT.TR, CONSTANT.TS(marginLeft, marginTop));
        return this;
    }
    
}


class Axis{
    static UP = 0
    static BOTTOM = 1
    static LEFT = 2
    static RIGHT = 3

    /**
     * 画坐标轴
     */
    constructor(context){
        /**
         * 在作图环境中添加坐标轴
         */
        this.context = context;

        // 创建方向转换部件
        this.axis_map = {
            [Axis.UP] : d3.axisTop,
            [Axis.BOTTOM]: d3.axisBottom,
            [Axis.LEFT]: d3.axisLeft,
            [Axis.RIGHT]: d3.axisRight,
        }
    }
    
    /**
     * 传入d3的scale对象，画坐标轴
     */
    drawScale(scale, orientation)
    {
        const axis = this.axis_map[orientation](scale);

        let marginUp = this.context.marginTop;
        if(orientation === Axis.BOTTOM){
            marginUp += this.context.figHeight
        }
        let marginLeft = this.context.marginLeft;
        if(orientation === Axis.RIGHT){
            marginLeft += this.context.figWidth
        }

        this.context.svgSel
            .append("g")
            .attr("class", CONSTANT.CLASS.XAXIS)
            .attr(CONSTANT.TR, CONSTANT.TS(marginLeft, marginUp))
            .call(axis);
        return this;
    }
    //add title
    addTitle(text, orientation) {
        let xPos, yPos;
    
        switch(orientation) {
            case Axis.BOTTOM:
                xPos = this.context.figWidth / 2;  // position the title at the middle
                yPos = this.context.figHeight + this.context.marginTop + 30;  // Adjust the 30 as needed for padding below the x-axis
                break;
            case Axis.LEFT:
                xPos = this.context.marginLeft + 20; // Adjust the 20 as needed for padding to the left of y-axis
                yPos = this.context.figHeight / 2;
                break;
            // You can add more cases if needed (e.g., for RIGHT and UP orientations)
        }
    
        this.context.svgSel
            .append("text")
            .attr("x", xPos)
            .attr("y", yPos)
            .attr("text-anchor", "middle")
            .attr("transform", orientation === Axis.LEFT ? "rotate(-90 "+xPos+" "+yPos+")" : "") // Rotate the y-axis label
            .text(text);
    
        return this;
    }
    
}

class HoverTip{
    /**
     * 悬浮在格子上的悬浮框
     */
    constructor()
    {
        this.tooltip = d3.select('body')
            .append("div")
            .style("position", "absolute")
            .style("display", "none");
    }

    /**
     * 在x,y位置显示html的内容
     */
    show(x, y, html){
        this.tooltip
            .style("display", undefined)
            .style("left", x+'px')
            .style('top', y+'px')
            .html(html);
    }

    /**
     * 隐藏悬浮框
     */
    disappear(){
        this.tooltip
            .style("display", "none")
    }
}

class Plot{
    constructor(svgContext) {
        this.svgContext = svgContext;
    }
}

class ScatterPlot extends Plot{
    draw(arr) {
        const { figSel } = this.svgContext;

        // 创建散点图
        return figSel
            .append('g')
            .attr("class", 'subfig')
            .selectAll("circle")
            .data(arr)
            .enter()
            .append("circle")
            .attr("cx", d => this.xScale(d.date))
            .attr("cy", d => this.yScale(d.sum))
            .attr("r", 2)
            .attr("fill", "steelblue");
    }

}


// 在figContext 上画折线图
class LinePlot extends Plot{
    draw(xdata, ydata) {
        // 创建线段生成器
        const lineGenerator = d3.line()
            .x((d, i) => this.xScale(xdata[i]))
            .y((d, i) => this.yScale(ydata[i]));

        // 创建路径元素并绑定数据
        return this.svgContext.figSel
            .append('g')
            .attr('class', 'subfig')
            .append("path")
            .datum(ydata)
            .attr("class", "line")
            .attr('fill', 'none')
            .attr('stroke', 'orange')
            .attr("d", lineGenerator);
    }
}


export {
    SvgContext,
    Axis,
    HoverTip,
    ScatterPlot,
    LinePlot,
}