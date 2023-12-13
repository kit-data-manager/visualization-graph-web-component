// Import necessary modules and libraries
import { Component, Prop, h, Element, Watch } from '@stencil/core';
import * as d3 from 'd3';  // Import D3.js for data visualisation


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
    public chartData: any; //
    constructor() {
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
            this.setupD3Graph(this.chartData, this.size);

        }
        catch (error) {
            console.error('Error in input data', error);
            this.chartData = [];
        }

    }

    componentDidLoad() {
        // Initialize and set up the D3.js graph when the component is loaded
        try {
            this.setupD3Graph(this.chartData, this.size);
        }
        catch (error) {
            console.error('Error in input data', error);
        }
    }
    // Set up the D3.js graph visualization based on the input data
    setupD3Graph(data: any[], size) {
        const excludedProperties = this.excludedProperties.split(',');
        var componentData = data;
        if (!Array.isArray(componentData) || componentData.length === 0) {
            componentData = [
                {
                    pid: "21.11152/ba06424b",
                    properties: {
                        profile: "KIP",
                        hasMetadata: "21.11152/ba06424b-17c7-4e3f-9a2e-8d09cf797be3",
                        digitalObjectType: "object",
                        digitalObjectLocation: "github",
                        license: "cc4",
                        checksum: "md5sum",
                        dateCreated: "24-04-2010",
                        dataModified: "24-04-2020"
                    }
                },
                {
                    pid: "21.11152/ba06424b-17c7-4e3f-9a2e-8d09cf797be3",
                    properties: {
                        profile: "HMCProfile",
                        licence: "cc4",
                        digitalObjectType: 'object',
                        digitalObjectLocation: 'github',
                        checksum: 'md5sum',
                        dateCreated: '24-04-2010',
                        dataModified: '24-04-2020'
                    }
                },
                {
                    pid: "21.11152/ba06424b-17c7-4e3f",
                    properties: {
                        profile: "AachenProfile",
                        hasMetadata: "21.11152/dd01234b-22f8-4b2f-b66e-9a34df554a4f",
                        digitalObjectType: 'object',
                        digitalObjectLocation: 'github',
                        license: 'cc4',
                        checksum: 'md5sum',
                        dateCreated: '24-04-2010',
                        dataModified: '24-04-2020'
                    }
                },
                {
                    pid: "21.11152/dd01234b-22f8-4b2f-b66e-9a34df554a4f",
                    properties: {
                        profile: "Data Analysis",
                        licence: "cc4",
                        digitalObjectType: 'object',
                        digitalObjectLocation: 'github',
                        checksum: 'md5sum',
                        dateCreated: '24-04-2010',
                        dataModified: '24-04-2020'
                    }
                },
                {
                    pid: "21.11152/ee05678b-33c9",
                    properties: {
                        profile: "AachenProfile",
                        hasMetadata: "21.11152/ee05678b-33c9-4b1f-a99f-1d62ef657abc",
                        digitalObjectType: 'object',
                        digitalObjectLocation: 'github',
                        license: 'cc4',
                        checksum: 'md5sum',
                        dateCreated: '24-04-2010',
                        dataModified: '24-04-2020'
                    }
                },
                {
                    pid: "21.11152/ee05678b-33c9-4b1f-a99f-1d62ef657abc",
                    properties: {
                        profile: "HMCProfile",
                        licence: "MIT",
                        digitalObjectType: 'object',
                        digitalObjectLocation: 'github',
                        license: 'cc4',
                        checksum: 'md5sum',
                        dateCreated: '24-04-2010',
                        dataModified: '24-04-2020'
                    }
                }
            ];
        }

        let currentlyClicked = null;
        const updateVisualization = (excludedProperties, pidList) => {
            const svg = d3.select(this.hostElement.shadowRoot.querySelector("#graph"));

            // Extracting width and height from the size property
            const [width, height] = this.size.split(',').map(s => s.trim());
            svg
                .attr("width", width)
                .attr("height", height)
                .attr('marker-end', 'url(#arrow)');

            // Convert width and height to numerical values for further use
            const numericWidth = parseInt(width, 10);
            const numericHeight = parseInt(height, 10);
            // Create a color scale for node groups
            const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

            // Clear the existing SVG content
            svg.selectAll("*").remove();
            let data = this.prepareDataWithClusters(componentData, excludedProperties);
            // Create a force simulation
            const simulation = d3.forceSimulation(data.nodes)
                .force("link", d3.forceLink(data.links).id(d => d.id).distance(70)) // Ensure the id accessor is correct
                .force("charge", d3.forceManyBody().strength(-90))
                .force("x", d3.forceX(numericWidth / 2))
                .force("y", d3.forceY(numericHeight / 2));

            const colorType = d3.scaleOrdinal() // Define a scale for relationType to colors
                .domain(["solid", "dashed", /* add more relationType values here */])
                .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

            // Create the links
            const links = svg.selectAll(".link")
                .data(data.links)
                .enter()
                .append("line")
                .attr("stroke-opacity", 1)
                .attr("opacity", "1")
                .attr("category", d => d.castegory)  // Add a category attribute to identify link type
                .attr("stroke", '#d3d3d3');// Set stroke color based on relationType

            const nodes = svg.selectAll(".node")
                .data(data.nodes)
                .enter()
                .append("circle")
                .attr("class", "node")
                .attr("r", 10)
                .attr("fill", d => colorScale(d.id))
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("class", d => `node ${d.type}`) // Use the "type" for class
                .attr("id", d => d.id) // Set the "id" as the node's ID
                .call(drag(simulation))
                .on("mouseover", function (event, d) {
                    showTooltip(event, d);
                    // highlightConnected(event, d);
                    // if (!currentlyClicked) {
                    highlightConnected(event, d);

                    // }



                    // this.displayNodeDetails(d);
                    // If a node has been clicked previously and it's not the current node being hovered over
                    // if (clicked && currentlyClicked && currentlyClicked !== d) {
                    //     // Un-highlight previously highlighted nodes and links
                    //     // unHighlight();

                    //     // Highlight connected nodes and links of the hovered node
                    //     highlightConnectedNodesAndLinks(event, d);

                    //     // Highlight connected links
                    //     const connectedLinks = data.links.filter(link =>
                    //         link.source.id === d.id || link.target.id === d.id
                    //     );
                    //     }

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
                    // connectedLinks.forEach(link => {
                    //     d3.select(`.link[source="${link.source.id}"][target="${link.target.id}"]`)
                    //         .classed("link-highlighted", true)
                    //         .attr("marker-end", "url(#arrowhead-highlighted)");
                    //     d3.select(`.link[source="${link.target.id}"][target="${link.source.id}"]`)
                    //         .classed("link-highlighted", true)
                    //         .attr("marker-end", "url(#arrowhead-highlighted)");
                    // });

                })
                .on("mouseout", function (event, d) {

                    if (currentlyClicked) return;
                    unHighlight();
                    hideTooltip();
                    // Hide the links again
                    // links.each(function (l) {
                    //     // Change opacity only for 'non_attribute' links
                    //     if (l.category === 'non_attribute' && (l.source.id === d.id || l.target.id === d.id)) {
                    //         d3.select(this).attr("opacity", "0");
                    //     }
                    // });
                    // console.log('Mouseout');
                    // if (currentlyClicked && clicked) {
                    //     // Un-highlight nodes and links when mouse moves out of the node
                    //     unHighlightOtherThanSelected();
                    //     // Highlight connected nodes and links of the clicked node
                    //     highlightConnectedNodesAndLinks(event, currentlyClicked);
                    // } else {
                    //     // Un-highlight nodes and links when mouse moves out of the node
                    //     unHighlight();
                    // }
                })
                //On click increase the size of the nodes connected
                .on("click", function (event, d) {
                    currentlyClicked = d;
                    this.selectedNode = d;
                    if (pidList.includes(d.id)) {
                        const node = d3.select(this);
                        if (!d.highlighted) {
                            // Highlight the clicked node with a transition
                            node.transition()
                                .attr("r", 20)
                            // .attr("stroke-width", 5.5);
                            // Find the connected primary nodes within pidList
                            const connectedNode = svg.selectAll(".node")
                                .filter(node => {
                                    const isConnected = pidList.includes(node.id) && data.links.some(link =>
                                    ((link.source.id === d.id && link.target.id === node.id) ||
                                        (link.target.id === d.id && link.source.id === node.id))
                                    );

                                    return isConnected;
                                });
                            connectedNode.transition()
                                .attr("r", 20)
                            // .attr("stroke-width", 5.5);

                            // Find and highlight the connected primary links
                            svg.selectAll(".link")
                                .filter(link => {
                                    return data.links.some(link => link.source.id === d.id && pidList.includes(link.target.id));
                                })
                                .transition()
                                .attr("stroke", "red");
                        } else {
                            // Revert to the original state with a transition
                            node.transition()
                                .attr("r", 10)
                            // .attr("stroke-width", 5.5);
                            // Revert the connected primary nodes within pidList
                            const connectedNode = svg.selectAll(".node")
                                .filter(node => {
                                    const isConnected = pidList.includes(node.id) && data.links.some(link =>
                                    ((link.source.id === d.id && link.target.id === node.id) ||
                                        (link.target.id === d.id && link.source.id === node.id))
                                    ); return isConnected;
                                });
                            connectedNode.transition()
                                .attr("r", 10)
                            // .attr("stroke-width", 5.5);
                            // Revert the connected primary links
                            svg.selectAll(".link")
                                .filter(link => {
                                    return data.links.some(link => link.source.id === d.id);
                                })
                                .transition()
                                .attr("stroke", d => colorType(d.type));
                        }
                        // Toggle the highlighted state
                        d.highlighted = !d.highlighted;
                    }

                    // clicked = true;
                    // // un-highlight currently clicked nodes
                    // unHighlight();
                    // // highlight new clicked node
                    // highlightConnectedPrimaryNodes(event, d);
                    // // set the new clicked node
                    // currentlyClicked = d;

                })
            function unHighlight() {
                nodes.classed("primary", false);
                nodes.classed("secondary", false);
                links.classed("primary", false);
                links.classed("secondary", false);
            }

            function highlightConnectedPrimaryNodes(event, d) {
                d3.select(`.node[id="${d.id}"]`).classed("primary", true);
                d3.select(event.currentTarget).classed("primary", true);
                links.each(function (l) {
                    if (l.type === 'primary' && (l.source.id === d.id || l.target.id === d.id)) {
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
                    if (l.type === 'primary' && (l.source.id === clickedNode.id || l.target.id === clickedNode.id)) {
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
            function highlightConnected(event, d) {
                d3.select(event.currentTarget).classed("primary", true);
                links.each(function (l) {
                    if (l.category === 'non_attribute' && (l.source.id === d.id || l.target.id === d.id)) {
                        d3.select(this).classed("primary", true);
                        nodes.filter(n => n.id === l.source.id || n.id === l.target.id).classed("secondary", true);
                        d3.select(this).attr("opacity", "1");
                    }
                });
            }

            // Tooltip functions
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            function showTooltip(event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html("Node ID: " + d.id)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 30) + "px");
            }
            function hideTooltip() {
                tooltip.transition().duration(200).style("opacity", 0);
            }



            //When clicking outside nodes or links unhighlight everything
            d3.select("body").on("click", function (event) {
                if (event.target.nodeName === "body" || event.target.nodeName === "svg") {
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
        const { primaryNodeIds } = this.prepareDataWithClusters(componentData, excludedProperties);
        updateVisualization(excludedProperties, primaryNodeIds);

    }
    prepareDataWithClusters(data: any[], excludedProperties: string[]) {
        const nodes = [];
        const primaryNodeIds = [];
        const allLinks = [];
        let links = [];
        //Primary nodes creation
        for (const item of data) {
            const node = {
                id: item.pid,
                props: [],
                category: 'non_attribute'
            };
            primaryNodeIds.push(item.pid);
            nodes.push(node);
        }
        for (const item of data) {
            for (const [propKey, propValue] of Object.entries(item.properties)) {
                //Primary links (between FDOs) as pidList has FDOs and if propvalue is among those pids that means it is a primary link.
                if (primaryNodeIds.includes(propValue)) {
                    const link =
                    {
                        source: item.pid,
                        target: propValue,
                        type: propKey,
                        category: 'non_attribute',
                        visible: this.showPrimaryLinks
                    }
                    allLinks.push(link);
                }
                //Attribute nodes and links (if it is not in the property value it should be an ordinary node)
                else {
                    if (!excludedProperties.includes(propKey) && this.showAttributes) {
                        const secondaryNode =
                        {
                            id: `secondary_${item.pid}_${propKey}`,
                            [propKey]: propValue,
                            category: 'attribute'
                        }
                        nodes.push(secondaryNode);
                        const link =
                        {
                            source: item.pid,
                            target: secondaryNode.id,
                            category: 'attribute',
                            visible: true
                        }
                        allLinks.push(link);
                    }

                }
            }
            links = allLinks.filter(link => link.visible);
        }

        return { nodes, links, primaryNodeIds };
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
        const [width, height] = this.size.split(',').map(s => s.trim());
        return (
            <div>
                <svg id="graph" style={{ width: width, height: height }}></svg>
            </div>
        );
    }

}

