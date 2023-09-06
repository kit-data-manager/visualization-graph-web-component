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
        this.renderD3Graph();
        console.log('componentDidLoad called')
    }

    renderD3Graph() {
        let store = new FDOStore();
        let currentlyClicked = null;
        let clicked = false;
        const includedProperties = this.includedProperties.split(',');
        store.generateClusters(includedProperties); // Generate clusters using the included properties
        updateVisualization(this.visualizationMode, includedProperties);
        console.log('included props', includedProperties);
        // let data = store.toData();
        let data;
        switch (this.visualizationMode) {
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
                console.error("Invalid visualization mode:", this.visualizationMode);
                return;
        }
        

        // Set up the SVG container
        const svg = d3.select("#graph")
        // const svg = d3.select(this.hostElement).shadowRoot.querySelector(".graph")
            .attr("width", "740px")
            .attr("height", "580px")
            .attr('marker-end', 'url(#arrow)');

        const width = +svg.style('width').replace('px', '');
        const height = +svg.style('height').replace('px', '');
        // Create a color scale for node groups
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Create a force simulation
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-90))
            .force("x", d3.forceX(width / 2))
            .force("y", d3.forceY(height / 2));
        // Create the links
        const links = svg.selectAll(".link")
            .data(data.links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("opacity", "1")
            .attr("opacity", "1")
            .attr("category", d => d.category)  // Add a category attribute to identify link type
        console.log('links', links)
        // Create the nodes
        const nodes = svg.selectAll(".node")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .attr("fill", d => colorScale(d.group))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .call(drag(simulation))

        // Create the labels for nodes
        const nodeLabels = svg.selectAll(".label")
            .data(data.nodes)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("dx", 15)
            .attr("dy", 5)
            .text(d => d.label)

        // Define the tick function
        const ticked = () => {
            links
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            nodes
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            nodeLabels
                .attr("x", d => d.x)
                .attr("y", d => d.y);


            if (zoomTransform) {
                links.attr("transform", zoomTransform);
                nodes.attr("transform", zoomTransform);
                nodeLabels.attr("transform", zoomTransform);
            }
        };
        // Enable dragging behavior for nodes

        function drag(simulation) {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;  // Save the initial position when dragging starts
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.x = event.x;
                d.y = event.y;
                ticked();  // Manually call the ticked function
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;  // Release the fixed position when dragging ends
                d.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        // Tooltip functions

        let zoomTransform = null;

        svg.call(d3.zoom()
            .extent([[0, 0], [width, height]])
            .scaleExtent([0, 8])
            .on("zoom", zoomed));

        function zoomed(event) {
            zoomTransform = event.transform;
            links.attr("transform", zoomTransform);
            nodes.attr("transform", zoomTransform);
            nodeLabels.attr("transform", zoomTransform);
        }
        function updateVisualization(mode, includedProperties) {
            console.log('mode ', mode);
            // Set up the SVG container
            const svg = d3.select("#graph")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr('marker-end', 'url(#arrow)')

                // .attr("transform","scale(0.2,0.2)")
                ;
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


            // Create the links
            // const links = svg.selectAll(".link")
            //     .data(data.links)
            //     .enter()
            //     .append("line")
            //     .attr("class", "link")
            //     .attr("opacity", "1")
            //     .attr("category", d => d.category)  // Add a category attribute to identify link type
            //     // .style("stroke", d => d.category === "primary" ? "#999" : "#ccc")  // Change the stroke color based on category
            //     .style("stroke-width", d => d.category === "primary" ? 2 : 1)  // Change the stroke width based on category
            //     .attr("marker-end", d => d.category === "primary" ? "url(#arrowhead)" : null)
            //     .attr("marker-start", d => d.category === "primary" ? "url(#arrowhead)" : null);

            // Create the nodes
            // const nodes = svg.selectAll(".node")
            //     .data(data.nodes)
            //     .enter()
            //     .append("circle")
            //     .attr("class", "node")
            //     .attr("r", 10)
            //     .attr("fill", d => colorScale(d.group))
            //     .attr("stroke", "#fff")
            //     .attr("stroke-width", 1.5)
            //     .call(drag(simulation))


            // //When clicking outside nodes or links unhighlight everything
            // d3.select("body").on("click", function (event) {
            //     if (event.target.nodeName === "body" || event.target.nodeName === "svg") {
            //         unHighlight();
            //         currentlyClicked = null;
            //     }
            // });

            function unHighlight() {
                nodes.classed("primary", false);
                nodes.classed("secondary", false);
                links.classed("primary", false);
                links.classed("secondary", false);
            }

            // Create the labels for nodes
            // const nodeLabels = svg.selectAll(".label")
            //     .data(data.nodes)
            //     .enter()
            //     .append("text")
            //     .attr("class", "label")
            //     .attr("dx", 15)
            //     .attr("dy", 5)
            //     .text(d => d.label);

            // Define the tick function
            const ticked = () => {
                links
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)
                // .attr("class", d => `link ${d.category}`);  // Apply the category class to links


                nodes
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);

                nodeLabels
                    .attr("x", d => d.x)
                    .attr("y", d => d.y);

                // if (zoomTransform) {
                //     links.attr("transform", zoomTransform);
                //     nodes.attr("transform", zoomTransform);
                //     nodeLabels.attr("transform", zoomTransform);
                // }

            };

            // Run the simulation
            simulation.on("tick", ticked);
        }


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
                <div class="graph"></div>
                <p>Included Properties: {this.includedProperties}</p>
                <p>Visualization Mode: {this.visualizationMode}</p>
                {/* <svg id="graph"></svg> */}
            </div>
        );
    }
}
