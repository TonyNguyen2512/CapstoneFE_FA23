import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { Button, Input, notification } from "antd";

var _connection = null;

const initialize = () => {
  _connection = new HubConnectionBuilder()
    // .withUrl(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_SIGNALR_HUB}`, {
    //   httpClient: ,
    //   withCredentials: true, 
    //   accessTokenFactory: () => {
    //     return `${localStorage.getItem("jwt")}`
    //   }
    // })
    .withUrl(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_SIGNALR_HUB}`, {headers:{}})
    .withAutomaticReconnect()
    .build();
  console.log(_connection);

  return _connection
}

const getConnection = () => {
  if (!_connection) initialize();
  return _connection
}

const setAction = (actionName, func) => {
  if (!_connection) initialize();
  if (_connection) {
    _connection
      .start()
      .then(() => {
        _connection.on(process.env[`REACT_APP_SIGNALR_ACTION_${actionName.toUpperCase()}`], (data) => {
          func(data)
        });
      })
      .catch((error) => console.log(error));
  }
}

const SignalR = {
  _connection,
  getConnection,
  initialize,
  setAction,
};

export default SignalR;