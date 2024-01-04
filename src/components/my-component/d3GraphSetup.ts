import * as d3 from 'd3';  // Import D3.js for data visualisation

export class GraphSetup {
    private hostElement: HTMLElement;
    private size: string = '1350px,650px';

    constructor(hostElement) {
        this.hostElement = hostElement;
    }
    clearSVG(svg) {
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

}