import styled from "react-emotion";
import { colors, basePadding } from "../styles";

export const Badge = styled("span")`
  display: inline-block;
  line-height: 1;
  border-radius: 4px;
  padding: 5px 7px;
  background-color: ${props => (props.color ? props.color : colors.black)};
  color: ${props => (props.textColor ? props.textColor : "#fff")};
  text-transform: uppercase;
  font-size: 1em;
  font-weight: 600;
  margin-top: ${basePadding * -1}px;
  vertical-align: middle;
`;
