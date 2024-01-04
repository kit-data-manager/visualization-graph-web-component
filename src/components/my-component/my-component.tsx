// Import necessary modules and libraries
import { Component, Prop, h, Element, Watch } from '@stencil/core';
import * as d3 from 'd3';  // Import D3.js for data visualisation
import { PrepareData } from './dataUtil';
import { GraphSetup } from './d3GraphSetup';
import { HandleEvents } from './eventHandler';
@Component({
    tag: 'my-component',
    styleUrl: 'my-component.css',
    shadow: true, // Enable shadow DOM to encapsulate the component
})
/**
 * MyComponent is a custom web component that creates an interactive, force-directed graph
 * using D3.js. It visualizes nodes and links based on provided JSON data.
 */
export class MyComponent {
    @Element() hostElement: HTMLElement;
    @Prop() size: string = '1350px,650px';
    @Prop() showAttributes: boolean = true; // Show/hide attributes in the graph.
    @Prop() showPrimaryLinks: boolean = false;// Show/hide primary links in the graph.
    @Prop() data: string = "[]"; // Input data in JSON format
    @Prop() excludedProperties: string = ''; // the properties which are excluded from outside the component
    @Prop() showHover: boolean = true;
    public chartData: any;
    private dataUtil: PrepareData;
    private d3GraphSetup: GraphSetup;
    private handleEvents: HandleEvents;
    constructor() {
        this.dataUtil = new PrepareData(this.showPrimaryLinks, this.showAttributes);
        this.d3GraphSetup = new GraphSetup(this.hostElement);
        this.handleEvents = new HandleEvents(this.hostElement);
        // Parse the input data when the component is initialized
        try {
            if (this.data != '') {
                this.chartData = JSON.parse(this.data)
            }
            else {
                this.chartData = [];
            }

        } catch (error) {
            console.error('Input data is incorrect', error);
            this.chartData = [];
        }

    }
    @Watch('data')
    inputDataChanged(newData) {
        // Update the visualization when the data is changed from outside the component.
        try {
            this.data = newData;
            this.chartData = JSON.parse(newData);
            this.generateD3Graph(this.chartData);

        }
        catch (error) {
            console.error('Error in input data', error);
            this.chartData = [];
        }

    }
    @Watch('showAttributes')
    showAttributesChanged(newValue: boolean){
        this.dataUtil = new  PrepareData(this.showPrimaryLinks, newValue);
        this.generateD3Graph(this.chartData);
     }

    componentDidLoad() {
        // Initialize and set up the D3.js graph when the component is loaded
        try {
            this.generateD3Graph(this.chartData);
        }
        catch (error) {
            console.error('Error in input data', error);
        }
    }
    // Set up the D3.js graph visualization based on the input data
    generateD3Graph(setupData: any[]) {
        // Setting Default data if nothing is provided from outside the component
        this.dataUtil.setShowAttributes(this.showAttributes);
        let defaultComponentData = Array.isArray(setupData) && setupData.length > 0
            ? setupData
            : this.dataUtil.getDefaultComponentData();
        const excludedProperties = this.excludedProperties.split(',');
        //Transform data into nodes, links
        let transformedData = this.dataUtil.transformData(defaultComponentData, excludedProperties);
        // Initializing SVG with given dimensions and creating force simulation
        const { svg, numericWidth, numericHeight } = this.d3GraphSetup.initializeSVG();
        // Clear the existing SVG content
        this.d3GraphSetup.clearSVG(svg);
        const simulation = this.d3GraphSetup.createForceSimulation(transformedData.nodes, transformedData.links, numericWidth, numericHeight);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        // const colorType = d3.scaleOrdinal() // Define a scale for relationType to colors
        const links = this.d3GraphSetup.createLinks(svg, transformedData.links);
        const nodes = this.d3GraphSetup.createNodes(svg, transformedData.nodes, colorScale);

        // Initialize details container
        // this.handleEvents.initializeDetailsContainer();

        // Apply mouseover and mouseout events
        // this.handleEvents.applyMouseover(nodes, links);
        // this.handleEvents.applyMouseout(nodes, links);

        // this.d3GraphSetup.applyMouseover(nodes, links);
        // this.d3GraphSetup.applyMouseout(nodes,links);
        // this.handleEvents.applyOnclick(event, d, transformedData)
        // this.clickEvent.applyClick(simulation, nodes, links);
        // this.clickEvent.onClick(nodes, links);
        this.handleEvents.onClick(nodes, links);
        if (this.showHover) this.handleEvents.applyMouseover(nodes);
        this.handleEvents.applyDragToNodes(nodes, simulation)
        // //When clicking outside nodes or links unhighlight everything
        this.handleEvents.applyClickHandler();
        this.d3GraphSetup.applySimulation(nodes, links, simulation);

    }
    render() {
        const [width, height] = this.size.split(',').map(s => s.trim());
        return (
            <div>
                <svg id="graph" style={{ width: width, height: height }}></svg>
            </div>
        );
    }

}