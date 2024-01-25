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
   * Apply mouseover event handling to the nodes for displaying tooltips and highlighting connected nodes.
   *
   * @param {any} nodes - D3 selection of graph nodes.
   * @param {any} links - D3 selection of graph links.
   * @param {any} tooltip - D3 selection of the tooltip element.
   */
  applyMouseover(nodes, links, tooltip) {
    const handleNodeMouseover = (event, d) => {
      if (this.currentlyClicked === event.currentTarget) return; // Ignore if this node is clicked
      this.clearSelection();

      // Reduce the visibility of all nodes and links
      links.attr('stroke-opacity', 0.25);
      nodes.attr('opacity', 0.25);
      const hoveredNode = d3.select(event.currentTarget);
      hoveredNode.attr('stroke', '#FFA500').attr('opacity', 1);

      links.each(function (l) {
        const isConnected = (l.source.id === d.id || l.target.id === d.id) && l.category === 'non_attribute';
        if (isConnected) {
          d3.select(this).attr('stroke-opacity', 1);
          nodes
            .filter(n => n.id === l.source.id || n.id === l.target.id)
            .attr('opacity', 1)
            .attr('stroke', '#FFA500');
        }
      });

      tooltip
        .html(`<span>${d.name}</span>`) // Content with span for text
        .transition()
        .duration(200) // Smooth transition for appearing
        .style('opacity', 1) // Make tooltip visible
        .style('left', `${event.pageX + 10}px`) // Position right of the cursor
        .style('top', `${event.pageY - 10}px`); // Position above the cursor

      // tooltip.transition().duration(200).style('opacity', 1);

      // Get the length of the tooltip content
      // const tooltipContent = `${d.name}`;
      // const textLength = tooltipContent.length * 7.3;

      // const rectWidth = textLength + 20; // Additional padding

      // const tooltipContentHtml = `<rect width="${rectWidth}" height="40" fill="#fff" stroke="#ccc" rx="15" ry="15"></rect>
      //       <text x="10" y="25" fill="#000">${d.name}</text>`;

      // tooltip.html(tooltipContentHtml).style('transform', `translate(${event.pageX - 100}px, ${event.pageY - 40}px)`);

      // this.currentlyClicked = hoveredNode.node();
    };

    const handleNodeMouseout = () => {
      if (this.currentlyClicked) return; // Ignore if a node is clicked
      nodes.attr('stroke', null).attr('opacity', 1); // Reset stroke and restore opacity
      links.attr('stroke-opacity', 0.2); // Reset links' opacity
      tooltip.style('opacity', 0); // Hide tooltip
    };

    d3.select('body').on('mouseover', () => {
      this.clearSelection();
      tooltip.style('opacity', 0);
    });

    nodes.on('mouseover', (event, d) => handleNodeMouseover(event, d));
    nodes.on('mouseout', handleNodeMouseout);
    // nodes.on('click', (event, d) => handleNodeClick(event, d));
  }
  clearSelection() {
    if (!this.currentlyClicked) {
      d3.selectAll('.node').attr('opacity', 1).attr('stroke', null).classed('selected', false);
      d3.selectAll('.link').attr('stroke-opacity', 0.2).classed('connected', false);
    }
  }

  /**
   * Handles the onClick event for nodes, updating their sizes and related links.
   *
   * @param {any} nodes - D3 selection of graph nodes.
   * @param {any} links - D3 selection of graph links.
   */
  onClick(nodes, links) {
    nodes.on('click', (event, d) => this.handleNodeClick(event, d, nodes, links));
  }
  handleNodeClick(event, d, nodes, links) {
    if (this.currentlyClicked) {
      this.clearSelection(); // Clear any existing selection
    }

    this.currentlyClicked = event.currentTarget; // Store clicked node reference
    // Mark the clicked node
    d3.select(this.currentlyClicked).classed('selected', true);
    // Logic to highlight the clicked node and its connected nodes
    d3.select(this.currentlyClicked).attr('stroke', '#FFA500').attr('opacity', 1);
    links.each(function (l) {
      const isConnected = (l.source.id === d.id || l.target.id === d.id) && l.category === 'non_attribute';
      if (isConnected) {
        d3.select(this).attr('stroke-opacity', 1).classed('connected', true);
        nodes
          .filter(n => n.id === l.source.id || n.id === l.target.id)
          .attr('opacity', 1)
          .attr('stroke', '#FFA500')
          .classed('connected', true);
      }
    });
  }
  /**
   * Applies a click handler to the body element to reset currentlyClicked when clicking outside the graph.
   */
  applyClickHandler() {
    d3.select('body').on('click', function (event) {
      if (event.target.nodeName === 'body' || event.target.nodeName === 'svg') {
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

    const dragHandler = d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);

    dragHandler(nodes);
  }
}
