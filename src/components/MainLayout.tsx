/* 
 * This file is part of Flower.
 * 
 * Copyright ©2018 Nicolò Mazzucato
 * Copyright ©2018 Antonio Groza
 * Copyright ©2018 Brunello Simone
 * Copyright ©2018 Alessio Marotta
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 * 
 * Flower is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Flower is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Flower.  If not, see <https://www.gnu.org/licenses/>.
 */

// @flow

import React, { Component } from "react";

// components
import FlowList from "./FlowList";
import FlowDetail from "./FlowDetail";
import AppToolbar from "./AppToolbar";

// ui
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    flexGrow: 1,
    flexDirection: "rows",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  toolbar: theme.mixins.toolbar
});
type state_types = {
  flow_id: number,
  dst_ip: string,
  dst_port: number,
  text_filter: string,
  from_time: number,
  to_time: number,
  requestInProgress: boolean,
  hexdump: boolean,
  services: Array<*>,
  selected_flow: *
};
type props_types = {
  classes: *
};
class App extends Component<props_types, state_types> {
  constructor(props) {
    super(props);

    this.state = {
      flow_id: 0,
      dst_ip: "",
      dst_port: 0,
      text_filter: "",
      from_time: 0,
      to_time: Number.MAX_SAFE_INTEGER,
      requestInProgress: false,
      hexdump: false,
      services: [],
      selected_flow: null
    };
  }

  getFilters() {
    var res = {};
    Object.assign(res, this.state);
    return res; //all'interno ci sono tutti i campi necessari
  }
  getFavouriteFilter() {
    var filters = this.getFilters();
    filters["starred"] = 1;
    return filters;
  }
  render() {
    const { classes } = this.props;

    // todo handle flow list fetch failed
    const left_favourites_bar = (
      <FlowList
        list_id="fav_list"
        filters={this.getFavouriteFilter()}
        onFlowSelected={flow => {
          console.log("Selezionato un flow");
          this.setState({ selected_flow: flow });
        }}
        onFlowsLoaded={() => this.setState({ requestInProgress: false })}
        services={this.state.services}
        width={300}
        largeItems={false}
      />
    );

    const flow_list = (
      <FlowList
        list_id="main_list"
        filters={this.getFilters()}
        onFlowSelected={flow => {
          console.log("Selezionato un flow");
          this.setState({ selected_flow: flow });
        }}
        largeItems={true}
        onFlowsLoaded={() => this.setState({ requestInProgress: false })}
        services={this.state.services}
        width={450}
      />
    );
    const flow_details = this.state.selected_flow && (
      <FlowDetail
        className={classes.details}
        flow={this.state.selected_flow}
        hexdump={this.state.hexdump}
        filter={this.state.text_filter}
      />
    );
    return (
      <div>
        <AppToolbar
          onRequestSearch={this.handleRequestSearch}
          onTimeSet={this.handleTimeSet}
          onTargetChanged={this.handleTargetChanged}
          hexdump={this.state.hexdump}
          toggleHexdump={this.handleToggleHexdump}
          onServicesFetched={this.handleServicesFetched}
          requestInProgress={this.state.requestInProgress}
        />
        <div className={classes.toolbar} />
        <div class="row">
          <div class="column_4_small">{left_favourites_bar}</div>
          <div class="column_4_big">{flow_list}</div>
          <div class="column_2">{flow_details}</div>
        </div>
      </div>
    );
  }

  private handleRequestSearch = (text: string) => {
    this.setState({ text_filter: text, requestInProgress: true });
  };

  handleTimeSet = (from, to) => {
    this.setState({ from_time: from, to_time: to });
  };

  handleTargetChanged = (dst_ip, dst_port) => {
    this.setState({
      dst_ip: dst_ip,
      dst_port: dst_port,
      requestInProgress: true
    });
  };

  handleToggleHexdump = () => {
    this.setState({ hexdump: !this.state.hexdump });
  };

  handleServicesFetched = services => {
    this.setState({ services: services });
  };
}
export default withStyles(styles)(App);