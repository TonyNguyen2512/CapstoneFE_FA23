import BaseApi from ".";

const login = async (username, password) => {
	try {
		// // local
		// let user = mockAccounts.find((item) => (item.email === username || item.username === username) && item.password === password)
		// if (!!user) {
		// 	localStorage.setItem("user", JSON.stringify(user));
		// 	return true
		// }
		const response = await BaseApi.post("/User/Login", {
			phoneNumber: username,
			password: password,
		});
		if (response.status === 200) {
			const jwt = response.data.result["access_token"];
			const userId = response.data.result["userID"];
			localStorage.setItem("jwt", jwt);
			localStorage.setItem("userId", userId);
			return true;
		}
		// let user = mockAccounts.find((item) => (item.email === email || item.username === email) && item.password === password)
		// if (!!user) {
		// 	localStorage.setItem("user", JSON.stringify(user));
		// 	return true
		// }
		// return false
	} catch (error) {
		console.log("Wrong email or password", error);
		return false;
	}
};

const authorize = async () => {
	try {
<<<<<<< HEAD
		const response = await BaseApi.get("/User");
		const user = response.data;
		return user;
=======
		const userId = localStorage.getItem("userId");
		const response = await BaseApi.get("/User/GetById/" + userId);
		return response.data;
>>>>>>> 48be394173a2928fdcf5f64e066e52f0076689f3
		// const user = JSON.parse(localStorage.getItem("user")) || {};
		// return user
	} catch (error) {
		console.log("Error get user: ", error);
		return undefined;
	}
};

<<<<<<< HEAD
const AuthApi = {
	login,
	getUser,
=======
const register = async (email, fullName, password, roleId) => {
	const response = await BaseApi.post("/User/Register", {
		email: email,
		fullName: fullName,
		password: password,
		roleId: roleId,
	});
	return response.status === 200;
};

const AuthApi = {
	login,
	authorize,
	register,
>>>>>>> 48be394173a2928fdcf5f64e066e52f0076689f3
};

export default AuthApi;
