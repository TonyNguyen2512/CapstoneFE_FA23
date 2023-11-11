import { createContext } from "react";

const OrderDetailsContext = createContext({
	details: undefined,
	users: [],
	list: [],
	reload: (handleLoading) => { },
});

const OrderDetailsProvider = ({ details, users, list, children, reload }) => {
	return (
		<OrderDetailsContext.Provider value={{ details, users, list, reload }}>
			{children}
		</OrderDetailsContext.Provider>
	);
};

export { OrderDetailsContext, OrderDetailsProvider };
