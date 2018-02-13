import styled from "react-emotion";

export const fontSizes = {
  smaller: "11px",
  small: "14px",
  normal: "16px",
  big: "20px",
  bigger: "28px",
  huge: "48px"
};

export const fontWeights = {
  lighter: "200",
  light: "300",
  normal: "400",
  bold: "600"
};

export const Heading = styled("div")`
  font-size: ${fontSizes.big};
  font-weight: ${fontWeights.bold};
`;
