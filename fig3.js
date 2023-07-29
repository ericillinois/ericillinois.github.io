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
        // init svg context
        let svgContext = new SvgContext("#fig");
        svgContext.svgSel.selectAll('*').remove();
        
        svgContext.marginLeft = 100
        svgContext.calc().appendFig();
    
        // draw a line plot
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
                    <p>All Deathes: ${data.sum}</p>
                </div>
            `)
            console.log(data)
        })
        .on('mouseleave', function(){
            d3.select(this).style('fill', undefined).attr('r', 2)
            tip.disappear();
        })

        // three waves
        // addAnnotate(svgContext, 
        //     xScale(new Date("2020-11-18T00:00:00.000Z")),
        //     yScale(250415),
        //     100,
        //     -20,
        //     `a`
        // )
        // New figure's first point
{
    const x1Inline1 = xScale(new Date("2020-11-18T00:00:00.000Z"));
    const y1Inline1 = yScale(250415);
    const dxInline1 = 100;
    const dyInline1 = -20;
    const strokeInline1 = 'red';  
    let textInline1 = `We can see the first death wave surge in the pandemic start at 2020-11-18`;
    
    const textArrInline1 = textInline1.split("\n");
    const textCountInline1 = textArrInline1.length;
    
    const x2Inline1 = x1Inline1 + dxInline1;
    const y2Inline1 = y1Inline1 + dyInline1;
    
    textInline1 = textInline1.split("\n").map((e, i) => `<tspan x=${x2Inline1 + 5} dy='1.2em' text-anchor=start>${e}</tspan>`).join("");
    
    svgContext.figSel
        .append("line")
        .attr('stroke', strokeInline1)
        .attr("x1", x1Inline1)
        .attr("y1", y1Inline1)
        .attr("x2", x2Inline1)
        .attr("y2", y2Inline1);
    
    svgContext.figSel
        .append("rect")
        .attr("x", x2Inline1)
        .attr("y", y2Inline1)
        .attr('width', 485)  
        .attr('height', textCountInline1 * 20 + 10)
        .attr("fill", 'none')
        .attr('stroke', strokeInline1);
    
    svgContext.figSel
        .append('text')
        .attr('x', x2Inline1)
        .attr('y', y2Inline1 + 5)
        .html(textInline1);
}


        // addAnnotate(svgContext, 
        //     xScale(new Date("2021-08-26T00:00:00.000Z")),
        //     yScale(634735),
        //     100,
        //     20,
        //     `b`
        // )
        // New figure's second point
        // New figure's second point
{
    const x1Inline2 = xScale(new Date("2021-08-26T00:00:00.000Z"));
    const y1Inline2 = yScale(634735);
    const dxInline2 = 100;
    const dyInline2 = 20;
    const strokeInline2 = 'red';  
    let textInline2 = `We can see the second death surge in the pandemic start at 2021-08-26`;
    
    const textArrInline2 = textInline2.split("\n");
    const textCountInline2 = textArrInline2.length;
    
    const x2Inline2 = x1Inline2 + dxInline2;
    const y2Inline2 = y1Inline2 + dyInline2;
    
    textInline2 = textInline2.split("\n").map((e, i) => `<tspan x=${x2Inline2 + 5} dy='1.2em' text-anchor=start>${e}</tspan>`).join("");
    
    svgContext.figSel
        .append("line")
        .attr('stroke', strokeInline2)
        .attr("x1", x1Inline2)
        .attr("y1", y1Inline2)
        .attr("x2", x2Inline2)
        .attr("y2", y2Inline2);
    
    svgContext.figSel
        .append("rect")
        .attr("x", x2Inline2)
        .attr("y", y2Inline2)
        .attr('width', 470)  
        .attr('height', textCountInline2 * 20 + 10)
        .attr("fill", 'none')
        .attr('stroke', strokeInline2);
    
    svgContext.figSel
        .append('text')
        .attr('x', x2Inline2)
        .attr('y', y2Inline2 + 5)
        .html(textInline2);
}


        // addAnnotate(svgContext, 
        //     xScale(new Date("2022-02-28T00:00:00.000Z")),
        //     yScale(948855),
        //     30,
        //     30,
        //     `c`
        // )
        // New figure's third point
{
    const x1Inline3 = xScale(new Date("2022-02-28T00:00:00.000Z"));
    const y1Inline3 = yScale(948855);
    const dxInline3 = 30;
    const dyInline3 = 30;
    const strokeInline3 = 'red';  
    let textInline3 = `The final new cases surge during the pandemic\n at 2022-02-28`;
    
    const textArrInline3 = textInline3.split("\n");
    const textCountInline3 = textArrInline3.length;
    
    const x2Inline3 = x1Inline3 + dxInline3;
    const y2Inline3 = y1Inline3 + dyInline3;
    
    textInline3 = textInline3.split("\n").map((e, i) => `<tspan x=${x2Inline3 + 5} dy='1.2em' text-anchor=start>${e}</tspan>`).join("");
    
    svgContext.figSel
        .append("line")
        .attr('stroke', strokeInline3)
        .attr("x1", x1Inline3)
        .attr("y1", y1Inline3)
        .attr("x2", x2Inline3)
        .attr("y2", y2Inline3);
    
    svgContext.figSel
        .append("rect")
        .attr("x", x2Inline3)
        .attr("y", y2Inline3)
        .attr('width', 305)  
        .attr('height', textCountInline3 * 20 + 10)
        .attr("fill", 'none')
        .attr('stroke', strokeInline3);
    
    svgContext.figSel
        .append('text')
        .attr('x', x2Inline3)
        .attr('y', y2Inline3 + 5)
        .html(textInline3);
}


        // // Explanation box
        // addAnnotate(svgContext, 
        //     100,
        //     100,
        //     0,
        //     0,
        //     `Xxxxxxxxxxxxxxxxaaa\nbbb\nccc\nccccccccc\nddddddddddddd`,
        //     'blue'
        // )
        //draw dialog
        const x1 = 100;
        const y1 = 30;
        const dx = 0;
        const dy = 0;
        const stroke = 'blue';
        let text = `From the graph, it's evident that three distinct
        <tspan x='100' dy='1.2em'>death growth waves emerged during the pandemic.</tspan>
        <tspan x='100' dy='1.2em'>Notably, each death wave trails its corresponding</tspan>
        <tspan x='100' dy='1.2em'>spike in new cases. This pattern is a common</tspan>
        <tspan x='100' dy='1.2em'>epidemiological observation, signifying a delay</tspan>
        <tspan x='100' dy='1.2em'>between initial infection and the potential progression</tspan>
        <tspan x='100' dy='1.2em'>to fatal outcomes. During this interim, the</tspan>
        <tspan x='100' dy='1.2em'>disease evolves, leading to hospitalizations and,</tspan>
        <tspan x='100' dy='1.2em'>regrettably, some resulting deaths.</tspan>


        `;

        let x2 = x1 + dx;
        let y2 = y1 + dy;


        svgContext.figSel
            .append("line")
            .attr('stroke', 'red')
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x1 + dx)
            .attr("y2", y1 + dy);

        svgContext.figSel
            .append("rect")
            .attr("x", x2)
            .attr("y", y2)
            .attr('width', 360)
            .attr('height', 180)
            .attr("fill", 'none')
            .attr('stroke', stroke);

        svgContext.figSel
            .append('text')
            .attr('x', x2)
            .attr('y', y2 + 20)
            .html(text);

    
        // new Axis(svgContext)
        // .drawScale(yScale, Axis.LEFT)
        // .drawScale(xScale, Axis.BOTTOM)
        new Axis(svgContext)
        .drawScale(yScale, Axis.LEFT)
        .addTitle("Cases", Axis.LEFT)
        .drawScale(xScale, Axis.BOTTOM)
        .addTitle("Date", Axis.BOTTOM);
}