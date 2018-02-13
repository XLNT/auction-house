import React, { Component } from "react";
import styled, { css } from "react-emotion";
import { basePadding, screenWidth, colors } from "../styles";

const spacerSize = (pads, props) => {
  return css`
    ${props.inline ? "width:" : "height:"} ${basePadding * pads}px;
  `;
};

export const Spacer = styled("div")`
  ${props => {
    if (props.big) return spacerSize(2, props);
    if (props.small) return spacerSize(0.5, props);
    if (props.size) return spacerSize(props.size, props);
    return spacerSize(1, props);
  }};
  ${props =>
    props.inline &&
    `
    display: inline-block;
  `};
`;

export const Wrapper = styled("div")`
  width: 95%;
  max-width: ${screenWidth}px;
  margin: auto;
`;

export const LeftContainer = styled("div")`
  width: ${props => (props.width ? props.width : "100")}%;
  float: left;
  padding: ${basePadding / 2}px;
`;

export const RightContainer = styled("div")`
  width: ${props => (props.width ? props.width : "100")}%;
  float: right;
  padding: ${basePadding / 2}px;
`;

export const Line = styled("hr")`
  margin: 0;
  padding: 0;
  height: 0;
  border: 0 none;
  border-bottom: 1px solid ${colors.lightBorderGrey};
  width: 100%;
`;

export class Divider extends Component {
  render() {
    const { padded } = this.props;
    const size = isNaN(padded) ? 1 : padded;
    return (
      <div>
        {padded && <Spacer size={size} />}
        <Line />
        {padded && <Spacer size={size} />}
      </div>
    );
  }
}

export class FloatRight extends Component {
  render() {
    const { children } = this.props;
    return <div style={{ float: "right" }}>{children}</div>;
  }
}

export class Centered extends Component {
  render() {
    const { children } = this.props;
    return <div style={{ textAlign: "center" }}>{children}</div>;
  }
}
