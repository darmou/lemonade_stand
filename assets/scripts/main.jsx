/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from "react";
import RaisedButton from "material-ui/RaisedButton";
import {blue500} from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { reducer as api } from "redux-json-api";
import { setEndpointHost, setEndpointPath} from "redux-json-api";
import ApiResults from "./components/ItemList";
import CreateItem from "./components/CreateItem";
import { myConfig } from "./config.js";

const reducer = combineReducers({
    api
});

const store = createStore(reducer, applyMiddleware(thunk));
store.dispatch(setEndpointHost(myConfig.host));
store.dispatch(setEndpointPath(myConfig.apiUrl));

const styles = {
  container: {
    textAlign: "center",
    paddingTop: 20,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: blue500,
  },
});

class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false
    };
  }

  handleRequestClose() {
    this.setState({
      open: false,

    });
  }



  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  render() {

    return (
      <MuiThemeProvider muiTheme={muiTheme}>

        <div style={styles.container}>
          <h4>Sally's Lemonade Stand Inventory</h4>

          <CreateItem handleRequestClose={this.handleRequestClose} open={this.state.open} store={store}/>


          <RaisedButton
            label="Add Item"
            id="add_item"
            secondary={true}
            onTouchTap={this.handleTouchTap}
          />
            <ApiResults store={store} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
