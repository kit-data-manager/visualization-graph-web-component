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
  private legendNodeSize= 8;
  private legendTextSize= 14;

  /**
   * Default force properties for the graph simulation.
   *
   * @private
   * @type {{
   *   center: { x: number, y: number },
   *   charge: { enabled: boolean, strength: number, distanceMin: number, distanceMax: number },
   *   link: { distance: number }
   * }}
   */
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
    svg.attr('viewBox', `0 0 ${parseInt(width, 10)} ${parseInt(height, 10)}`).attr('preserveAspectRatio', 'xMidYMid meet');
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);

    // Set up zoom behavior directly on the SVG element
    const zoom = d3
      .zoom()
      .scaleExtent([1, 1]) // Adjust scale extent as needed
      .on('zoom', event => {
        svg.attr('transform', event.transform); // Apply zoom directly to SVG
      }); 
    svg.call(zoom);
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
          .distance(d => (d.category === 'attribute' ? 35 : 70)), // Shorter distance for attribute links
      )
      .force(
        'charge',
        d3.forceManyBody().strength(this.forceProperties.charge.strength).distanceMin(this.forceProperties.charge.distanceMin).distanceMax(this.forceProperties.charge.distanceMax),
      )
      .force('center', d3.forceCenter(numericWidth * this.forceProperties.center.x, numericHeight * this.forceProperties.center.y));
    return simulation;
  }

  /**
   * Updates the force simulation properties.
   *
   * @param {{ [forceName: string]: { [propName: string]: any } }} newProps - The new properties to update.
   */
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
   * Sets up attribute color mapping based on provided configurations if not provided then used default colors.
   *
   * @param {string[]} uniqueAttributeNames - The unique attribute names.
   * @param {any[]} parsedConfig - The parsed configuration data.
   * @returns {{ attributeColorMap: Map<string, string>, attributeColorScale: d3.ScaleOrdinal<string, string> }} - The attribute color map and scale.
   */
  attributeColorSetup(uniqueAttributeNames, parsedConfig) {
    // Prepare attribute color mapping based on config
    let attributeColorMap = new Map();
    const defaultColorScale = d3.scaleOrdinal(d3.schemeCategory10);
    uniqueAttributeNames.forEach(attributeName => {
      // Initialize an array to store properties for each matching attribute
      let color;

      // Search for the attribute in properties of each config item
      parsedConfig.forEach(item => {
        if (item.properties) {
          item.properties.forEach(propertyObj => {
            // Iterate over keys of each property object
            Object.keys(propertyObj).forEach(key => {
              // Check if the attributeName matches the key and if the property object has a color
              if (key === attributeName && propertyObj[key].color) {
                // Add property object to the properties array
                color = propertyObj[key].color;
              }
            });
          });
        }
      });

      if (color && color.length > 0) {
        // Use properties from matching attributes if available
        attributeColorMap.set(attributeName, color);
      } else {
        // Directly assign a color using the attribute name from default scale
        const color = defaultColorScale(attributeName);
        attributeColorMap.set(attributeName, color);
      }
    });
    const attributeColorScale = d3.scaleOrdinal(uniqueAttributeNames, d3.schemeCategory10);
    return { attributeColorMap, attributeColorScale };
  }
  /**
   * Creates and appends link elements to the graph SVG.
   *
   * @param {d3.Selection} svg - The SVG element to which links will be appended.
   * @param {any[]} links - The array of link data.
   * @returns {d3.Selection} - The created link elements.
   */
  createLinks(svg, links, colorType) {
    // Create a group for each link
    const linkGroup = svg.selectAll('.link').data(links).enter().append('g').attr('class', 'link');

    // Append the line to each group
    linkGroup
      .append('line')
      .attr('stroke-opacity', 1)
      .attr('opacity', '1')
      .attr('stroke', d => (d.category === 'non_attribute' ? colorType(d.relationType) : '#d3d3d3'))
      .attr('marker-end', d => `url(#arrowhead-${d.relationType})`) // Add arrow marker
      .attr('marker-start', d => `url(#arrowtail-${d.relationType})`)
      .attr('stroke-dasharray', d => (d.relationType === 'someType' ? '0, 5' : 'none')); // Adjust condition as per your data

    // Append the text to each group
    linkGroup
      .append('text')
      .text(d => d.category === 'attribute' ? '' : d.relationType) 
      .attr('fill', 'black') // Style as needed
      .attr('font-size', 3)
      .attr('text-anchor', 'middle')
      .attr('dy', -5); // Offset from the line

    return linkGroup;
}

  /**
   * Creates and appends node elements to the graph SVG.
   *
   * @param {d3.Selection} svg - The SVG element to which nodes will be appended.
   * @param {any[]} nodes - The array of node data.
   * @param {d3.ScaleOrdinal<string, string>} colorScale - The color scale for node colors.
   * @returns {d3.Selection} - The created node elements.
   */
  createNodes(svg, nodes, primaryNodeColor, attributeColorMap) {
    // Extract unique attribute names from attribute nodes
    // Create a color scale for attribute nodes
    return svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', d => (d.category === 'attribute' ? 6 : 10)) // Smaller radius for attribute nodes
      .attr('fill', d => {
        if (d.category === 'attribute') {
          // Assuming the attribute name is the second key of the node object
          const attributeName = Object.keys(d)[1];
          return attributeColorMap.get(attributeName); // Directly use color from attributeColorMap
        } else {
          return primaryNodeColor; // Use primaryNodeColor for non-attribute nodes
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
  }
  /**
   * Creates custom markers for links based on their types.
   *
   * @param {d3.Selection} svg - The SVG element.
   * @param {any[]} links - The array of link data.
   * @param {(type: string) => string} colorType - Function to retrieve color based on link type.
   */
  createCustomMarkers(svg, links, colorType) {
    let defs = svg.append('defs');
    let set = [...new Set(links.filter(d => d.category === 'non_attribute').map(d => d.relationType))];

    set.forEach(elem => {
      // Marker for the end of the link (arrowhead)
      defs
        .append('svg:marker')
        .attr('id', `arrowhead-${elem}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 28)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', colorType(elem));

      // Marker for the start of the link (reverse arrowhead)
      defs
        .append('svg:marker')
        .attr('id', `arrowtail-${elem}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', -18) // Adjust for positioning the tail
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', colorType(elem));
    });
  }
  // /**
  //  * Creates a custom marker for use in SVG definitions.
  //  *
  //  * @param {SVGDefsElement} defs - The SVG definitions element.
  //  * @param {string} id - The ID of the marker.
  //  * @param {string} color - The color of the marker.
  //  */
  // createMarker(defs, id, color) {
  //   defs
  //     .append('svg:marker')
  //     .attr('id', id)
  //     .attr('refX', 20)
  //     .attr('refY', 20)
  //     .attr('markerWidth', 40)
  //     .attr('markerHeight', 40)
  //     .attr('markerUnits', 'userSpaceOnUse')
  //     .attr('orient', 'auto')
  //     .append('path')
  //     .attr('d', 'M0,0Q15,0,20,10,15,20,0,20A1,1,0,000,0') //d3.line()([[0, 0], [0, 20], [20, 10]]))
  //     .style('fill', color);
  // }

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
        .select('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      links
        .select('text')
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      nodes.attr('cx', d => d.x).attr('cy', d => d.y);
    };

    simulation.on('tick', ticked);
  }
  /**
   * Prepares legend data based on provided configurationsif not provided then by defualt colors.
   *
   * @param {string[]} uniqueAttributeNames - The unique attribute names.
   * @param {any[]} config - The legend configuration data.
   * @param {d3.ScaleOrdinal<string, string>} attributeColorScale - The attribute color scale.
   * @returns {any[]} - The prepared legend data.
   */
  prepareLegend(uniqueAttributeNames, config, attributeColorScale) {
    const userConfigs = Array.isArray(config) ? config : [];

    if (userConfigs.length === 0) {
      return {
        primaryConfig: {
          label: '',
          color: 'grey'
        },
        legendConfigurations: uniqueAttributeNames.map(attributeName => ({
          label: attributeName,
          color: attributeColorScale(attributeName) || '#defaultColor',
          attributeKey: attributeName
        })),
      };
    }
    // Extract primary values from the first configuration in the config array
    const primaryConfig = userConfigs[0];
    const primaryLabel = primaryConfig.label || '';
    const primaryColor = primaryConfig.color || '#008080';
    const primaryDescription = primaryConfig.description ? primaryConfig.description : '';

    const legendConfigurations = uniqueAttributeNames.map(attributeName => {
      let customConfig = null;
      for (const config of userConfigs) {
        const matchingProperty = config.properties.find(property => attributeName in property);
        if (matchingProperty) {
          customConfig = matchingProperty[attributeName];
          break; // Stop searching once a match is found
        }
      }

      if (customConfig) {
        return {
          label: customConfig.label || attributeName,
          color: customConfig.color || attributeColorScale(attributeName) || '#defaultColor',
          attributeKey: attributeName,
          description: customConfig.description
        };
      } else {
        return {
          label: attributeName,
          color: attributeColorScale(attributeName) || '#defaultColor',
          attributeKey: attributeName
        };
      }
    });
    // Return an object containing legend configurations and primary values
    return {
      primaryConfig: {
        label: primaryLabel,
        color: primaryColor,
        description: primaryDescription,
      },
      legendConfigurations: legendConfigurations,
    };
  }

  /**
   * Creates a legend for nodes in the graph.
   *
   * @param {d3.Selection} svg - The SVG element.
   * @param {string} primaryNodeColor - The color for primary nodes.
   * @param {boolean} showLegend - Whether to display the legend.
   * @param {any[]} legendConfigurations - The legend configurations.
   * @param {Map<string, string>} attributeColorMap - The attribute color map.
   */
  createNodeLegend(svg, primaryNodeColor, showLegend, legendConfigurations, attributeColorMap, tooltip, primaryConfig) {
    if (!showLegend) {
      return; // Do not create the legend if showLegend is false
    }
    const svgWidth = parseInt(svg.style('width'));
    const rightOffset = 50;
    const legendX = svgWidth - rightOffset;

    // Set a fixed size for the legend area and make it scrollable
    const legendHeight = 200;
    const legendWidth = 250;

// Create a container for the scrollable legend
const legendContainer = svg
  .append('foreignObject')
  .attr('x', legendX - legendWidth)
  .attr('y', 420)
  .attr('width', legendWidth)
  .attr('height', legendHeight)
  .append('xhtml:div')
  .style('overflow', 'auto')
  .style('height', `${legendHeight}px`)
  .style('font-size', `${this.legendTextSize}px`); // Adjust font size using legendNodeSize variable


    const legend = legendContainer.append('div').style('cursor', 'pointer');

 // Add primary node color to the legend
const primaryItem = this.addLegendItem(legend, primaryConfig.color || primaryNodeColor, primaryConfig.label || 'Primary Node', this.legendNodeSize, primaryConfig.description || 'Primary'); // Size 10 for primary node
// Event listener for primary item mouseover
primaryItem.on('mouseover', event => {
    if (primaryConfig.description) {
        tooltip
            .html(`<div style="background-color: lightgray; padding: 5px; border-radius: 5px;"><span>${primaryConfig.description}</span></div>`) // Content with span for text
            .transition()
            .duration(200)
            .style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
    }
});

// Event listener for primary item mouseout
primaryItem.on('mouseout', () => {
    tooltip.style('opacity', 0);
    tooltip.html(''); // Clear tooltip content
});

    // Create legend items from the configurations or directly from attributeColorMap
    legendConfigurations.forEach(({ attributeKey, label, description }) => {
      const color = attributeColorMap.get(attributeKey) || primaryNodeColor; // Fallback to primaryNodeColor if not found
      const item = this.addLegendItem(legend, color, label || attributeKey, this.legendNodeSize, description); // Use label or attributeKey if label not provided
      // Event listener for legend item mouseover
      item.on('mouseover', event => {
        if(description){
          tooltip
          .html(`<div style="background-color: lightgray; padding: 5px; border-radius: 5px;"><span>${description}</span></div>`) // Content with span for text
            .transition()
            .duration(200)
            .style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        }
      });

      // Event listener for legend item mouseout
      item.on('mouseout', () => {
        tooltip.style('opacity', 0);
      });
    });
  }

  /**
   * Adds an item to the legend with the specified color, label, and size.
   *
   * @param {HTMLElement} legend - The legend container element.
   * @param {string} color - The color of the legend item.
   * @param {string} label - The label for the legend item.
   * @param {number} size - The size of the legend item.
   */
  addLegendItem(legend, color, label, size, description) {
    const item = legend.append('div').style('display', 'flex').style('align-items', 'center').style('margin-bottom', '10px'); // Increase spacing if needed

    // Adjust the circle to reflect the node size
       item
       .append('svg')
       .attr('width', size * 2 ) // Adjust width and height to match the square size
       .attr('height', size * 2 )
       .attr('class', 'legend-item')
       .append('rect') // Use rect instead of circle
       .attr('x', 0) // Set x position to 0
       .attr('y', 0) // Set y position to 0
       .attr('width', size * 2) // Set width and height to match the square size
       .attr('height', size * 2)
       .style('fill', color)
       .attr('data-description', description); // Set data attribute for description


    item.append('span').style('margin-left', '10px').text(label); // The label already describes the node
    return item;
  }
}
