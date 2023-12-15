import * as d3 from 'd3';  // Import D3.js for data visualisation

export class GraphSetup {
    private hostElement: HTMLElement;
    private size: string = '1350px,650px';
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    private ticked;
    private currentlyClicked = null;
    private selectedNode;
    constructor(hostElement) {
        this.hostElement = hostElement;
        this.initializeTooltip();

    }
    getDefaultComponentData() {
        return [
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
    clearSVG(svg)
    {
        svg.selectAll("*").remove();
    }
    initializeSVG() {
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
        return { svg, numericWidth, numericHeight };

    }

    createForceSimulation(nodes, links, numericWidth, numericHeight) {
        return d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(70))
            .force("charge", d3.forceManyBody().strength(-90))
            .force("x", d3.forceX(numericWidth / 2))
            .force("y", d3.forceY(numericHeight / 2));
    }
    createLinks(svg, links) {
        return svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke-opacity", 1)
            .attr("opacity", "1")
            .attr("category", d => d.category)  // Add a category attribute to identify link type
            .attr("stroke", '#d3d3d3');// Set stroke color based on relationType
    }
    createNodes(svg, nodes, colorScale, simulation) {
        return svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .attr("fill", d => colorScale(d.id))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
    }
    initializeTooltip()
    {
        this.tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    }
    applySimulation(nodes, links, simulation) {
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

            // If you have node labels or additional elements to update,
            // you can include them here.
        };

        // Attach the tick function to the simulation
        simulation.on("tick", ticked);
    }
    applyClickHandler()
    {
        d3.select("body").on("click", function (event) {
            if (event.target.nodeName === "body" || event.target.nodeName === "svg") {
                this.currentlyClicked = null;
            }
        });
    }
    public applyMouseover(nodes, links) {
        nodes.on("mouseover", (event, d) => {
            this.showTooltip(event, d);
            // highlightConnected(event, d);
        });
    }
    public applyMouseout(nodes,links) {
        nodes.on("mouseout",  (event, d) =>{

            if (this.currentlyClicked) return;
            this.unHighlight(nodes,links);
            this.hideTooltip();
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
    }
     public applyOnclick(nodes,transformedData,svg,colorType) {
        nodes.on("click",  (event, d) =>{
            this.currentlyClicked = d;
            this.selectedNode = d;
            if (transformedData.primaryNodeIds.includes(d.id)) {
                const node = d3.select(event.currentTarget);
                if (!d.highlighted) {
                    // Highlight the clicked node with a transition
                    node.transition()
                        .attr("r", 20)
                    // .attr("stroke-width", 5.5);
                    // Find the connected primary nodes within pidList
                    const connectedNode = svg.selectAll(".node")
                        .filter(node => {
                            const isConnected = transformedData.primaryNodeIds.includes(node.id) && transformedData.links.some(link =>
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
                            return transformedData.links.some(link => link.source.id === d.id && transformedData.primaryNodeIds.includes(link.target.id));
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
                            const isConnected = transformedData.primaryNodeIds.includes(node.id) && transformedData.links.some(link =>
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
                            return transformedData.links.some(link => link.source.id === d.id);
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
    }
    private showTooltip(event, d) {
        this.tooltip.transition().duration(200).style("opacity", 0.9);
        this.tooltip.html("Node ID: " + d.id)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 30) + "px");
    }
    private hideTooltip() {
        this.tooltip.transition().duration(200).style("opacity", 0);
    }
    private unHighlight(nodes,links) {
        nodes.classed("primary", false);
        nodes.classed("secondary", false);
        links.classed("primary", false);
        links.classed("secondary", false);
    }

     highlightConnectedPrimaryNodes(event, d, links, nodes) {
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
    highlightConnectedNodesAndLinks(event, clickedNode, transformedData) {
        // Highlight the clicked node
        d3.select(`.node[id="${clickedNode.id}"]`).classed("primary", true);

        // Find the links connected to the clicked node
        const connectedLinks = transformedData.links.filter(link =>
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
        transformedData.links.each(function (l) {
            if (l.type === 'primary' && (l.source.id === clickedNode.id || l.target.id === clickedNode.id)) {
                d3.select(this).classed("primary", true);
                transformedData.nodes.filter(n => n.id === l.source.id || n.id === l.target.id).classed("secondary", true);
                d3.select(this).attr("opacity", "1");
            }
        });
    }
     unHighlightOtherThanSelected(transformedData) {
        transformedData.nodes.classed("primary", false);
        // nodes.classed("secondary", false);
        // links.classed("primary", false);
        transformedData.links.classed("secondary", false);
    }
     highlightConnected(event, d, transformedData) {
        d3.select(event.currentTarget).classed("primary", true);
        transformedData.links.each(function (l) {
            if (l.category === 'non_attribute' && (l.source.id === d.id || l.target.id === d.id)) {
                d3.select(this).classed("primary", true);
                transformedData.nodes.filter(n => n.id === l.source.id || n.id === l.target.id).classed("secondary", true);
                d3.select(this).attr("opacity", "1");
            }
        });
    }


    applyDragToNodes(nodes, simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            // If you want the node to be fixed at the new position after dragging, comment out the next two lines.
            d.fx = null;
            d.fy = null;
        }

        const dragHandler = d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        dragHandler(nodes);
    }
}