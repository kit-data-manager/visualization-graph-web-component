import { Component, Prop, h, Element } from '@stencil/core';
import { format } from '../../utils/utils';
import * as d3 from 'd3';  // Import D3.js
import { FDOStore } from './FDOStore.js'; // Import the FDOStore class

@Component({
    tag: 'my-component',
    styleUrl: 'my-component.css',
    shadow: true,
})
export class MyComponent {
    @Element() hostElement: HTMLElement;
    @Prop() includedProperties: string = 'KIP,SIP,TIP,KIT,SAP,RWTH,BIRLA,KPMG,IIT';
    @Prop() visualizationMode: string = 'all';
    componentDidLoad() {
        // console.log('Host element:', this.hostElement);
        // const shadowRoot = this.hostElement.shadowRoot;
        // console.log('Shadow DOM:', shadowRoot);

        // console.log('d3.select(this.hostElement)', this.hostElement.shadowRoot);
        // const svg = d3.select(shadowRoot.querySelector(".graph"));
        // console.log('D3-selected element within shadow DOM:', svg);
        console.log('Host element:', this.hostElement);
        console.log('Shadow root:', this.hostElement.shadowRoot);
        // const svg = this.hostElement.shadowRoot.querySelector(".graph");
        // console.log('Selected SVG element:', svg);


        this.setupD3Graph();
        console.log('componentDidLoad called')
    }

    setupD3Graph() {
        const svg = this.hostElement.shadowRoot.querySelector(".graph");
        console.log('Selected SVG element first line setup:', svg);
        let store = new FDOStore();
        // let currentlyClicked = null;
        // let clicked = false;
        const includedProperties = this.includedProperties.split(',');
        store.generateClusters(includedProperties); // Generate clusters using the included properties
        // updateVisualization(this.visualizationMode, includedProperties);
        console.log('included props', includedProperties);

        const updateVisualization = (mode, includedProperties) => {
            const svg = d3.select(this.hostElement.shadowRoot.querySelector(".graph")) as d3.Selection<SVGSVGElement, any, any, any>;
            console.log('Selected SVG element inside updateVisualization()', svg);
            console.log('mode ', mode);
            // Set up the SVG container
            // const svg = d3.select("#graph")

            // const svg = d3.select(this.hostElement).shadowRoot.querySelector(".graph");

            // const svg = d3.select(this.hostElement).shadowRoot.querySelector(".graph")
            svg
                .attr("width", '780px')
                .attr("height", '780px')
                .attr('marker-end', 'url(#arrow)');

            // .attr("transform","scale(0.2,0.2)")
            console.log('SVG element found:', svg);


            console.log('if (svg.empty()) ', svg);
            const width = +svg.style('width').replace('px', '');
            const height = +svg.style('height').replace('px', '');
            // Create a color scale for node groups
            const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

            // Clear the existing SVG content
            svg.selectAll("*").remove();
            // let includedProperties = document.getElementById("includedProperties").value.split(",");

            let data;
            switch (mode) {
                case "primary":
                    data = store.getPrimaryNodesData(includedProperties);
                    break;
                case "all":
                    data = store.toData(includedProperties);
                    break;
                case "primaryWithLinks":
                    data = store.getPrimaryNodesWithLinksData(includedProperties);
                    break;
                default:
                    console.error("Invalid visualization mode:", mode);
                    return;
            }

            // Create a force simulation
            const simulation = d3.forceSimulation(data.nodes)
                .force("link", d3.forceLink(data.links).id(d => d.id).distance(70)) // Ensure the id accessor is correct
                .force("charge", d3.forceManyBody().strength(-90))
                .force("x", d3.forceX(width / 2))
                .force("y", d3.forceY(height / 2));



            const nodes = svg.selectAll(".node")
                .data(data.nodes)
                .enter()
                .append("circle")
                .attr("class", "node")
                .attr("r", 10)
                .attr("fill", d => colorScale(d.group))
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .attr("cx", d => d.x) // No offset here
                .attr("cy", d => d.y) // No offset here
                .call(drag(simulation));
                
            console.log('inside nodes', nodes);

            // Create the labels for nodes
            // const nodeLabels = svg.selectAll(".label")
            //     .data(data.nodes)
            //     .enter()
            //     .append("text")
            //     .attr("class", "label")
            //     .attr("dx", 15)
            //     .attr("dy", 5)
            //     .text(d => d.label)

            // Create the links
            const links = svg.selectAll(".link")
                .data(data.links)
                .enter()
                .append("line")
                .attr("class", "link")
                .attr("stroke-opacity", 0.6)
                .attr("opacity", "1")
                // .attr("stroke-width", d => Math.sqrt(d.value))
                .attr("category", d => d.castegory)  // Add a category attribute to identify link type
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

                // const links = svg.selectAll(".link")
                // .data(data.link)
                // .enter()
                // .append("line")
                // .attr("class", "link")
                // .attr("stroke", "#999")
                // .attr("stroke-opacity", 0.6)
                // .attr("opacity", "1")



            // function drag(simulation) {

            function drag(simulation) {
                function dragstarted(event) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                }

                function dragged(event, d) {
                    d.x = event.x;
                    d.y = event.y;
                    ticked();  // Manually call the ticked function
                }

                function dragended(event) {
                    if (!event.active) simulation.alphaTarget(0);
                }

                return d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
            }
            // Define the tick function
            const ticked = () => {
                links
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
                // .attr("class", d => `link ${d.category}`);  // Apply the category class to links


                nodes
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);

                    

                // nodeLabels
                //     .attr("x", d => d.x)
                //     .attr("y", d => d.y);

            };

            // Run the simulation
            simulation.on("tick", ticked);
        }
        updateVisualization(this.visualizationMode, includedProperties);
        console.log('included props', includedProperties);

    }
    /**
     * The first name
     */
    @Prop() first: string;

    /**
     * The middle name
     */
    @Prop() middle: string;

    /**
     * The last name
     */
    @Prop() last: string;

    private getText(): string {
        return format(this.first, this.middle, this.last);
    }

    render() {
        return (
            <div>
                <div>Hello, World! I'm {this.getText()}</div>
                <svg class="graph"></svg>

                {/* <svg id="graph"></svg> */}
            </div>
        );
    }
}

