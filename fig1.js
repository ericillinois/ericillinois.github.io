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
                sum: d3.sum(yearData, e=>e.cases)
            })
        }
    }

    getAllDate(){
        return this.dateByDate.map(e=>e.date)
    }

    getAllCase(){
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
    .attr('width', 305)
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
    
        //draw a line plot
        const allDates = dataAnalyser.getAllDate();
        const allCases = dataAnalyser.getAllCase();
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
                    <p>All Cases: ${data.sum}</p>
                </div>
            `)
            console.log(data)
        })
        .on('mouseleave', function(){
            d3.select(this).style('fill', undefined).attr('r', 2)
            tip.disappear();
        })

        // three points
        // addAnnotate(svgContext, 
        //     xScale(new Date("2020-11-06T00:00:00.000Z")),
        //     yScale(9831874),
        //     100,
        //     -70,
        //     `The first new cases surge during the pandemic`
        // )
        //first point
        {
            const x1Inline = xScale(new Date("2020-11-06T00:00:00.000Z"));
            const y1Inline = yScale(9831874);
            const dxInline = 100;
            const dyInline = -70;
            const strokeInline = 'red';  
            let textInline = `We can clearly see the first surge cases in the pandemic start at 2020-11-06`;
        
            const textArrInline = textInline.split("\n");
            const textCountInline = textArrInline.length;
        
            const x2Inline = x1Inline + dxInline;
            const y2Inline = y1Inline + dyInline;
        
            textInline = textInline.split("\n").map((e, i) => `<tspan x=${x2Inline + 5} dy='1.2em' text-anchor=start>${e}</tspan>`).join("");
        
            svgContext.figSel
                .append("line")
                .attr('stroke', strokeInline)
                .attr("x1", x1Inline)
                .attr("y1", y1Inline)
                .attr("x2", x2Inline)
                .attr("y2", y2Inline);
        
            svgContext.figSel
                .append("rect")
                .attr("x", x2Inline)
                .attr("y", y2Inline)
                .attr('width', 500)
                .attr('height', textCountInline * 20 + 10)
                .attr("fill", 'none')
                .attr('stroke', strokeInline);
        
            svgContext.figSel
                .append('text')
                .attr('x', x2Inline)
                .attr('y', y2Inline + 5)
                .html(textInline);
        }
        

        // addAnnotate(svgContext, 
        //     xScale(new Date("2021-08-04T00:00:00.000Z")),
        //     yScale(35440283),
        //     100,
        //     -50,
        //     `The second new cases surge \nduring the pandemic`
        // )
        //second point
        

        // addAnnotate(svgContext, 
        //     xScale(new Date("2022-02-22T00:00:00.000Z")),
        //     yScale(78556769),
        //     100,
        //     20,
        //     `The final new cases surge during the pandemic`
        // )
        //third point
{
    const x1Inline3 = xScale(new Date("2022-02-22T00:00:00.000Z"));
    const y1Inline3 = yScale(78556769);
    const dxInline3 = 100;
    const dyInline3 = 20;
    const strokeInline3 = 'red';  
    let textInline3 = `The final new cases surge during the pandemic\n at 2022-02-22`;
    
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


        // explaination
        // addAnnotate(svgContext, 
        //     100,
        //     100,
        //     0,
        //     0,
        //     `Xxxxxxxxxxxxxxxxaaa\nbbb\nccc`,
        //     'blue'
        // )
        //second point
{
    const x1Inline2 = xScale(new Date("2021-08-04T00:00:00.000Z"));
    const y1Inline2 = yScale(35440283);
    const dxInline2 = 60;  
    const dyInline2 = 10;  
    const strokeInline2 = 'red';  
    let textInline2 = `We can see the second surge cases in the pandemic start at 2021-08-04`;  // Replace with your desired annotation
    
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
        .attr('width', 500)  
        .attr('height', textCountInline2 * 20 + 10)
        .attr("fill", 'none')
        .attr('stroke', strokeInline2);
    
    svgContext.figSel
        .append('text')
        .attr('x', x2Inline2)
        .attr('y', y2Inline2 + 5)
        .html(textInline2);
}


        //draw dialog
        const x1 = 100;
        const y1 = 100;
        const dx = 0;
        const dy = 0;
        const stroke = 'blue';
        let text = `The graph distinctly illustrates three prominent growth
        <tspan x='100' dy='1.2em'>waves during the pandemic. The initial spike may</tspan>
        <tspan x='100' dy='1.2em'>be attributed to colder weather, pushing people indoors</tspan>
        <tspan x='100' dy='1.2em'>and causing a lapse in safety measures. Subsequent</tspan>
        <tspan x='100' dy='1.2em'>news reports link the second wave primarily to</tspan>
        <tspan x='100' dy='1.2em'>the more contagious Delta variant. The final surge,</tspan>
        <tspan x='100' dy='1.2em'>meanwhile, could be connected to a new variant</tspan>
        <tspan x='100' dy='1.2em'>or diminishing immunity among the vaccinated.</tspan>


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
        //     .drawScale(yScale, Axis.LEFT)
        //     .drawScale(xScale, Axis.BOTTOM)
        

        new Axis(svgContext)
            .drawScale(yScale, Axis.LEFT)
            .addTitle("Cases", Axis.LEFT)
            .drawScale(xScale, Axis.BOTTOM)
            .addTitle("Date", Axis.BOTTOM);
        
}