import React, { Component } from "react";
import { action, autorun, observable, observe, runInAction, when } from "mobx";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class Home extends Component {
  componentDidMount() {
    this.addWindows();
  }

  @action
  addWindows() {
    this.props.store.windows = [...this.props.store.windows, ...[`Home page`]];
  }

  render() {
    return <div />;
  }
}
