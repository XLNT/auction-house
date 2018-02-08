import styled from "react-emotion";
import { colors } from "../styles";

export const Badge = styled("span")`
  display: inline-block;
  line-height: 1;
  border-radius: 4px;
  padding: 5px 7px;
  background-color: ${props => (props.color ? props.color : colors.black)};
  color: ${props => (props.textColor ? props.textColor : "#fff")};
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: 600;
  margin-top: -2px;
  vertical-align: middle;
`;
