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

import * as React from "react";

import AppBar from "@material-ui/core/AppBar";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { Theme, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchBar from "material-ui-search-bar";

import ServiceSelector from "./ServiceSelector";

const styles = (theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    position: "fixed"
  },
  toolbar: theme.mixins.toolbar,
  progress: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 100,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    height: theme.spacing.unit * 6,
    padding: 3
  },
  serviceSelector: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    height: theme.spacing.unit * 6,
    padding: 3
  }
});

interface IAppToolbarProps {
  classes: any;
  onTargetChanged: (target: any) => void;
  hexdump: boolean;
  requestInProgress: boolean;
  onRequestSearch: (str: string) => void;
  toggleHexdump: (value: boolean) => void;
  onTimeSet: (start: number, end: number) => void;
  onServicesFetched: (services: IService[]) => void;
};

interface IAppToolbarState {
  fromTime: number;
  toTime: number;
};

export class AppToolbar extends React.Component<IAppToolbarProps, IAppToolbarState> {
  public state = {
    fromTime: 0,
    toTime: Number.MAX_SAFE_INTEGER
  };

  public render() {
    const { classes } = this.props;

    return (
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu" />

          {/*// eslint-disable-next-line*/}
          <Typography variant="title" color="inherit">
            Flower
          </Typography>
          <span
            role="img"
            aria-label="flower"
            style={{ margin: 10, fontSize: 30 }}
          >
            🌸
          </span>
          <SearchBar
            onRequestSearch={this.props.onRequestSearch}
            style={{
              margin: 10,
              padding: 3,
              marginLeft: 100,
              maxWidth: 400
            }}
          />
          <Paper className={classes.textField}>
            <TextField
              InputProps={{ disableUnderline: true }}
              id="fromTime"
              label="From"
              type="time"
              defaultValue="00:00"
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                step: 300 // 5 min
              }}
              onChange={item => {
                var time = this.getTimeFromString(item.target.value);
                console.log(item.target.value);
                this.setState({ fromTime: time });
                this.props.onTimeSet(time, this.state.toTime);
              }}
            />
          </Paper>
          <Paper className={classes.textField}>
            <TextField
              InputProps={{ disableUnderline: true }}
              id="toTime"
              label="To"
              type="time"
              defaultValue={this.getActualTimeString()}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                step: 300 // 5 min
              }}
              onChange={item => {
                var time = this.getTimeFromString(item.target.value);
                if (item === 0) item = Number.MAX_SAFE_INTEGER;
                console.log(item.target.value);
                this.setState({ toTime: time });
                this.props.onTimeSet(this.state.fromTime, time);
              }}
            />
          </Paper>

          <Paper className={classes.serviceSelector}>
            <ServiceSelector
              onTargetChanged={this.props.onTargetChanged}
              onServicesFetched={this.props.onServicesFetched}
              style={{ margin: 0, padding: 0 }}
            />
          </Paper>

          <FormControlLabel
            control={
              <Checkbox
                checked={this.props.hexdump}
                onChange={this.props.toggleHexdump}
                value="Hexdump"
              />
            }
            className={classes.checkbox}
            label="Hexdump"
            style={{ margin: 5 }}
          />

          {this.props.requestInProgress ? (
            <CircularProgress className={classes.progress} color="secondary" />
          ) : null}
        </Toolbar>
      </AppBar>
    );
  }



  private getActualTimeString() {
    const d = new Date();
    return d.getHours() + ":" + d.getMinutes();
  }

  private getTimeFromString(timeStr: string) {
    if (timeStr.length === 0) {return 0;}
    const h = parseInt(timeStr.split(":")[0], 10);
    const min = parseInt(timeStr.split(":")[1], 10);
    const d = new Date();
    d.setUTCHours(h - 2); // fast time-zone fix TODO FIX THIS
    d.setUTCMinutes(min);
    return d.getTime();
  }
}

export default withStyles(styles)(AppToolbar);
