import React, { Component } from "react";
import { observer } from "mobx-react";
import { observable, action, runInAction, computed } from "mobx";
import styled, { keyframes } from "react-emotion";

import { Wrapper, Spacer, Centered, colors } from "../styles";

const Heading = styled("div")`
  font-size: 64px;
  color: white;
  width: 100%;
  font-weight: bold;
`;

const Description = styled("div")`
  font-size: 28px;
  font-weight: 200;
  color: white;
  width: 100%;
`;

@observer
export default class About extends Component {
  @observable messageIndex = 0;
  @observable message = undefined;
  @observable currentLength = 0;
  @observable fadeBuffer = false;
  codeletters = "&#*+%?£@§$";
  messages = [
    "A cryptocollectible wallet and showcase",
    "A cryptocollectible auction marketplace",
    "A community for cryptocollectibles",
    "A social, p2p trading layer for cryptocollectibles",
    "All built on the open standards you know and love",
    "A series of partnerships and experiments to answer that question of “what’s next”"
  ];

  componentWillMount() {
    setTimeout(this.animateIn.bind(this), 100);
  }

  animateIn() {
    if (this.currentLength < this.messages[this.messageIndex].length) {
      this.currentLength = this.currentLength + 2;
      if (this.currentLength > this.messages[this.messageIndex].length) {
        this.currentLength = this.messages[this.messageIndex].length;
      }
      this.message = this.generateRandomString(this.currentLength);
      setTimeout(this.animateIn.bind(this), 20);
    } else {
      setTimeout(this.animateFadeBuffer.bind(this), 20);
    }
  }

  animateFadeBuffer() {
    if (this.fadeBuffer === false) {
      this.fadeBuffer = [];
      for (let i = 0; i < this.messages[this.messageIndex].length; i++) {
        this.fadeBuffer.push({
          c: Math.floor(Math.random() * 12) + 1,
          l: this.messages[this.messageIndex].charAt(i)
        });
      }
    }

    let cycles = false;
    this.message = "";

    for (let i = 0; i < this.fadeBuffer.length; i++) {
      let fader = this.fadeBuffer[i];
      if (fader.c > 0) {
        cycles = true;
        fader.c--;
        this.message += this.codeletters.charAt(
          Math.floor(Math.random() * this.codeletters.length)
        );
      } else {
        this.message += fader.l;
      }
    }

    if (cycles === true) {
      setTimeout(this.animateFadeBuffer.bind(this), 50);
    } else {
      setTimeout(this.cycleText.bind(this), 2000);
    }
  }

  cycleText() {
    this.messageIndex = this.messageIndex + 1;
    if (this.messageIndex >= this.messages.length) {
      this.messageIndex = 0;
    }

    this.currentLength = 0;
    this.fadeBuffer = false;
    this.description = undefined;

    setTimeout(this.animateIn.bind(this), 200);
  }

  generateRandomString(length) {
    let randomText = "";
    while (randomText.length < length) {
      randomText += this.codeletters.charAt(
        Math.floor(Math.random() * this.codeletters.length)
      );
    }

    return randomText;
  }

  render() {
    return (
      <Wrapper>
        <Centered>
          <Spacer size={5} />
          <Heading>XLNT 🎉 is</Heading>
          <Spacer size={2} />
          <Description>{this.message}</Description>
        </Centered>
      </Wrapper>
    );
  }
}
