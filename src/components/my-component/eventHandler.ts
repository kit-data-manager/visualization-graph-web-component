import * as d3 from 'd3';  // Import D3.js for data visualisation

export class HandleEvents {
    // Add a private variable to store the details container
    private detailsContainer: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    // private svg;
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    // private ticked;
    private currentlyClicked = null;
    // private selectedNode;
    // private nodes;
    // private links;
    // private colorType;
    private hostElement;

    constructor(hostElement) {
        this.hostElement = hostElement;
        this.initializeTooltip();
        console.log(this.tooltip,this.currentlyClicked)
        // Attach click event to the shadow root
        const shadowRoot = this.hostElement.shadowRoot;
        shadowRoot.addEventListener("click", function (event) {
            // Check if the click is outside your component
            const isOutsideComponent = !event.composedPath().includes(this.hostElement);

            if (isOutsideComponent) {
                // Reset the state when clicking outside the component
                this.resetState();
            }
        }.bind(this));
    }
    initializeDetailsContainer() {
        this.detailsContainer = d3.select("body")
            .append("div")
            .attr("class", "node-details")
            .style("opacity", 0);
    }

    // applyMouseover(nodes, links) {
    //     nodes.on("mouseover", (event, d) => {
    //         // Calculate the position based on the SVG coordinates
    //         const [xPosition, yPosition] = d3.pointer(event, this.svg.node());

    //         // Show details container
    //         this.detailsContainer.transition()
    //             .duration(200)
    //             .style("opacity", 0.9)
    //             .style("left", `${xPosition + 10}px`) // Adjust as needed
    //             .style("top", `${yPosition - 28}px`); // Adjust as needed

    //         // Set details container content with tooltip icon
    //         this.detailsContainer.html(`
    //         <div class="tooltip">
    //             <div class="tooltip-spacing">
    //                 <div class="tooltip-bg1"></div>
    //                 <div class="tooltip-bg2"></div>
    //                 <div class="tooltip-text">?</div>
    //             </div>
    //             <div class="tooltip-popup">
    //                 <strong>Node ID:</strong> ${d.id}<br>
    //                 <strong>Additional Details:</strong> ${d.additionalDetails || 'N/A'}
    //             </div>
    //         </div>
    //     `);
    //     });
    // }
    // Add this method to handle mouseout event
    applyMouseout(nodes) {
        nodes.on("mouseout", () => {
            // Hide details container on mouseout
            this.detailsContainer.transition()
                .duration(500)
                .style("opacity", 0);
        });
    }
    applyMouseover(nodes) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute');

        // Handle mouseover event for nodes
        nodes.on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`Node ID: ${d.id}`)
                .style('left', (event.pageX + 10) + 'px') // Adjust the offset from the cursor
                .style('top', (event.pageY - 20) + 'px'); // Adjust the offset from the cursor
        });

        // Handle mousemove event for nodes (to update tooltip position)
        nodes.on('mousemove', (event) => {
            tooltip.style('left', (event.pageX + 10) + 'px') // Adjust the offset from the cursor
                .style('top', (event.pageY - 20) + 'px'); // Adjust the offset from the cursor
        });

        // Handle mouseout event for nodes
        nodes.on('mouseout', () => {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
    }

    public applyOnclick(event: any, d: any, transformedData: any) {
        // Un-highlight currently clicked nodes
        this.unHighlight(transformedData.nodes, transformedData.links);

        // Highlight new clicked node and connected nodes
        this.highlightConnected(event.currentTarget, d, transformedData);

        // Set the new clicked node
        this.currentlyClicked = d;
    }

    private unHighlight(nodes, links) {
        nodes.selectAll(".node-class").classed("primary", false);
        nodes.selectAll(".node-class").classed("secondary", false);
        links.selectAll(".link-class").classed("primary", false);
        links.selectAll(".link-class").classed("secondary", false);
    }

    private highlightConnected(currentNode, clickedNode, transformedData) {
        d3.select(currentNode).selectAll(".node-class").classed("primary", true);

        transformedData.links.each(function (l) {
            if (l.category === 'non_attribute' && (l.source.id === clickedNode.id || l.target.id === clickedNode.id)) {
                d3.select(this).selectAll(".link-class").classed("primary", true);
                transformedData.nodes.filter(n => n.id === l.source.id || n.id === l.target.id)
                    .selectAll(".node-class").classed("secondary", true);
            }
        });
    }

    onClick(nodes, links) {
        const handleNodeClick = (event, d) => {
            // Reset the size for all nodes
            nodes.attr("r", 10);

            // Increase the size of the clicked primary node
            const selectedNode = d3.select(event.currentTarget)
            if (selectedNode.category === 'non_attribute') {
                selectedNode.attr("r", 15); // Adjust the desired size for the clicked node
            }

            // Iterate through links and update size
            links.each(function (l) {
                if (l.category === 'non_attribute' && (l.source.id === d.id || l.target.id === d.id)) {
                    d3.select(this)
                    //   .attr("stroke-width", 3); // Adjust the desired size for the primary link

                    // Increase the size for secondary nodes connected via primary links
                    nodes.filter(n => n.id === l.source.id || n.id === l.target.id)
                        .attr("r", 20); // Adjust the desired size for secondary nodes
                }
            });
        };

        nodes.on('click', (event, d) => handleNodeClick(event, d));
    }
    // Function to handle resetting the state
    // private resetState() {
    //     // Reset state logic here
    //     console.log("Resetting state...");
    //     // Example: Reset highlighted state for all nodes
    //     this.nodes.transition().attr("r", 10); // Adjust as needed
    //     this.svg.selectAll(".link").transition().attr("stroke", d => this.colorType(d.type)); // Adjust as needed
    // }
    // private showTooltip(event, d) {
    //     this.tooltip.transition().duration(200).style("opacity", 0.9);
    //     this.tooltip.html("Node ID: " + d.id)
    //         .style("left", (event.pageX + 10) + "px")
    //         .style("top", (event.pageY - 30) + "px");
    // }
    // private hideTooltip() {
    //     this.tooltip.transition().duration(200).style("opacity", 0);
    // }

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

    applyClickHandler() {
        d3.select("body").on("click", function (event) {
            if (event.target.nodeName === "body" || event.target.nodeName === "svg") {
                this.currentlyClicked = null;
            }
        });
    }
    initializeTooltip() {
        this.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
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