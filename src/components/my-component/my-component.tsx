import { Component, Prop, h, Element, Watch } from '@stencil/core';
import * as d3 from 'd3';  // Import D3.js
// import { FDOStore } from './FDOStore.js'; // Import the FDOStore class

@Component({
    tag: 'my-component',
    styleUrl: 'my-component.css',
    shadow: true,
})
export class MyComponent {
    @Element() hostElement: HTMLElement;
    @Prop() showAttributes: boolean = true;
    @Prop() showPrimaryLinks: boolean = false;
    // @Prop() visualizationMode: string = 'all';
    // @Prop() data: any[] | null = null;
    @Prop() data: string = "[]";
    @Prop() excludedProperties: string = ''; // Initialize with an empty string
    // @Prop() data: any[] = [];
    public chartData: any;

    constructor() {
        this.chartData = JSON.parse(this.data)
    }

    // Getter and setter for visualizationMode
    // @Watch('visualizationMode')
    // visualizationModeChanged(newVisualizationMode: string) {
    //     // You can perform any necessary actions when visualizationMode changes
    //     this.visualizationMode = newVisualizationMode;
    //     // this.setupD3Graph(); // Update the visualization when visualizationMode changes
    //     this.setupD3Graph(this.chartData);
    // }
    @Watch('data')
    initialDataChanged(newData) {
        // Update the visualization with the new initial data
        this.data = newData;
        this.chartData = JSON.parse(newData);
        this.setupD3Graph(this.chartData);
    }


    componentDidLoad() {
        // this.setupD3Graph();
        this.setupD3Graph(this.chartData);

    }

    setupD3Graph(data: any[]) {
        // const svg = this.hostElement.shadowRoot.querySelector(".graph");
        const excludedProperties = this.excludedProperties.split(',');
        var componentData = data;
        if (!Array.isArray(componentData) || componentData.length === 0) {
            componentData = [
                {
                    pid: '1',
                    label: 'FDO 1',
                    properties:
                    {
                        'k1': 'K1',
                        'k2': 'K2'
                    }
                    // Add other properties as needed
                },
                {
                    pid: '2',
                    label: 'FDO 2',
                    properties:
                    {
                        'p1': 'P1',
                        'p2': 'P2'
                    }
                    // Add other properties as needed
                },
                {
                    pid: '3',
                    label: 'FDO 3',
                    properties:
                    {
                        'm1': 'M1',
                        'm2': 'M2'
                    }
                    // Add other properties as needed
                },
                // Add more FDO data objects as needed
            ];
        }

        // let store = new FDOStore(componentData);
        let currentlyClicked = null;
        let clicked = false;
        const updateVisualization = (excludedProperties) => {
            const svg = d3.select(this.hostElement.shadowRoot.querySelector(".graph")) as d3.Selection<SVGSVGElement, any, any, any>;
            svg
                .attr("width", '780px')
                .attr("height", '780px')
                .attr('marker-end', 'url(#arrow)');
            const width = +svg.style('width').replace('px', '');
            const height = +svg.style('height').replace('px', '');
            // Create a color scale for node groups
            const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

            // Clear the existing SVG content
            svg.selectAll("*").remove();
            // let includedProperties = document.getElementById("includedProperties").value.split(",");
            let data;
            // switch (mode) {
            // case "primary":
            //     componentData = store.getPrimaryNodesData(excludedProperties);
            //     break;
            // case "all":
            data = this.prepareDataWithClusters(componentData, excludedProperties);
            // break;
            // case "primaryWithLinks":
            //     componentData = store.getPrimaryNodesWithLinksData(excludedProperties);
            //     break;
            //     default:
            //         console.error("Invalid visualization mode:", mode);
            //         return;
            // }


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
        updateVisualization(excludedProperties);

    }
    prepareDataWithClusters(data: any[], excludedProperties: string[]) {
        const nodes = [];
        const links = [];
        const connectedNodes = [];
        const pidList = [];
        //Primary nodes creation
        for (const item of data) {
            const node = {
                id: item.pid,
                label: 'Initial nodes',
                // group: item.group,
                // type: item.type,
                props: [],
            };
            pidList.push(item.pid);
            nodes.push(node);
        }
        //iterate over all properties
        //check if property value is in pidlist-- link source: item.id, target: propertyValue, type : propkey
        //else create secondary node
        //link secondary: item.id , , type: for color
        for (const item of data) {
            for (const [propKey, propValue] of Object.entries(item.properties)) {
                //Primary links (between FDOs) As pidList has FDOs and if propvalue is among thos pids that means it is a link.
                if (pidList.includes(propValue)) {
                    const link =
                    {
                        source: item.pid,
                        target: propValue,
                        type: propKey
                    }
                    if (this.showPrimaryLinks) links.push(link);
                }
                //if it is not in the property value it should be an ordinary node
                else {
                    if (!excludedProperties.includes(propKey) && this.showAttributes) {
                        const secondaryNode =
                        {
                            id: `secondary_${item.pid}_${propKey}`,
                            [propKey]: propValue,
                        }
                        nodes.push(secondaryNode);
                        const link =
                        {
                            source: item.pid,
                            target: secondaryNode.id
                        }
                        links.push(link)
                    }
                }
            }



        }

        console.log('nodes and links', nodes, links);

        return { nodes, links };
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
    render() {
        return (
            <div>
                <svg class="graph"></svg>
                {/* <svg id="graph"></svg> */}
            </div>
        );
    }
}

