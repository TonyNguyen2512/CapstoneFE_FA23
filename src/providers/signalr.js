// // need to re-install react-signalr
// import { useEffect } from "react";
// import { createSignalRContext } from "react-signalr/signalr";

// const SignalRContext = createSignalRContext();

// const SignalRProvider = ({ url, actionName, children }) => {
//   const { token } = localStorage.getItem("jwt");

//   SignalRContext.useSignalREffect(
//     // Your Event/Action Key
//     process.env[`REACT_APP_SIGNALR_ACTION_${actionName.toUpperCase()}`],
//     (response) => {
//       console.log("Connect Success!!\n", response);
//     }
//   );
//   useEffect(() => {
//     console.log('Hub connected')
//   }, [token]);

//   return (
//     <SignalRContext.Provider
//       connectEnabled={!!token}
//       accessTokenFactory={() => token}
//       //remove previous connection and create a new connection if token was changed
//       dependencies={[token]}
//       url={url}
//     >
//       {children}
//     </SignalRContext.Provider>
//   );
// };

// export { SignalRContext, SignalRProvider };