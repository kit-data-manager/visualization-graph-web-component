// import exp from "constants";

export default
{

    title: 'Components/MyComponent',
};


const Template = () => '<my-component first="${args.first)" middle="${args.middle)" last="${args.last)"></my-component>';

export const Example =Template.bind({});
Example.args ={
    first: 'Ajay',
    middle: 'Singh',
    last: 'Kirar'

}