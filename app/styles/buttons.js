import styled from "react-emotion";
import { colors, basePadding, lighten, darken } from "../styles";

export const Button = styled("button")`
  display: inline-block;
  background-color: ${colors.white};
  border: 1px solid ${colors.darkGrey};
  padding: ${basePadding / 2}px ${basePadding}px;
  font-size: 14px;
  box-shadow: 2px 2px ${colors.black};
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    background-color: ${lighten(colors.yellow, 45)};
  }

  &:active {
    margin-top: 1px;
    box-shadow: 1px 1px ${colors.black};
  }
`;
