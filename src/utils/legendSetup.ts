
/**
 * Class responsible for setting up and managing legend.
 *
 * @class
 */
export class LegendSetup {

    private legendNodeSize = 8;
    private legendTextSize = 14;


      /**
   * Prepares legend data based on provided configurationsif not provided then by defualt colors.
   *
   * @param {string[]} uniqueAttributeNames - The unique attribute names.
   * @param {any[]} config - The legend configuration data.
   * @param {d3.ScaleOrdinal<string, string>} attributeColorScale - The attribute color scale.
   * @returns {any[]} - The prepared legend data.
   */
  prepareLegend(typeMatchedPrimaryNodes, uniqueAttributeNames, config, attributeColorScale) {
    const userConfigs = Array.isArray(config) ? config : [];
    if (userConfigs.length === 0) {
      return {
        primaryConfigFallback: {
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
    const userConfig = userConfigs[0];
    const primaryLabel = userConfig.label || '';
    const primaryColor = userConfig.color || '#008080';
    const primaryDescription = userConfig.description ? userConfig.description : '';
    // Create legendPrimaryConfig
    const legendPrimaryConfig = typeMatchedPrimaryNodes.length > 0 ?
      typeMatchedPrimaryNodes.map(pNode => {
        return {
          label: pNode.label || primaryLabel,
          color: pNode.color || primaryColor,
          attributeKey: pNode.node.id || primaryDescription
        };
      }) : [{
        label: primaryLabel,
        color: primaryColor
      }];

    // Searching if attribute mentioned in configurations file matches to any attribute of our graph
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
      primaryConfigFallback: {
        label: primaryLabel,
        color: primaryColor,
        description: primaryDescription,
      },
      legendPrimaryConfig: legendPrimaryConfig,
      legendAttributesConfig: legendConfigurations,
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
  createLegendNodes(svg, primaryNodeColor, showLegend, legendConfigurations, attributeColorMap, tooltip, legendPrimaryConfig) {
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

    // Extract unique label names and their corresponding items
    const uniqueTypesMap = legendPrimaryConfig.reduce((map, item) => {
      if (!map.has(item.label)) {
        map.set(item.label, []);
      }
      map.get(item.label).push(item);
      return map;
    }, new Map());


    // Iterate over unique labels and add items to the legend
    uniqueTypesMap.forEach((items, label) => {
      // Get the color of the first item in the array
      const color = items[0].color;

      const primarylegendItemTypes = this.addLegendItem(legend, color || primaryNodeColor, label || 'Primary Node', this.legendNodeSize, items[0].description || 'Primary');

      // Event listener for item mouseover
      primarylegendItemTypes.on('mouseover', event => {
        if (items[0].description) {
          tooltip
            .html(`<div style="background-color: lightgray; padding: 5px; border-radius: 5px;"><span>${items[0].description}</span></div>`) // Content with span for text
            .transition()
            .duration(200)
            .style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        }
      });

      // Event listener for item mouseout
      primarylegendItemTypes.on('mouseout', () => {
        tooltip.style('opacity', 0);
        tooltip.html(''); // Clear tooltip content
      });
    });

    // Create legend attribute items from the configurations
    legendConfigurations.forEach(({ attributeKey, label, description }) => {
      const color = attributeColorMap.get(attributeKey) || primaryNodeColor; // Fallback to primaryNodeColor if not found
      const item = this.addLegendItem(legend, color, label || attributeKey, this.legendNodeSize, description); // Use label or attributeKey if label not provided
      // Event listener for legend item mouseover
      item.on('mouseover', event => {
        if (description) {
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
        tooltip.html(''); // Clear tooltip content
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
      .attr('width', size * 2) // Adjust width and height to match the square size
      .attr('height', size * 2)
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