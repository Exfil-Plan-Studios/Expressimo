import APIRequest from "./APIRequest";

const routes = {
    search: async (searchname) => {
		return await APIRequest({
			url: "api/search",
			data: {
				searchname: searchname,
			},
			method: "POST",
		}).then((r) => {
			return r.data;
		});
	},

}

export default routes;