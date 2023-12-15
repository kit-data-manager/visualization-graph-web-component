// Import necessary modules and libraries
import { Component, Prop, h, Element, Watch } from '@stencil/core';
import * as d3 from 'd3';  // Import D3.js for data visualisation
import { PrepareData } from './dataUtil';
import { GraphSetup } from './d3GraphSetup'

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
    public chartData: any;
    private dataUtil: PrepareData;
    private d3GraphSetup: GraphSetup;
    constructor() {
        this.dataUtil = new PrepareData(this.showPrimaryLinks, this.showAttributes);
        this.d3GraphSetup = new GraphSetup(this.hostElement);
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

    componentDidLoad() {
        // Initialize and set up the D3.js graph when the component is loaded
        try {
            this.generateD3Graph(this.chartData);
        }
        catch (error) {
            console.error('Error in input data', error);
        }
    }
    // getDefaultComponentData() {
    //     return [
    //         {
    //             pid: "21.11152/ba06424b",
    //             properties: {
    //                 profile: "KIP",
    //                 hasMetadata: "21.11152/ba06424b-17c7-4e3f-9a2e-8d09cf797be3",
    //                 digitalObjectType: "object",
    //                 digitalObjectLocation: "github",
    //                 license: "cc4",
    //                 checksum: "md5sum",
    //                 dateCreated: "24-04-2010",
    //                 dataModified: "24-04-2020"
    //             }
    //         },
    //         {
    //             pid: "21.11152/ba06424b-17c7-4e3f-9a2e-8d09cf797be3",
    //             properties: {
    //                 profile: "HMCProfile",
    //                 licence: "cc4",
    //                 digitalObjectType: 'object',
    //                 digitalObjectLocation: 'github',
    //                 checksum: 'md5sum',
    //                 dateCreated: '24-04-2010',
    //                 dataModified: '24-04-2020'
    //             }
    //         },
    //         {
    //             pid: "21.11152/ba06424b-17c7-4e3f",
    //             properties: {
    //                 profile: "AachenProfile",
    //                 hasMetadata: "21.11152/dd01234b-22f8-4b2f-b66e-9a34df554a4f",
    //                 digitalObjectType: 'object',
    //                 digitalObjectLocation: 'github',
    //                 license: 'cc4',
    //                 checksum: 'md5sum',
    //                 dateCreated: '24-04-2010',
    //                 dataModified: '24-04-2020'
    //             }
    //         },
    //         {
    //             pid: "21.11152/dd01234b-22f8-4b2f-b66e-9a34df554a4f",
    //             properties: {
    //                 profile: "Data Analysis",
    //                 licence: "cc4",
    //                 digitalObjectType: 'object',
    //                 digitalObjectLocation: 'github',
    //                 checksum: 'md5sum',
    //                 dateCreated: '24-04-2010',
    //                 dataModified: '24-04-2020'
    //             }
    //         },
    //         {
    //             pid: "21.11152/ee05678b-33c9",
    //             properties: {
    //                 profile: "AachenProfile",
    //                 hasMetadata: "21.11152/ee05678b-33c9-4b1f-a99f-1d62ef657abc",
    //                 digitalObjectType: 'object',
    //                 digitalObjectLocation: 'github',
    //                 license: 'cc4',
    //                 checksum: 'md5sum',
    //                 dateCreated: '24-04-2010',
    //                 dataModified: '24-04-2020'
    //             }
    //         },
    //         {
    //             pid: "21.11152/ee05678b-33c9-4b1f-a99f-1d62ef657abc",
    //             properties: {
    //                 profile: "HMCProfile",
    //                 licence: "MIT",
    //                 digitalObjectType: 'object',
    //                 digitalObjectLocation: 'github',
    //                 license: 'cc4',
    //                 checksum: 'md5sum',
    //                 dateCreated: '24-04-2010',
    //                 dataModified: '24-04-2020'
    //             }
    //         }
    //     ];
    // }
    // initializeSVG() {
    //     const svg = d3.select(this.hostElement.shadowRoot.querySelector("#graph"));
    //     // Extracting width and height from the size property
    //     const [width, height] = this.size.split(',').map(s => s.trim());
    //     svg
    //         .attr("width", width)
    //         .attr("height", height)
    //         .attr('marker-end', 'url(#arrow)');

    //     // Convert width and height to numerical values for further use
    //     const numericWidth = parseInt(width, 10);
    //     const numericHeight = parseInt(height, 10);
    //     return { svg, numericWidth, numericHeight };

    // }
    // createForceSimulation(nodes, links, numericWidth, numericHeight) {
    //     return d3.forceSimulation(nodes)
    //         .force("link", d3.forceLink(links).id(d => d.id).distance(70))
    //         .force("charge", d3.forceManyBody().strength(-90))
    //         .force("x", d3.forceX(numericWidth / 2))
    //         .force("y", d3.forceY(numericHeight / 2));
    // }
    // createLinks(svg, links) {
    //     return svg.selectAll(".link")
    //         .data(links)
    //         .enter()
    //         .append("line")
    //         .attr("stroke-opacity", 1)
    //         .attr("opacity", "1")
    //         .attr("category", d => d.category)  // Add a category attribute to identify link type
    //         .attr("stroke", '#d3d3d3');// Set stroke color based on relationType
    // }
    // createNodes(svg, nodes, colorScale, simulation) {
    //     return svg.selectAll(".node")
    //         .data(nodes)
    //         .enter()
    //         .append("circle")
    //         .attr("class", "node")
    //         .attr("r", 10)
    //         .attr("fill", d => colorScale(d.id))
    //         .attr("stroke", "#fff")
    //         .attr("stroke-width", 1.5)
    // }
    // Set up the D3.js graph visualization based on the input data
    generateD3Graph(setupData: any[]) {
        // Setting Default data if nothing is provided from outside the component
        let defaultComponentData = Array.isArray(setupData) && setupData.length > 0
            ? setupData
            : this.d3GraphSetup.getDefaultComponentData();
        const excludedProperties = this.excludedProperties.split(',');
        //Transform data into nodes, links
        let transformedData = this.dataUtil.transformData(defaultComponentData, excludedProperties);
        // Initializing SVG with given dimensions and creating force simulation
        const { svg, numericWidth, numericHeight } = this.d3GraphSetup.initializeSVG();
        // Clear the existing SVG content
        this.d3GraphSetup.clearSVG(svg);
        const simulation = this.d3GraphSetup.createForceSimulation(transformedData.nodes, transformedData.links, numericWidth, numericHeight);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        const colorType = d3.scaleOrdinal() // Define a scale for relationType to colors
        const links = this.d3GraphSetup.createLinks(svg, transformedData.links);
        const nodes = this.d3GraphSetup.createNodes(svg, transformedData.nodes, colorScale, simulation);
        this.d3GraphSetup.applyMouseover(nodes, links);
        this.d3GraphSetup.applyMouseout(nodes,links);
        this.d3GraphSetup.applyOnclick(nodes,transformedData,svg,colorType)
        this.d3GraphSetup.applyDragToNodes(nodes, simulation)
        this.d3GraphSetup.applySimulation(nodes, links, simulation);
        // //When clicking outside nodes or links unhighlight everything
        this.d3GraphSetup.applyClickHandler();
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

