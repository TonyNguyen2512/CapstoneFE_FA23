import { createContext } from "react";

const ProjectContext = createContext({});

const ProjectProvider = ({ project, children }) => {
	return (
		<ProjectContext.Provider value={project}>
			{children}
		</ProjectContext.Provider>
	);
};

export { ProjectContext, ProjectProvider };
