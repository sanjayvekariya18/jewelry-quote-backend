export default class StyleMasterValidation {
	public getAll = {
		searchTxt: "string",
		parent_id: "string",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};
}
