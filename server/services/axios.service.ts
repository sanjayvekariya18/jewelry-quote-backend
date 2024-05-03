import axios from "axios";

const instance = axios.create({
	baseURL: "https://apiv2.shiprocket.in/v1/external",
	headers: {
		"Content-Type": "application/json",
	},
});

// Prepare request
// instance.interceptors.request.use(
// 	(config) => {
// 		// let token = ""; //AuthStorage.getToken();
// 		// if (token) {
// 		// 	config.headers.Authorization = `Bearer ${token}`;
// 		// }
// 		console.log("config", config);
// 		return config;
// 	},
// 	(error) => Promise.reject(error)
// );

// // Prepare Response
instance.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		return Promise.reject(error.response);
	}
);

// instance.interceptors.request.use(function (config) {
//     console.log(config)
//     return config
//   }, function (error) {
//     return Promise.reject(error)
//   })

const post = (url: string, data: any, token?: string, headersData?: any) =>
	instance.post(url, data, {
		...(token && { headers: { ...(headersData && { ...headersData }), Authorization: `Bearer ${token}` } }),
	});

const destroy = (url: string, token: string) => instance.delete(url, { headers: { Authorization: `Bearer ${token}` } });

const get = (url: string, params: any, token?: string) =>
	instance.get(url, {
		params,
		...(token && { headers: { Authorization: `Bearer ${token}` } }),
	});

const put = (url: string, data: any, token: string) => instance.put(url, data, { headers: { Authorization: `Bearer ${token}` } });

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	post,
	destroy,
	get,
	put,
};
