import { Component, Prop, h, Element, Watch } from '@stencil/core';
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

    // Getter and setter for includedProperties
    @Watch('includedProperties')
    includedPropertiesChanged(newIncludedProperties: string) {
        // You can perform any necessary actions when includedProperties changes
        this.includedProperties = newIncludedProperties;
    }

    // Getter and setter for visualizationMode
    @Watch('visualizationMode')
    visualizationModeChanged(newVisualizationMode: string) {
        // You can perform any necessary actions when visualizationMode changes
        this.visualizationMode = newVisualizationMode;
    }

    componentDidLoad() {
        this.setupD3Graph();
    }

    setupD3Graph() {
        const svg = this.hostElement.shadowRoot.querySelector(".graph");
        console.log('Selected SVG element first line setup:', svg);
        let store = new FDOStore();
        let currentlyClicked = null;
        let clicked = false;
        const includedProperties = this.includedProperties.split(',');
        // store.generateClusters(includedProperties); // Generate clusters using the included properties
        // updateVisualization(this.visualizationMode, includedProperties);
        console.log('included props', includedProperties);

        const updateVisualization = (mode, includedProperties) => {
            const svg = d3.select(this.hostElement.shadowRoot.querySelector(".graph")) as d3.Selection<SVGSVGElement, any, any, any>;
            console.log('Selected SVG element inside updateVisualization()', svg);
            console.log('mode ', mode);
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
                    data = store.toDataWithClusters(includedProperties);
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

                
            const colorType = d3.scaleOrdinal() // Define a scale for relationType to colors
                .domain(["solid", "dashed", /* add more relationType values here */])
                .range(["#FF5733", "#33FF57", /* add corresponding colors here */]);


            // Create the links
            const links = svg.selectAll(".link")
                .data(data.links)
                .enter()
                .append("line")
                .attr("marker-end", d => 'url(#marker_' + d.relationType + ')')

                .attr("class", (d) => {
                    // Check if a reverse link exists
                    const hasReverseLink = data.links.some((link) => {
                        return (
                            link.source.id === d.target.id &&
                            link.target.id === d.source.id &&
                            link.category === d.category
                        );
                    });
                    return hasReverseLink ? "two-way-dashed" : "link";
                })
                .attr("stroke-opacity", 1)
                .attr("opacity", "1")
                // .attr("stroke-width", d => Math.sqrt(d.value))
                .attr("category", d => d.castegory)  // Add a category attribute to identify link type
                .attr("stroke", d => colorType(d.relationType)) // Set stroke color based on relationType
                .attr("stroke-dasharray", (d) => {
                    // Set stroke-dasharray based on relationType (e.g., "5,5" for dashed)
                    return d.relationType === "dashed" ? "5,5" : "none";
                });


            const nodes = svg.selectAll(".node")
                .data(data.nodes)
                .enter()
                .append("circle")
                .attr("class", "node")
                .attr("r", 10)
                .attr("fill", d => colorScale(d.id))
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .attr("cx", d => d.x) // No offset here
                .attr("cy", d => d.y) // No offset here
                .call(drag(simulation)).on("click", function (event, d) {
                    clicked = true;
                    // un-highlight currently clicked nodes
                    unHighlight();
                    // highlight new clicked node
                    highlightConnectedPrimaryNodes(event, d);
                    // set the new clicked node
                    currentlyClicked = d;
                    // Add a class to the link
                    d3.select(this).classed("link-highlighted", true);
                    d3.select(this).attr("marker-end", "url(#arrowhead-highlighted)");

                }).on("mouseover", function (event, d) {
                    // If a node has been clicked previously and it's not the current node being hovered over
                    if (clicked && currentlyClicked && currentlyClicked !== d) {
                        // Un-highlight previously highlighted nodes and links
                        // unHighlight();

                        // Highlight connected nodes and links of the hovered node
                        highlightConnectedNodesAndLinks(event, d);

                        // Highlight connected links
                        const connectedLinks = data.links.filter(link =>
                            link.source.id === d.id || link.target.id === d.id
                        );


                        // function highlightConnected(event, d) {
                        //     d3.select(event.currentTarget).classed("primary", true);
                        //     links.each(function (l) {
                        //         if (l.category === 'non_attribute' && (l.source.id === d.id || l.target.id === d.id)) {
                        //             d3.select(this).classed("primary", true);
                        //             nodes.filter(n => n.id === l.source.id || n.id === l.target.id).classed("secondary", true);
                        //             d3.select(this).attr("opacity", "1");
                        //         }
                        //     });
                        // }

                        connectedLinks.forEach(link => {
                            d3.select(`.link[source="${link.source.id}"][target="${link.target.id}"]`)
                                .classed("link-highlighted", true)
                                .attr("marker-end", "url(#arrowhead-highlighted)");
                            d3.select(`.link[source="${link.target.id}"][target="${link.source.id}"]`)
                                .classed("link-highlighted", true)
                                .attr("marker-end", "url(#arrowhead-highlighted)");
                        });

                    }
                })
                .on("mouseout", function (event, currentlyClicked) {
                    if (currentlyClicked && clicked) {
                        // Un-highlight nodes and links when mouse moves out of the node
                        unHighlightOtherThanSelected();
                        // Highlight connected nodes and links of the clicked node
                        highlightConnectedNodesAndLinks(event, currentlyClicked);
                    } else {
                        // Un-highlight nodes and links when mouse moves out of the node
                        unHighlight();
                    }
                })

            // Create the labels for nodes
            // const nodeLabels = svg.selectAll(".label")
            //     .data(data.nodes)
            //     .enter()
            //     .append("text")
            //     .attr("class", "label")
            //     .attr("dx", 15)
            //     .attr("dy", 5)
            //     .text(d => d.label)


            function unHighlight() {
                nodes.classed("primary", false);
                nodes.classed("secondary", false);
                links.classed("primary", false);
                links.classed("secondary", false);
            }

            function highlightConnectedPrimaryNodes(event, d) {

                d3.select(event.currentTarget).classed("primary", true);
                links.each(function (l) {
                    if (l.category === 'primary' && (l.source.id === d.id || l.target.id === d.id)) {
                        d3.select(this).classed("primary", true);
                        nodes.filter(n => n.id === l.source.id || n.id === l.target.id).classed("secondary", true);
                        d3.select(this).attr("opacity", "1");
                    }
                });

            }


            function highlightConnectedNodesAndLinks(event, clickedNode) {
                // Highlight the clicked node
                d3.select(`.node[id="${clickedNode.id}"]`).classed("primary", true);

                // Find the links connected to the clicked node
                const connectedLinks = data.links.filter(link =>
                    link.source.id === clickedNode.id || link.target.id === clickedNode.id
                );

                // Highlight the connected links and nodes
                connectedLinks.forEach(link => {
                    d3.select(`.link[source="${link.source.id}"][target="${link.target.id}"]`).classed("primary", true);
                    d3.select(`.link[source="${link.target.id}"][target="${link.source.id}"]`).classed("primary", true);
                    d3.select(`.node[id="${link.source.id}"]`).classed("secondary", true);
                    d3.select(`.node[id="${link.target.id}"]`).classed("secondary", true);
                });

                d3.select(event.currentTarget).classed("primary", true);
                links.each(function (l) {
                    if (l.category === 'primary' && (l.source.id === clickedNode.id || l.target.id === clickedNode.id)) {
                        d3.select(this).classed("primary", true);
                        nodes.filter(n => n.id === l.source.id || n.id === l.target.id).classed("secondary", true);
                        d3.select(this).attr("opacity", "1");
                    }
                });
            }
            function unHighlightOtherThanSelected() {
                nodes.classed("primary", false);
                // nodes.classed("secondary", false);
                // links.classed("primary", false);
                links.classed("secondary", false);
            }

            //When clicking outside nodes or links unhighlight everything
            d3.select("body").on("click", function (event) {
                if (event.target.nodeName === "body" || event.target.nodeName === "svg") {
                    unHighlight();
                    currentlyClicked = null;
                }
            });

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

