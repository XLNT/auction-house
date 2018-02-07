import styled, { css } from "react-emotion";

// const spacerSize = (pads, props) => {
//   if props.inline {
//     return css`
//       width: ${basePadding * pads}px
//     `;
//   } else {
//     return css`
//       height: ${basePadding * pads}px
//     `;
//   }
// };

// display: ${props => (props.inline ? "inline-block" : "block")};

const spacerSize = css`
  height: ${20}px;
`;

export const Spacer = styled("div")`
  ${spacerSize};
  display: block;
`;

