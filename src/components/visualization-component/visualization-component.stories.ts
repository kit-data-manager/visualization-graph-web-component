/**
 * Storybook configuration for the 'visualization-component' web component.
 * Defines different stories and their corresponding parameters.
 *
 */
export default
  {
    /**
     * Title for the Storybook category.
     *
     * @story
     * @type {string}
     */
    title: 'Components/VisualizationComponent',
    component: 'visualization-component',

    /**
     * Argument types for the stories, allowing interactive control in Storybook.
     *
     * @story
     * @type {Object}
     */
    argTypes: {
      showAttributes: { control: 'radio', options: [true, false] },
    }

  };
/**
 * Template function to create a basic story with the 'visualization-component'.
 *
 * @story
 * @type {Function}
 */
const Template = () => '<visualization-component ></visualization-component>';

/**
 * Story for the 'visualization-component' with showAttributes set to true.
 *
 * @story
 * @type {Object}
 */
export const ShowAttributesTrue = Template.bind({});
ShowAttributesTrue.args = {
  showAttributes: true,
};

/**
 * Story for the 'visualization-component' with showAttributes set to false.
 *
 * @story
 * @type {Object}
 */
export const ShowAttributesFalse = Template.bind({});
ShowAttributesFalse.args = {
  showAttributes: false,
};