import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Spacer,
  Divider,
  colors,
  Button,
  basePadding,
  lighten
} from "../styles";
import styled from "react-emotion";
import Draggable from "react-draggable";

const Window = styled("div")`
  width: 50%;
  border: 1px solid blue;
  background-color: white;
  z-index: 1;
  margin-left: ${basePadding}px;
  padding: ${basePadding}px;
  color: blue;
  border-radius: 3px;
  box-shadow: 3px 3px ${lighten("blue", 30)};
  position: absolute;
  top: ${props => props.top || 0}px;
  left: ${props => props.left || 0}px;
  z-index: ${props => props.zIndex || 1};
`;

@inject("store")
@observer
export default class DesktopWindow extends Component {
  closeWindow() {
    this.props.store.removeWindow(this.props.item.key);
  }

  handleClick() {
    this.props.store.focusWindow(this.props.item.key);
  }

  render() {
    console.log(this.props);
    return (
      <Draggable>
        <Window
          zIndex={this.props.item.z}
          top={this.props.item.top}
          left={this.props.item.left}
          onClick={() => this.handleClick()}
        >
          <a
            onClick={e => {
              this.closeWindow();
              e.stopPropagation();
            }}
          >
            Close
          </a>
          <this.props.item.component {...this.props.item.props} />
          {this.props.children}
        </Window>
      </Draggable>
    );
  }
}
