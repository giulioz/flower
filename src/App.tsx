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
import "./App.css";

// components
import { AppTheme } from "./AppTheme";
import MainLayout from "./components/MainLayout";

// ui
import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";

class App extends React.Component {
  public render() {
    return (
      <MuiThemeProvider theme={AppTheme}>
        <CssBaseline />
        <MainLayout />
      </MuiThemeProvider>
    );
  }
}
export default App;
