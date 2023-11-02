import { Component, Prop, h, Element, Watch } from '@stencil/core';
import * as d3 from 'd3';  // Import D3.js

@Component({
    tag: 'my-component',
    styleUrl: 'my-component.css',
    shadow: true,
})
export class MyComponent {
    @Element() hostElement: HTMLElement;
    @Prop() showAttributes: boolean = true;
    @Prop() showPrimaryLinks: boolean = false;
    @Prop() data: string = "[]";
    @Prop() excludedProperties: string = ''; // Initialize with an empty string
    public chartData: any;

    constructor() {
        this.chartData = JSON.parse(this.data)
    }
    @Watch('data')
    initialDataChanged(newData) {
        // Update the visualization with the new initial data
        this.data = newData;
        this.chartData = JSON.parse(newData);
        this.setupD3Graph(this.chartData);
    }
    componentDidLoad() {
        this.setupD3Graph(this.chartData);
    }
    setupD3Graph(data: any[]) {
        const excludedProperties = this.excludedProperties.split(',');
        var componentData = data;
        if (!Array.isArray(componentData) || componentData.length === 0) {
            componentData = [
                {
                    "pid": "1",
                    "properties": {
                        "profile": "KIP",
                        "hasMetada": "21.11152/ba06424b-17c7-4e3f-9a2e-8d09cf797be3"
                    }
                },
                {
                    "pid": "21.11152/ba06424b-17c7-4e3f-9a2e-8d09cf797be3",
                    "properties": {
                        "profile": "KIP",
                        "Licence": "cc4"
                    }
                }
            ];
        }
        let currentlyClicked = null;
        let clicked = false;
        // const pidList = [];

        const updateVisualization = (excludedProperties, pidList) => {
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
            let data = this.prepareDataWithClusters(componentData, excludedProperties);
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
                .attr("stroke-opacity", 1)
                .attr("opacity", "1")
                .attr("category", d => d.castegory)  // Add a category attribute to identify link type
                .attr("stroke", d => colorType(d.type)) // Set stroke color based on relationType


            const highlightColor = "yellow"; // Define a highlight color
            console.log('links', links);
            console.log(' data.links', data.links);
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
                .each(function (d) {
                    d.originalR = 10;
                    d.originalStrokeWidth = 1.5;
                    d.highlighted = false;
                })
                .call(drag(simulation))
                .on("click", function (event, d) {
                    if (pidList.includes(d.id)) {
                        const node = d3.select(this);

                        if (!d.highlighted) {
                            // Highlight the clicked node with a transition
                            node.transition()
                                .attr("r", 20)
                                .attr("stroke-width", 5.5);

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
                                .attr("stroke-width", 5.5);

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
                                .attr("stroke-width", 1.5);

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
                                .attr("stroke-width", 1.5);

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

                }).on("mouseover", function (event, d) {
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
                .on("mouseout", function (event, currentlyClicked) {
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
        const { pidList } = this.prepareDataWithClusters(componentData, excludedProperties);
        updateVisualization(excludedProperties, pidList);

    }
    prepareDataWithClusters(data: any[], excludedProperties: string[]) {
        const nodes = [];
        const links = [];
        const pidList = [];
        //Primary nodes creation
        for (const item of data) {
            const node = {
                id: item.pid,
                type: 'primary',
                props: [],
            };
            pidList.push(item.pid);
            nodes.push(node);
        }
        console.log('data', data);
        console.log('pidList', pidList);
        //iterate over all properties
        //check if property value is in pidlist-- link source: item.id, target: propertyValue, type : propkey
        //else create secondary node
        //link secondary: item.id , , type: for color
        for (const item of data) {
            for (const [propKey, propValue] of Object.entries(item.properties)) {
                //Primary links (between FDOs) as pidList has FDOs and if propvalue is among those pids that means it is a primary link.
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
                            type: 'secondary'
                        }
                        nodes.push(secondaryNode);
                        const link =
                        {
                            source: item.pid,
                            target: secondaryNode.id,
                            // type: 'secondary'
                        }
                        links.push(link)
                    }

                }
            }

        }

        return { nodes, links, pidList };
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
            </div>
        );
    }
}

