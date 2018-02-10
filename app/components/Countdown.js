import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { action, observable, computed } from "mobx";
import styled from "react-emotion";

const Timer = styled("div")`
  font-size: 40px;
  font-weight: bold;
`;

@inject("store")
@observer
export default class Countdown extends Component {
  @observable days = undefined;
  @observable hours = undefined;
  @observable minutes = undefined;
  @observable seconds = undefined;
  @observable completed = false;

  componentWillMount() {
    this.tick();
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  zeroPad(value, length = 2) {
    if (length === 0) return value;
    const strValue = String(value);
    return strValue.length >= length
      ? strValue
      : ("0".repeat(length) + strValue).slice(length * -1);
  }

  @computed
  get getEndDate() {
    return typeof this.props.endDate === "string"
      ? new Date(this.props.endDate)
      : this.props.endDate;
  }

  @action
  tick() {
    const now = new Date().getTime();
    const endDate = this.getEndDate;
    const difference = endDate - now;

    this.days = this.zeroPad(Math.floor(difference / (1000 * 60 * 60 * 24)));
    this.hours = this.zeroPad(
      Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    this.minutes = this.zeroPad(
      Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    );
    this.seconds = this.zeroPad(Math.floor((difference % (1000 * 60)) / 1000));

    if (difference < 0) {
      clearInterval(this.interval);
      this.completed = true;
    }
  }

  render() {
    return (
      <Timer>
        {this.days} : {this.hours} : {this.minutes} : {this.seconds}
      </Timer>
    );
  }
}
