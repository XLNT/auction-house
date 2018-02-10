import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { action, observable } from "mobx";

const zeroPad = (value, length = 2) => {
  if (length === 0) return value;
  const strValue = String(value);
  return strValue.length >= length
    ? strValue
    : ("0".repeat(length) + strValue).slice(length * -1);
};

@inject("store")
@observer
export default class Countdown extends Component {
  @observable days = undefined;
  @observable hours = undefined;
  @observable minutes = undefined;
  @observable seconds = undefined;
  @observable completed = false;

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  @action
  tick() {
    console.log("HEY");
    let now = new Date().getTime();
    let endDate = new Date().getTime() + 100000;
    // typeof this.props.endDate === "string"
    //   ? new Date(this.props.endDate)
    //   : this.props.endDate;
    let difference = endDate - now;
    this.days = zeroPad(Math.floor(difference / (1000 * 60 * 60 * 24)));
    this.hours = zeroPad(
      Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    this.minutes = zeroPad(
      Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    );
    this.seconds = zeroPad(Math.floor((difference % (1000 * 60)) / 1000));

    if (difference < 0) {
      clearInterval(this.interval);
      this.completed = true;
    }
  }

  render() {
    return <div>{this.seconds}</div>;
  }
}
