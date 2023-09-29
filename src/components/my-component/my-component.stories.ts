// import exp from "constants";

export default
{

    title: 'Components/MyComponent',
};


const Template = () => '<my-component first="${args.first)" middle="${args.middle)" last="${args.last)"></my-component>';

export const Example =Template.bind({});
Example.args ={
         includedProperties : 'KIP,SIP,TIP,KIT,SAP,RWTH,BIRLA,KPMG,IIT',
     visualizationMode : 'all',
    first: 'Ajay',
    middle: 'Singh',
    last: 'Kirar'

}

// // import { h } from '@stencil/core';
// // import { storiesOf } from '@storybook/web-components';
// // import { MyComponent } from './my-component';

// // export default
// // {

// //     title: 'Components/MyComponent',
// // };

// storiesOf('Components/MyComponent', module).add('Example', () => {
//     const includedProperties = 'KIP,SIP,TIP,KIT,SAP,RWTH,BIRLA,KPMG,IIT';
//     const visualizationMode = 'all';
//     const first = 'Ajay';
//     const middle = 'Singh';
//     const last = 'Kirar';
  
//     return (
//       <my-component
//         included-properties={includedProperties}
//         visualization-mode={visualizationMode}
//         first={first}
//         middle={middle}
//         last={last}
//       ></my-component>
//     );
//   });



// import './my-component.tsx'; // Import your component
// import { h } from '@stencil/core';
// import { storiesOf } from '@storybook/web-components';


// storiesOf('Components/MyComponent', module).add('Example', () => {
//   const includedProperties = 'KIP,SIP,TIP,KIT,SAP,RWTH,BIRLA,KPMG,IIT';
//   const visualizationMode = 'all';
//   const first = 'Ajay';
//   const middle = 'Singh';
//   const last = 'Kirar';

//   return (
//     <div>
//     <my-component
//     includedProperties={includedProperties}
//     visualizationMode={visualizationMode}
//     first={first}
//     middle={middle}
//     last={last}
//   ></my-component>
//     </div>
   
//   );
// });

