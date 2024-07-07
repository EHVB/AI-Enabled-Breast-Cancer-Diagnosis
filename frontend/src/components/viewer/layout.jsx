// import React from "react";
// import {css } from "@emotion/react";
// import { useLayoutEffect } from "react";


// export const getViewCountFromLayout = layout => {
//     const [rows, cols] = layout.split("x");
//     return parseInt(rows, 10) * parseInt(cols, 10);
// };


// const layoutStyleMap = {
//   "1x1": css({ gridTemplateRows: "auto", gridTemplateColumns: "auto" }),
//   "1x2": css({ gridTemplateRows: "50% 50%", gridTemplateColumns: "auto" }),
//   "2x1": css({ gridTemplateRows: "auto", gridTemplateColumns: "50% 50%" }),
//   "2x2": css({ gridTemplateRows: "50% 50%", gridTemplateColumns: "50% 50%" }),
//   "4x1": css({ gridTemplateRows: "auto", gridTemplateColumns: "25% 25% 25% 25%" })
// };



// export const ViewerLayout = ({ layout = "1x1", cornerstone, ...props }) => {
//   useLayoutEffect(
//     () => {
//       // We need to resize all elements when the layout changes
//       const els = cornerstone.getEnabledElements();
//       console.log("resizing after layout change");
//       els.forEach(el => cornerstone.resize(el.element));
//     },
//     [layout]
//   );
//   return (
//     <div
//       css={[
//         {
//           position: "relative",
//           display: "grid",
//           width: "100%",
//           height: "100%",
//           gridGap: 4,
//           backgroundColor: "pink"
//         },
//         layoutStyleMap[layout]
//       ]}
//       {...props}
//     />
//   );
// };



import React, { useLayoutEffect } from 'react';

const layoutStyleMap = {
  "1x1": { gridTemplateRows: "auto", gridTemplateColumns: "auto" },
  "1x2": { gridTemplateRows: "50% 50%", gridTemplateColumns: "auto" },
  "2x1": { gridTemplateRows: "auto", gridTemplateColumns: "50% 50%" },
  "2x2": { gridTemplateRows: "50% 50%", gridTemplateColumns: "50% 50%" },
  "1x4": { gridTemplateRows: "auto", gridTemplateColumns: "25% 25% 25% 25%" }
};

const ViewerLayout = ({ layout = "1x1", cornerstone, ...props }) => {
  useLayoutEffect(() => {
    // We need to resize all elements when the layout changes
    const els = cornerstone.getEnabledElements();
    console.log("resizing after layout change");
    els.forEach(el => cornerstone.resize(el.element));
    console.log(layout)
  }, [layout]);

  return (
    <div
      className="viewer-layout" // Apply CSS class from the CSS file
      style={layoutStyleMap[layout]} // Apply dynamic styling from the layoutStyleMap
      {...props}
    />
  );
};

export default ViewerLayout;

