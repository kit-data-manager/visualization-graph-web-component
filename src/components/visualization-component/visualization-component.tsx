import { Component, Prop, h, Element, Watch } from '@stencil/core';
import * as d3 from 'd3';
import { PrepareData } from '../../utils/dataUtil';
import { GraphSetup } from '../../utils/d3GraphSetup';
import { HandleEvents } from '../../utils/eventHandler';
@Component({
    tag: 'visualization-component',
    styleUrl: 'visualization-component.css',
    shadow: true,
})
/**
 * MyComponent is a custom web component that creates an interactive, force-directed graph
 * using D3.js. It visualizes nodes and links based on provided JSON data.
 */
export class VisualizationComponent {
    @Element() hostElement: HTMLElement;

    /**
    * The size of the graph. Defaults to '1350px,650px'.
    *
    * @prop
    * @type {string}
    */
    @Prop() size: string = '1350px,650px';

    /**
     * Whether to show attributes in the graph. Defaults to true.
     * If true it will show all the attributes/properties 
     * If false it wont show any attributes
     * Default value : true
     * 
     * @prop
     * @type {boolean}
     */
    @Prop() showAttributes: boolean = true;

    /**
    * Whether to show primary links in the graph. 
    * If true it will show all the links between primary nodes
    * Defaults to true.
    * 
    * @prop
    * @type {boolean}
    */
    @Prop() showPrimaryLinks: boolean = true;

    /**
     * Input data in JSON format for the graph.
     *
     * @prop
     * @type {string}
     */
    @Prop() data: string = "[]";

    /**
     * Properties to be excluded from outside the component. Defaults to an empty string.
     *
     * @prop
     * @type {string}
     */
    @Prop() excludedProperties: string = '';

    /**
    * Whether to show hover effects on the graph nodes. Defaults to true.
    *
    * @prop
    * @type {boolean}
    */
    @Prop() showHover: boolean = true;


    public chartData: any;
    /**
    * Declare a private instance variable of the 'PrepareData' class.
    * It is used for preparing or processing data for the chart.
    */
    private dataUtil: PrepareData;

    /**
    * Declare a private instance variable of the 'GraphSetup' class.
    * It is used for setting up and configuring the D3.js graph.
    */
    private d3GraphSetup: GraphSetup;

    /**
    * Declare a private instance variable of the 'HandleEvents' class.
    * It is used for handling events related to the D3.js graph.
    */
    private handleEvents: HandleEvents;

    /**
     * Callback invoked when the 'data' property changes. Updates the visualization.
     *
     * @watch
     * @param {string} newData - The new data.
     */
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

    /**
     * Callback invoked when the 'showAttributes' property changes.
     * Updates the data utility and regenerates the D3 graph.
     *
     * @watch
     * @param {boolean} newValue - The new value of 'showAttributes'.
     */
    @Watch('showAttributes')
    showAttributesChanged(newValue: boolean) {
        this.dataUtil = new PrepareData(this.showPrimaryLinks, newValue);
        this.generateD3Graph(this.chartData);
    }

    /**
     * Lifecycle method invoked when the component is connected.
     * Initializes data utility, D3 graph setup, and parses input data.
     */
    connectedCallback() {
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
    /**
     * Lifecycle method invoked when the component is loaded.
     * Initializes and sets up the D3.js graph.
     */
    componentDidLoad() {
        try {
            this.generateD3Graph(this.chartData);
        }
        catch (error) {
            console.error('Error in input data', error);
        }
    }

    /**
     * Sets up the D3.js graph visualization based on the input data.
     *
     * @param {any[]} setupData - The data to set up the graph.
     */
    generateD3Graph(setupData: any[]) {
        this.dataUtil.setShowAttributes(this.showAttributes);

        // Prepare data
        let defaultComponentData = Array.isArray(setupData) && setupData.length > 0
            ? setupData
            : this.dataUtil.getDefaultComponentData();
        const excludedProperties = this.excludedProperties.split(',');
        let transformedData = this.dataUtil.transformData(defaultComponentData, excludedProperties);

        // Initialize SVG and graph setup
        const { svg, numericWidth, numericHeight } = this.d3GraphSetup.initializeSVG();
        this.d3GraphSetup.clearSVG(svg);

        // Create force simulation
        const simulation = this.d3GraphSetup.createForceSimulation(transformedData.nodes, transformedData.links, numericWidth, numericHeight);

        // Set up color scale
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Create links and nodes
        const links = this.d3GraphSetup.createLinks(svg, transformedData.links);
        const nodes = this.d3GraphSetup.createNodes(svg, transformedData.nodes, colorScale);

        // Apply event handlers
        this.handleEvents.onClick(nodes, links);
        if (this.showHover) this.handleEvents.applyMouseover(nodes);
        this.handleEvents.applyDragToNodes(nodes, simulation)
        this.handleEvents.applyClickHandler();

        // Apply simulation
        this.d3GraphSetup.applySimulation(nodes, links, simulation);

    }

    /**
     * Renders the component with an SVG element for the graph.
     *
     * @return {JSX.Element}
     */
    render() {
        const [width, height] = this.size.split(',').map(s => s.trim());
        return (
            <div>
                <svg id="graph" style={{ width: width, height: height }}></svg>
            </div>
        );
    }

}