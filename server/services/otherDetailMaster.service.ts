import { OtherDetailMaster } from "../models";

export default class OtherDetailMasterService {
	public getAll = async () => {
		return await OtherDetailMaster.findAndCountAll({
			attributes: ["id", "detail_name", "detail_type"],
			order: [["detail_name", "ASC"]],
		});
	};

	public findOne = async (searchObject: any) => {
		return await OtherDetailMaster.findOne({
			where: searchObject,
			attributes: ["id", "detail_name", "detail_type"],
		});
	};
}
