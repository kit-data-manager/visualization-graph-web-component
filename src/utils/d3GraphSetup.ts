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

  private forceProperties = {
    center: {
      x: 0.5,
      y: 0.5,
    },
    charge: {
      enabled: true,
      strength: -70,
      distanceMin: 40,
      distanceMax: 2000,
    },
    link: {
      distance: 70,
    },
    // You can add more properties for other forces like collision if needed
  };

  constructor(hostElement) {
    this.hostElement = hostElement;
  }

  /**
   * Clears all elements inside the provided SVG element.
   *
   * @param {d3.Selection} svg - The SVG element to clear.
   */
  clearSVG(svg) {
    svg.selectAll('*').remove();
  }

  /**
   * Initializes the SVG element for the graph based on the host element.
   *
   * @returns {{ svg: d3.Selection, numericWidth: number, numericHeight: number }} - The initialized SVG element and its dimensions.
   */
  initializeSVG() {
    const svg = d3.select(this.hostElement.shadowRoot.querySelector('#graph'));
    const [width, height] = this.size.split(',').map(s => s.trim());
    svg.attr('width', width).attr('height', height).attr('marker-end', 'url(#arrow)');
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
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(this.forceProperties.link.distance),
      )
      .force(
        'charge',
        d3.forceManyBody().strength(this.forceProperties.charge.strength).distanceMin(this.forceProperties.charge.distanceMin).distanceMax(this.forceProperties.charge.distanceMax),
      )
      .force('center', d3.forceCenter(numericWidth * this.forceProperties.center.x, numericHeight * this.forceProperties.center.y));
    return simulation;
  }
  updateForceProperties(newProps: { [forceName: string]: { [propName: string]: any } }) {
    // Iterate over the object to update force properties
    for (const forceName of Object.keys(newProps)) {
      for (const propName of Object.keys(newProps[forceName])) {
        if (this.forceProperties[forceName]) {
          this.forceProperties[forceName][propName] = newProps[forceName][propName];
        }
      }
    }
  }

  /**
   * Creates and appends link elements to the graph SVG.
   *
   * @param {d3.Selection} svg - The SVG element to which links will be appended.
   * @param {any[]} links - The array of link data.
   * @returns {d3.Selection} - The created link elements.
   */
  createLinks(svg, links, colorType) {
    return (
      svg
        .selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke-opacity', 1)
        .attr('opacity', '1')
        .attr('category', d => d.category)
        .attr('stroke', d => (d.category === 'non_attribute' ? colorType(d.relationType) : '#d3d3d3'))
        // .attr('stroke-dasharray', d => (d.category === 'non_attribute' ? '10, 10' : '1'))
        .attr('marker-end', 'url(#triangle)')
        .attr('marker-start', 'url(#arrow)')
        .attr('orient', 'auto')
    );
  }

  /**
   * Creates and appends node elements to the graph SVG.
   *
   * @param {d3.Selection} svg - The SVG element to which nodes will be appended.
   * @param {any[]} nodes - The array of node data.
   * @param {d3.ScaleOrdinal<string, string>} colorScale - The color scale for node colors.
   * @returns {d3.Selection} - The created node elements.
   */
  createNodes(svg, nodes) {
    // Extract unique attribute names from attribute nodes
    const attributeNames = nodes.filter(node => node.category === 'attribute').map(node => Object.keys(node)[1]); // Assuming the attribute name is the second key
    const uniqueAttributeNames = [...new Set(attributeNames)];

    // Create a color scale for attribute nodes
    const attributeColorScale = d3.scaleOrdinal(uniqueAttributeNames, d3.schemeCategory10);

    // Separate color scale for primary nodes
    const primaryNodeColor = '#006400'; // Deep green, as an example

    return svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .attr('fill', d => (d.category === 'attribute' ? attributeColorScale(Object.keys(d)[1]) : primaryNodeColor))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
  }

  createCustomMarkers(svg, links, colorType) {
    let defs = svg.append('defs');
    let set = [...new Set(links.filter(d => d.category === 'non_attribute').map(d => d.relationType))];
    set.forEach(elem => {
      // Marker for line end (arrowhead)
      this.createMarker(defs, `marker-end-${elem}`, colorType(elem));
      // Marker for line start (reverse arrowhead)
      this.createMarker(defs, `marker-start-${elem}`, colorType(elem));
    });
  }

  createMarker(defs, id, color) {
    defs
      .append('svg:marker')
      .attr('id', id)
      .attr('refX', 20)
      .attr('refY', 20)
      .attr('markerWidth', 40)
      .attr('markerHeight', 40)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0Q15,0,20,10,15,20,0,20A1,1,0,000,0') //d3.line()([[0, 0], [0, 20], [20, 10]]))
      .style('fill', color);
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
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodes.attr('cx', d => d.x).attr('cy', d => d.y);
    };
    simulation.on('tick', ticked);
  }

  //Legend stationary attemp
  /**
   * Creates a legend for the node colors in the graph.
   *
   * @param {d3.Selection} svg - The SVG element to which the legend will be appended.
   * @param {d3.ScaleOrdinal<string, string>} attributeColorScale - The color scale for attribute nodes.
   * @param {string[]} uniqueAttributeNames - The unique attribute names used in the color scale.
   * @param {string} primaryNodeColor - The color used for primary nodes.
   */
  // createNodeLegend(svg, attributeColorScale, uniqueAttributeNames, primaryNodeColor) {
    
  //   const legend = svg.append('g')
  //     .attr('class', 'legend')
  //     .attr('transform', 'translate(1220,320)'); // Adjust the position as needed

  //   // Adding primary node color to the legend
  //   legend.append('circle')
  //     .attr('cx', 0)
  //     .attr('cy', 0)
  //     .attr('r', 5)
  //     .style('fill', primaryNodeColor);
  //   legend.append('text')
  //     .attr('x', 20)
  //     .attr('y', 0)
  //     .attr('dy', '0.35em')
  //     .text('Primary Node');

  //   // Adding attribute colors to the legend
  //   uniqueAttributeNames.forEach((attr, index) => {
  //     const color = attributeColorScale(attr);
  //     const yPosition = (index + 1) * 20; // Adjust spacing

  //     legend.append('circle')
  //       .attr('cx', 0)
  //       .attr('cy', yPosition)
  //       .attr('r', 5)
  //       .style('fill', color);

  //     legend.append('text')
  //       .attr('x', 20)
  //       .attr('y', yPosition)
  //       .attr('dy', '0.35em')
  //       .text(attr);
  //   });
  // }

  //Scrollable legend attempt
  createNodeLegend(svg, attributeColorScale, uniqueAttributeNames, primaryNodeColor) {
    const svgWidth = parseInt(svg.style('width'));
    const rightOffset = 50;
    const legendX = svgWidth - rightOffset;
    
    // Set a fixed size for the legend area and make it scrollable
    const legendHeight = 200; // Adjust as needed
    const legendWidth = 250;  // Adjust as needed

    // Create a container for the scrollable legend
    const legendContainer = svg.append('foreignObject')
      .attr('x', legendX - legendWidth)
      .attr('y', 420)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .append('xhtml:div')
      .style('overflow', 'auto')
      .style('height', `${legendHeight}px`);

    const legend = legendContainer.append('div')
      .style('cursor', 'pointer');

    // Add primary node color to the legend
    this.addLegendItem(legend, primaryNodeColor, 'Primary Node');

    // Add attribute colors to the legend
    uniqueAttributeNames.forEach(attr => {
      const color = attributeColorScale(attr);
      this.addLegendItem(legend, color, attr);
    });
  }

  // Helper method to add items to the legend
  addLegendItem(legend, color, label) {
    const item = legend.append('div').style('display', 'flex').style('align-items', 'center').style('margin-bottom', '5px');
    
    item.append('svg')
      .attr('width', 20)
      .attr('height',20)
      .append('circle')
      .attr('cx', 5)
      .attr('cy', 5)
      .attr('r', 5)
      .style('fill', color);

    item.append('span')
      .style('margin-left', '10px')
      .text(label);
  }
  
}
