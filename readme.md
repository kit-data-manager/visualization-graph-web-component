[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com)

# Visualization Component

The visualization-component is a dynamic, interactive graph component built using D3.js. It is designed to render graphs based on provided JSON data, making it ideal for visualizing complex relationships and networks in an intuitive manner. The component supports various interactive features like hover effects, node dragging, and click events to reveal connections between entities. This makes it an excellent tool for exploring and understanding intricate data relationships.

### Customization Options

Users can easily customize the web component by setting various properties:

- `data`: Input your JSON data for graph visualization.
- `size`: Adjust the size of the graph (default is '1350px,650px').
- `showAttributes`: Choose to show or hide attributes in the graph. Defaults to true.
- `showPrimaryLinks`: Choose to show primary links in the graph. If true it will show all the links between primary nodes. Defaults to true.
- `excludeProperties`: Specify any properties to exclude from the visualization.
- `displayHovered`: Enable or disable hover effects on graph nodes.

These properties allow for flexible configuration, catering to different data sets and visualization requirements, making the Visualization Component a versatile tool for data analysis and presentation.

Currently, in its [development/beta/stable] phase, is an evolving project, open to contributions and feedback from the community. Dive into the world of seamless data visualization with

## How to run - For developers

To start using the component clone this repo to a new directory:

```bash
git clone https://github.com/kit-data-manager/visualization-graph-web-component.git

```

and run:

```bash
npm install
```

To run storybook in dev mode

```bash
npm run build
npm run storybook
```

Attention: Do NOT run npm run start. It will cause the storybook to not work properly. If you did run npm run start, delete the following folders and run npm install again:

node_modules
www
dist
loader
.stencil
