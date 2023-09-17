import { createContext, useState } from "react";

const initialValue = {
	user: undefined,
	setUser: undefined,
};

export const UserContext = createContext(initialValue);

const UserProvider = ({ children }) => {
	const [user, setUser] = useState({});
	return (
		<UserContext.Provider value={{ user: user, setUser: setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
