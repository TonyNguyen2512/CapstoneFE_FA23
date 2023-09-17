import BaseApi from ".";
import { mockAccounts } from "../__mocks__/account";

const login = async (email, password) => {
	try {
		// const response = await BaseApi.post("/Users/Login", {
		// 	email: email,
		// 	password: password,
		// });
		// if (response.status === 200) {
		// 	const jwt = response.data["token"];
		// 	localStorage.setItem("jwt", jwt);
		// 	return true;
		// }
		let user = mockAccounts.find((item) => item.email === email && item.password === password)
		if (!!user) {
			localStorage.setItem("user", JSON.stringify(user));
			return true
		}
		return false
	} catch (error) {
		console.log("Wrong email or password", error);
		return false;
	}
};

const getUser = async () => {
	try {
		// const response = await BaseApi.get("/Users/GetUser");
		// const user = response.data;
		// return user;
		const user = JSON.parse(localStorage.getItem("user")) || {};
		return user
	} catch (error) {
		console.log("Error get user: ", error);
		return undefined;
	}
};

const register = async (email, fullName, password, roleId) => {
	const response = await BaseApi.post("/Users/Register", {
		email: email,
		fullName: fullName,
		password: password,
		roleId: roleId,
	});
	return response.status === 200;
};

const AuthApi = {
	login,
	getUser,
	register,
};

export default AuthApi;
