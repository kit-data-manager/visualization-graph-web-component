/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface VisualizationComponent {
        /**
          * The configuration object for customizing the graph color, and legend.
          * @prop 
          * @type {any}
         */
        "configurations": any;
        /**
          * Input data in JSON format for the graph.
          * @prop 
          * @type {string}
         */
        "data": string;
        /**
          * Properties to be excluded from outside the component. Defaults to an empty string.
          * @prop 
          * @type {string}
         */
        "excludeProperties": string;
        /**
          * Whether to show attributes in the graph. Defaults to true. If true it will show all the attributes/properties If false it wont show any attributes Default value : true
          * @prop 
          * @type {boolean}
         */
        "showAttributes": boolean;
        /**
          * Whether to show hover effects on the graph nodes. Defaults to true.
          * @prop 
          * @type {boolean}
         */
        "showDetailsOnHover": boolean;
        /**
          * Whether to show the legend in the graph. Defaults to true.
          * @prop 
          * @type {boolean}
         */
        "showLegend": boolean;
        /**
          * Whether to show primary links in the graph. If true it will show all the links between primary nodes Defaults to true.
          * @prop 
          * @type {boolean}
         */
        "showPrimaryLinks": boolean;
        /**
          * The size of the graph. Defaults to '1350px,650px'.
          * @prop 
          * @type {string}
         */
        "size": string;
    }
}
declare global {
    interface HTMLVisualizationComponentElement extends Components.VisualizationComponent, HTMLStencilElement {
    }
    var HTMLVisualizationComponentElement: {
        prototype: HTMLVisualizationComponentElement;
        new (): HTMLVisualizationComponentElement;
    };
    interface HTMLElementTagNameMap {
        "visualization-component": HTMLVisualizationComponentElement;
    }
}
declare namespace LocalJSX {
    interface VisualizationComponent {
        /**
          * The configuration object for customizing the graph color, and legend.
          * @prop 
          * @type {any}
         */
        "configurations"?: any;
        /**
          * Input data in JSON format for the graph.
          * @prop 
          * @type {string}
         */
        "data"?: string;
        /**
          * Properties to be excluded from outside the component. Defaults to an empty string.
          * @prop 
          * @type {string}
         */
        "excludeProperties"?: string;
        /**
          * Whether to show attributes in the graph. Defaults to true. If true it will show all the attributes/properties If false it wont show any attributes Default value : true
          * @prop 
          * @type {boolean}
         */
        "showAttributes"?: boolean;
        /**
          * Whether to show hover effects on the graph nodes. Defaults to true.
          * @prop 
          * @type {boolean}
         */
        "showDetailsOnHover"?: boolean;
        /**
          * Whether to show the legend in the graph. Defaults to true.
          * @prop 
          * @type {boolean}
         */
        "showLegend"?: boolean;
        /**
          * Whether to show primary links in the graph. If true it will show all the links between primary nodes Defaults to true.
          * @prop 
          * @type {boolean}
         */
        "showPrimaryLinks"?: boolean;
        /**
          * The size of the graph. Defaults to '1350px,650px'.
          * @prop 
          * @type {string}
         */
        "size"?: string;
    }
    interface IntrinsicElements {
        "visualization-component": VisualizationComponent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "visualization-component": LocalJSX.VisualizationComponent & JSXBase.HTMLAttributes<HTMLVisualizationComponentElement>;
        }
    }
}
