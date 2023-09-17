import { createContext } from "react";

const initialValue = {};

const SemesterTypeContext = createContext(initialValue);

const SemesterTypeProvider = ({ data, children }) => {
	return <SemesterTypeContext.Provider value={data}>{children}</SemesterTypeContext.Provider>;
};

export { SemesterTypeContext, SemesterTypeProvider };
