import { createContext } from "react";

const ClassContext = createContext({
	data: undefined,
	reload: (handleLoading) => {},
});

const ClassProvider = ({ data, children, reload }) => {
	return (
		<ClassContext.Provider value={{ data, reload }}>
			{children}
		</ClassContext.Provider>
	);
};

export { ClassContext, ClassProvider };
