import styled, { css } from "react-emotion";
import { colors } from "../styles";

export const fontSizes = {
  smaller: "11px",
  small: "14px",
  normal: "16px",
  big: "20px",
  bigger: "32px",
  huge: "48px"
};

export const fontWeights = {
  lighter: "200",
  light: "300",
  normal: "400",
  bold: "600"
};

export const Text = styled("div")`
  font-size: ${props => props.size || fontSizes.normal};
  ${props =>
    props.grey &&
    css`
      color: ${colors.black};
    `};
  ${props =>
    props.uppercase &&
    css`
      text-transform: uppercase;
    `};
  ${props =>
    props.inline &&
    css`
      display: inline-block;
    `};
  font-weight: ${props => props.weight || fontWeights.bold};
`;
