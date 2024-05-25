import { sequelizeConnection } from "../config/database";
import { QUOTATION_STATUS } from "../enum";
import { CatalogMaster, CustomerDetails, Products, QuotationMaster } from "../models";

export default class DashboardService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getTotalData = async () => {
		const products = await Products.count({
			where: {
				is_deleted: false,
				is_active: true,
			},
		});

		const customers = await CustomerDetails.count({
			where: {
				is_deleted: false,
				is_active: true,
			},
		});

		const catalog = await CatalogMaster.count({
			where: {
				is_deleted: false,
				is_active: true,
			},
		});

		const pending_quotations = await QuotationMaster.count({ where: { status: QUOTATION_STATUS.PENDING } });
		const completed_quotations = await QuotationMaster.count({ where: { status: QUOTATION_STATUS.COMPLETED } });

		return {
			total: {
				products,
				customers,
				catalog,
				quotations: { total: pending_quotations + completed_quotations, pending: pending_quotations, completed: completed_quotations },
			},
		};
	};
}
