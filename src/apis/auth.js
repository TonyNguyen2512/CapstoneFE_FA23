import BaseApi from ".";

const login = async (phone, password) => {
	try {
		const response = await BaseApi.post("/User/Login", {
			phoneNumber: phone,
			password: password,
		});
		if (response.status === 200) {
			const jwt = response.data["token"];
			localStorage.setItem("jwt", jwt);
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

const getUser = async () => {
	try {
		const response = await BaseApi.get("/User");
		const user = response.data;
		return user;
		// const user = JSON.parse(localStorage.getItem("user")) || {};
		// return user
	} catch (error) {
		console.log("Error get user: ", error);
		return undefined;
	}
};

const AuthApi = {
	login,
	getUser,
};

export default AuthApi;
