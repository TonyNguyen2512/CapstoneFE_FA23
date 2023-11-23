const useMicrosoftSignalR = () => {
  const microsoftSignalR = require("@microsoft/signalr");

  const host = process.env.REACT_APP_BE_URL;
  const token = localStorage.getItem("jwt");

  const createMicrosoftSignalrConnection = (hubEndPoint) => {
    // setup/create connection for a hub
    let connection = new microsoftSignalR.HubConnectionBuilder()
      .withUrl(`${host}${hubEndPoint}`, {
        accessTokenFactory: () => token?.toString(),
        skipNegotiation: true,
        transport: microsoftSignalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    // start connection
    connection
      .start()
      .then(() => {
        console.log(`${hubEndPoint} connected`);
      })
      .catch((error) => {
        console.log(`${hubEndPoint} connection error: ${error}`);
      });

    // reconnecting
    connection.onreconnecting((error) => {
      console.log(`${hubEndPoint} reconnecting error: ${error}`);
      connection.start().catch(console.log);
    });

    // listen reconnected
    connection.onreconnected(() => {
      console.log(`${hubEndPoint} reconnected`);
    });

    return connection;
  };

  // enum noti hub
  const ENotificationHub = {
    EndPoint: "/notificationHub",
    Method: {
      NewNotify: "newNotify",
    },
  };

  return {
    createMicrosoftSignalrConnection,
    ENotificationHub,
  };
};
export default useMicrosoftSignalR;
