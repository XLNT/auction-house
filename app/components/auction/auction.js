import styled, { keyframes } from "react-emotion";
import {
  Wrapper,
  Button,
  Badge,
  Spacer,
  colors,
  basePadding,
  fontSizes,
  darken,
  transform
} from "../../styles";

function pulseBuilder() {
  const pulse = keyframes`
    0% { -webkit-transform: scale(0) }
    100% {
      -webkit-transform: scale(0.75);
      opacity: 50;
    }
  `;
  return pulse;
}

export const Container = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: auto;
`;

export const Status = styled("div")`
  font-size: 15px;
  font-weight: 400;
  color: ${colors.grey};
  text-transform: uppercase;
  display: inline-block;
`;

export const StatusPulse = styled("div")`
  background-color: ${props => (props.color ? props.color : colors.black)};
  width: 8px;
  height: 8px;
  display: inline-block;
  margin-bottom 2px;
  border-radius: 100%;
  animation: ${pulseBuilder()} 1.5s infinite ease-in-out;
`;

export const Heading = styled("span")`
  font-size: 40px;
  font-weight: 600;
  display: inline-block;
  color: white;
`;

export const SellerInformation = styled("div")`
  font-weight: 100;
  font-size: 14px;
  color: white;
`;

export const Description = styled("div")`
  font-size: 18px;
  font-weight: 300;
  color: white;
`;

export const Gallery = styled("div")`
  width: 100%;
  height: 350px;
  background-color: black;
  & img {
    height: 350px;
    width: 100%;
  }
`;

export const Line = styled("hr")`
  width: 80%;
  color: ${colors.grey};
  margin: auto;
`;
