import { HubConnectionBuilder } from "@microsoft/signalr";
import { Button, Input, notification } from "antd";

var _connection = null;

const initialize = (userId) => {
  _connection = new HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_SIGNALR_URL}/${userId}`)
    .withAutomaticReconnect()
    .build();
  if (_connection) {
    _connection
      .start()
      .then(() => {
        _connection.on(process.env.REACT_APP_SIGNALR_ACTION, (data) => {
          notification.open({
            message: "New Notification",
            description: data.message,
          });
        });
      })
      .catch((error) => console.log(error));
  }
  return _connection
}

const getConnection = () => {

}

const SignalR = {
  getConnection,
  initialize,
  connection: _connection,
};

export default SignalR;