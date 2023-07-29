import {Axis, SvgContext, LinePlot} from "./component.js"

class DataAnalyser{
    constructor(csvData){
        this.rawCsvData = csvData;
        this.rawCsvData.forEach(e => {
            e['date'] = new Date(e['date'])
        })
    }

    getDateOfState(state){
        return this.rawCsvData
            .filter(e => e['state'] === state)
            .map(e => e['date']);
    }

    getCasesOfState(state){
        return this.rawCsvData
            .filter(e => e['state'] === state)
            .map(e => +e['cases']);
    }

    getDeathesOfState(state){
        return this.rawCsvData
            .filter(e => e['state'] === state)
            .map(e => +e['deaths']);
    }

    getAllState(){
        let states = this.rawCsvData.map(e=>e['state']);
        states = new Set(states);
        return [...states]
    }
}

let dataAnalyser = null;

d3.csv("./data/us-states.csv").then(csvData => {
    window.csvData = csvData;

    console.log(csvData)
    dataAnalyser = new DataAnalyser(csvData);

    // use d3js to set the options of state selector
    let stateSelector = d3.select('#state-selector');
    
    stateSelector
    .selectAll("*")
    .data(dataAnalyser.getAllState())
    .enter()
    .append('option')
    .text(t => t)

    stateSelector.on('change', function(){
        console.log(this.value)
        console.log(dataAnalyser.getCasesOfState(this.value))
        draw(dataAnalyser, this.value)
    })

    draw(dataAnalyser, 'Washington')
})


function draw(dataAnalyser, state){
        d3
        .select('#fig-title')
        .text(`Cumulative New Cases and Death Cases for ${state} State`)
        
        let svgContext = new SvgContext("#fig");
        svgContext.svgSel.selectAll('*').remove();
        
        svgContext.marginLeft = 100
        svgContext.calc().appendFig();
    
        const allDates = dataAnalyser.getDateOfState(state);
        const allCases = dataAnalyser.getCasesOfState(state);
        const allDeathes = dataAnalyser.getDeathesOfState(state)
            .map(e => e+1)

        let xScale = d3.scaleTime()
            .range([0, svgContext.figWidth])
            .domain(d3.extent(allDates));

        let yScale = d3.scaleLog()
            .range([svgContext.figHeight, 0])
            .domain([1, d3.max(allCases)]);

        let linePlot = new LinePlot(svgContext);
        linePlot.xScale = xScale;
        linePlot.yScale = yScale;
        linePlot.draw(allDates, allCases)
    
        let linePlot2 = new LinePlot(svgContext);
        linePlot2.xScale = xScale;
        linePlot2.yScale = yScale;
        linePlot2.draw(
            allDates, allDeathes
        )
        .attr('stroke', 'purple')
    
        // draw axis
        // let axis = new Axis(svgContext);
        // axis
        // .drawScale(linePlot.xScale, Axis.BOTTOM)
        // .drawScale(linePlot.yScale, Axis.LEFT)
        new Axis(svgContext)
        .drawScale(yScale, Axis.LEFT)
        .addTitle("Log Scale of Cases", Axis.LEFT)
        .drawScale(xScale, Axis.BOTTOM)
        .addTitle("Date", Axis.BOTTOM);

        // Legend
        const legendData = [
            { label: 'New Cases', color: 'orange' },
            { label: 'Deaths', color: 'purple' }
        ];

        const legend = svgContext.svgSel.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${svgContext.figWidth - 900}, 10)`); // Adjust the position as needed

        legend.selectAll('rect')
            .data(legendData)
            .enter()
            .append('rect')
            .attr('width', 20)
            .attr('height', 20)
            .attr('y', (d, i) => i * 25)
            .attr('fill', d => d.color);

        legend.selectAll('text')
            .data(legendData)
            .enter()
            .append('text')
            .attr('x', 25)
            .attr('y', (d, i) => i * 25 + 15) // Adjust to place text in the center of the corresponding rect
            .text(d => d.label);
}