import {Axis, HoverTip, SvgContext, ScatterPlot} from "./component.js"

class DataAnalyser{
    constructor(csvData){
        this.rawCsvData = csvData;
        this.rawCsvData.forEach(e => {
            e['date'] = new Date(e['date'])
        })
        let group = d3.group(this.rawCsvData, e => e['date']);
        console.log(group)

        this.dateByDate = []
        for(let [date,yearData] of group){
            this.dateByDate.push({
                date,
                sum: d3.sum(yearData, e=>e['deaths'])
            })
        }
    }

    getAllDate(){
        return this.dateByDate.map(e=>e.date)
    }

    getAllDeathes(){
        return this.dateByDate.map(e=>e.sum)
    }
}
document.querySelector("#apply-filter").addEventListener("click", () => {
    const startDate = new Date(document.querySelector("#start-date").value);
    const endDate = new Date(document.querySelector("#end-date").value);
    filterDataAndRedraw(startDate, endDate);
});
function filterDataAndRedraw(startDate, endDate) {
    const filteredData = dataAnalyser.rawCsvData.filter(data => {
        const date = new Date(data.date);
        return date >= startDate && date <= endDate;
    });

    const filteredAnalyser = new DataAnalyser(filteredData);
    draw(filteredAnalyser);
}

let dataAnalyser = null;

d3.csv("./data/us-states.csv").then(csvData => {
    window.csvData = csvData;

    console.log(csvData)
    dataAnalyser = new DataAnalyser(csvData);

    draw(dataAnalyser)
})

function addAnnotate(svgContext, x1, y1, dx, dy, text, stroke='red'){
    const textArr = text.split("\n")
    const textCount = textArr.length;
    const maxWidth = d3.max(textArr.map(e=>e.length));

    let x2 = x1 + dx;
    let y2 = y1 + dy;

    text = text.split("\n").map((e, i)=>`<tspan x=${x2+5} dy='1.2em' text-anchor=start>${e}</tspan>`).join("")

    svgContext.figSel
    .append("line")
    .attr('stroke', 'red')
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x1 + dx)
    .attr("y2", y1 + dy)
    
    svgContext.figSel
    .append("rect")
    .attr("x", x2)
    .attr("y", y2)
    .attr('width', maxWidth * 10 + 10)
    .attr('height', textCount * 20 + 10)
    .attr("fill", 'none')
    .attr('stroke', stroke)

    svgContext.figSel
    .append('text')
    .attr('x', x2)
    .attr('y', y2 + 5)
    .html(text)
}

function draw(dataAnalyser){
        // init svg environment
        let svgContext = new SvgContext("#fig");
        svgContext.svgSel.selectAll('*').remove();
        
        svgContext.marginLeft = 100
        svgContext.calc().appendFig();
    
        // draw data
        const allDates = dataAnalyser.getAllDate();
        const allCases = dataAnalyser.getAllDeathes();
        console.log(allDates, allCases)

        let xScale = d3.scaleTime()
            .range([0, svgContext.figWidth])
            .domain(d3.extent(allDates));

        let yScale = d3.scaleLinear()
            .range([svgContext.figHeight, 0])
            .domain([1, d3.max(allCases)]);

        let tip = new HoverTip();

        let scatter = new ScatterPlot(svgContext);
        scatter.xScale = xScale;
        scatter.yScale = yScale;
        scatter.draw(dataAnalyser.dateByDate)
        .on('mouseover', function(e){
            let data = this.__data__;

            d3.select(this).style('fill', 'red').attr('r', 10).style('z-index', 100)
            tip.show(e.offsetX + 100, e.offsetY, `
                <div style='background:#eee;padding:.5em'>
                    <p>Day: ${data.date.toLocaleDateString()}</p>
                    <p>All Deaths: ${data.sum}</p>
                </div>
            `)
            console.log(data)
        })
        .on('mouseleave', function(){
            d3.select(this).style('fill', undefined).attr('r', 2)
            tip.disappear();
        })
        new Axis(svgContext)
        .drawScale(yScale, Axis.LEFT)
        .addTitle("Cases", Axis.LEFT)
        .drawScale(xScale, Axis.BOTTOM)
        .addTitle("Date", Axis.BOTTOM);
}