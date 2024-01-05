import * as d3 from 'd3';

/**
 * Class responsible for handling interactive events on the graph nodes.
 */
export class HandleEvents {
    private currentlyClicked = null;
    private hostElement;
    /**
     * Creates an instance of HandleEvents.
     *
     * @constructor
     * @param {HTMLElement} hostElement - The HTML element that hosts the D3.js graph.
     */
    constructor(hostElement) {
        this.hostElement = hostElement;
        // console.log(this.currentlyClicked, this.hostElement);
    }

    /**
     * Applies mouseover event handling to the nodes for displaying tooltips.
     *
     * @param {any} nodes - D3 selection of graph nodes.
     */
    applyMouseover(nodes, tooltip) {
        nodes.on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);

            // Get the length of the tooltip content
            const tooltipContent = `${d.id}`;
            const textLength = tooltipContent.length * 7.3;

            const rectWidth = textLength + 20; // Additional padding

            const tooltipContentHtml = `<rect width="${rectWidth}" height="40" fill="#fff" stroke="#ccc" rx="15" ry="15"></rect>
            <text x="10" y="25" fill="#000">${d.id}</text>`;

            tooltip.html(tooltipContentHtml)
                .style('transform', `translate(${event.pageX -100}px, ${event.pageY - 40}px)`); 

        });

        nodes.on('mousemove', (event) => {
            tooltip.style('transform', `translate(${event.pageX - 40}px, ${event.pageY - 40}px)`);
        });

        // Handle mouseout event for nodes
        nodes.on('mouseout', () => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0);
        });
    }

    /**
     * Handles the onClick event for nodes, updating their sizes and related links.
     *
     * @param {any} nodes - D3 selection of graph nodes.
     * @param {any} links - D3 selection of graph links.
     */
    onClick(nodes, links) {
        const handleNodeClick = (event, d) => {
            // Reset the size for all nodes
            nodes.attr("r", 10)

            // Increase the size of the clicked primary node
            const selectedNode = d3.select(event.currentTarget)
            if (selectedNode.category === 'non_attribute') {
                selectedNode.attr("r", 15).attr("opacity", 1);
            }

            // Iterate through links and update size
            links.each(function (l) {
                if (l.category === 'non_attribute' && (l.source.id === d.id || l.target.id === d.id)) {
                    d3.select(this).attr("stroke-opacity", 1);
                    nodes.filter(n => n.id === l.source.id || n.id === l.target.id)
                        .attr("r", 20)
                        .attr("opacity", 1);;
                }
            });

        };


        nodes.on('click', (event, d) => handleNodeClick(event, d));
    }

    /**
     * Applies a click handler to the body element to reset currentlyClicked when clicking outside the graph.
     */
    applyClickHandler() {
        d3.select("body").on("click", function (event) {
            if (event.target.nodeName === "body" || event.target.nodeName === "svg") {
                this.currentlyClicked = null;
            }
        });
    }

    /**
     * Applies drag functionality to nodes using D3 drag behavior.
     *
     * @param {any} nodes - D3 selection of graph nodes.
     * @param {any} simulation - D3 force simulation.
     */
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