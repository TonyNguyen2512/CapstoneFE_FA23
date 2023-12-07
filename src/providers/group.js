import { createContext } from "react";

const GroupContext = createContext({
	data: undefined,
	reload: (handleLoading) => {},
});

const GroupProvider = ({ data, children, reload }) => {
	return (
		<GroupContext.Provider value={{ data, reload }}>
			{children}
		</GroupContext.Provider>
	);
};

export { GroupContext, GroupProvider };
