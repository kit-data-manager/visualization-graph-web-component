import * as d3 from 'd3';

/**
 * Class responsible for setting up and managing the D3.js graph visualization.
 *
 * @class
 */
export class GraphSetup {

    /**
     * The HTML host element where the D3.js graph will be rendered.
     *
     * @private
     * @type {HTMLElement}
     */
    private hostElement: HTMLElement;

    /**
     * The size of the graph. Defaults to '1350px,650px'.
     *
     * @private
     * @type {string}
     */
    private size: string = '1350px,650px';


    constructor(hostElement) {
        this.hostElement = hostElement;
    }

    /**
     * Clears all elements inside the provided SVG element.
     *
     * @param {d3.Selection} svg - The SVG element to clear.
     */
    clearSVG(svg) {
        svg.selectAll("*").remove();
    }

    /**
     * Initializes the SVG element for the graph based on the host element.
     *
     * @returns {{ svg: d3.Selection, numericWidth: number, numericHeight: number }} - The initialized SVG element and its dimensions.
     */
    initializeSVG() {
        const svg = d3.select(this.hostElement.shadowRoot.querySelector("#graph"));
        const [width, height] = this.size.split(',').map(s => s.trim());
        svg
            .attr("width", width)
            .attr("height", height)
            .attr('marker-end', 'url(#arrow)');
        const numericWidth = parseInt(width, 10);
        const numericHeight = parseInt(height, 10);
        return { svg, numericWidth, numericHeight };
    }

    /**
     * Creates a force simulation for the graph nodes and links.
     *
     * @param {any[]} nodes - The array of node data.
     * @param {any[]} links - The array of link data.
     * @param {number} numericWidth - The numeric width of the graph.
     * @param {number} numericHeight - The numeric height of the graph.
     * @returns {d3.Simulation<any, any>} - The configured force simulation.
     */
    createForceSimulation(nodes, links, numericWidth, numericHeight) {
        return d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(70))
            .force("charge", d3.forceManyBody().strength(-90))
            .force("x", d3.forceX(numericWidth / 2))
            .force("y", d3.forceY(numericHeight / 2));
    }

    /**
     * Creates and appends link elements to the graph SVG.
     *
     * @param {d3.Selection} svg - The SVG element to which links will be appended.
     * @param {any[]} links - The array of link data.
     * @returns {d3.Selection} - The created link elements.
     */
    createLinks(svg, links) {
        return svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke-opacity", 1)
            .attr("opacity", "1")
            .attr("category", d => d.category)
            .attr("stroke", '#d3d3d3');
    }

    /**
     * Creates and appends node elements to the graph SVG.
     *
     * @param {d3.Selection} svg - The SVG element to which nodes will be appended.
     * @param {any[]} nodes - The array of node data.
     * @param {d3.ScaleOrdinal<string, string>} colorScale - The color scale for node colors.
     * @returns {d3.Selection} - The created node elements.
     */
    createNodes(svg, nodes, colorScale) {
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

     /**
     * Applies the force simulation to update link and node positions on each simulation tick.
     *
     * @param {d3.Selection} nodes - The node elements in the graph.
     * @param {d3.Selection} links - The link elements in the graph.
     * @param {d3.Simulation<any, any>} simulation - The configured force simulation.
     */
    applySimulation(nodes, links, simulation) {
        const ticked = () => {
            links
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            nodes
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        };
        simulation.on("tick", ticked);
    }

}