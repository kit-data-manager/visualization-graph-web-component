# Visualization Component

The visualization-component is a dynamic, interactive graph component built using D3.js library. It is designed to render graphs based on provided JSON data, making it ideal for visualizing complex relationships and networks in an intuitive manner. The component supports various interactive features like hover effects, node dragging, and click events to reveal connections between entities. 
There are features that allows users to customize color, description, label dynamically. This makes it an excellent tool for exploring and understanding intricate data relationships.

## Data Format and Connection Representation

The `visualization-component` requires a specific JSON data format to accurately represent and visualize relationships between entities. Here's an overview of the data format and how connections are established:

### JSON Data Structure

The component accepts an array of objects, where each object represents an entity with a unique identifier and a set of properties. The structure is as follows:

```json
[
  {
    "id": "Unique Identifier",
    "properties": {
      "propertyName": "propertyValue",

    }
  },
]
```
**Key Elements**

- `id`:  This unique identifier is crucial for linking entities.

- `properties`: A collection of key-value pairs representing various attributes of the entity. Certain properties can be used to establish connections to other entities.


### Example : Research Paper and Dataset
Consider a scenario where you have two entities: a research paper and a dataset. The research paper references the dataset. Below is an example of how these entities and their relationship can be represented in JSON format for the visualization-component.

**Entities**

-`Research Paper`: An academic paper that cites a specific dataset.

-`Dataset`: The dataset that is cited by the research paper.

**JSON Data Representation**
```
[
  {
    "id": "paper-12345",
    "properties": {
      "title": "Analysis of Data Patterns",
      "author": "Dr. Jane Smith",
      "citesDataset": "dataset-98765",
      "publishedDate": "2021-06-15",
      "topic": "Data Science"
    }
  },
  {
    "id": "dataset-98765",
    "properties": {
      "title": "Global Data Set on Patterns",
      "creator": "Data Institute",
      "relatedPaper": "paper-12345",
      "releaseDate": "2021-01-10",
      "subject": "Data Patterns"
    }
  }
]

```

Understanding the Relationships

In this example,  
- `The research paper` (with id "paper-12345") cites the dataset (with id "dataset-98765").  
- `The property` citesDataset in the paper's properties links to the id of the dataset, establishing a connection.  
- Conversely, the dataset includes a relatedPaper property that references back to the paper's id. We call it primary link.  
- When visualized, these properties can create a one-way/two-way link between the paper and the dataset, illustrating their relationship


### Customization Options

Users can easily customize the web component by setting various properties:

- `data`: Input your JSON data for graph visualization.
- `size`: Adjust the size of the graph (default is '1350px,650px').
- `showAttributes`: Choose to show or hide attributes(in above case properties any entity) in the graph. Defaults to true.
- `showPrimaryLinks`: Choose to show primary links(relation between two entities). If true it will show all the links between primary nodes. Defaults to true.
- `excludeProperties`: Specify any properties to exclude from the visualization.
- `showDetailsOnHover`: Enable or disable hover effects on graph nodes.
- `showLegend`: Allow user to chose to see legend. 
- `configurations`: Allow user to customize properties dynamically. eg: color, label, description etc  

These properties allow for flexible configuration, catering to different data sets and visualization requirements, making the Visualization Component a versatile tool for data analysis and presentation.

Currently, in its [development/beta/stable] phase, is an evolving project, open to contributions and feedback from the community. Dive into the world of seamless data visualization with

## How to run - For developers

To start using the component clone this repo to a new directory:

```bash
git clone https://github.com/kit-data-manager/visualization-graph-web-component.git

```

and run:(Before running below command make sure node.js is installed in your system. You can check if it is there is your system or not by command: node -v or node --version (dependending on the operating system you are using) in your command prompt.

```bash
npm install
```

To run storybook in dev mode

```bash
npm run build
npm run storybook
```

Attention: Do NOT run npm run start. It will cause the storybook to not work properly. If you did run npm run start, delete the following folders and run npm install again:

- node_modules
- www
- dist
- loader
- .stencil
