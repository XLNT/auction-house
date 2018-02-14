import styled from "react-emotion";
import {
  colors,
  basePadding,
  fontWeights,
  transform,
  lighten
} from "../styles";

export const Button = styled("button")`
  display: inline-block;
  background-color: ${colors.white};
  border: 1px solid ${colors.darkGrey};
  padding: ${basePadding / 2}px ${basePadding}px;
  font-size: 14px;
  box-shadow: 2px 2px ${colors.black};
  cursor: pointer;
  border-radius: 3px;
  text-align: center;
  font-weight: ${fontWeights.bold};

  &:hover {
    background-color: ${lighten(colors.yellow, 45)};
  }

  &:active {
    box-shadow: 1px 1px ${colors.black};
    ${transform("translate(1px, 1px)")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
