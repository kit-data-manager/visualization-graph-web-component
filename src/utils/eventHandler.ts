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
        console.log(this.currentlyClicked, this.hostElement);
    }

    /**
     * Applies mouseover event handling to the nodes for displaying tooltips.
     *
     * @param {any} nodes - D3 selection of graph nodes.
     */
    applyMouseover(nodes) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute');

        nodes.on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);
            tooltip.html(`PID : ${d.id}`)
                .style('left', (event.pageX + 100) + 'px')
                .style('top', (event.pageY - 20) + 'px');
        });

        nodes.on('mousemove', (event) => {
            tooltip.style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 20) + 'px');
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
            nodes.attr("r", 10).attr("opacity", 0.88);
            links.attr("stroke-opacity", 0.88);

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