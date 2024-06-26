import { LoggedInCustomerDetails, LoggedInUserDetails, PermissionDetails } from "../../server/services/authorization.service";
import { ApiResponse } from "../../server/utils";
import { Server } from "socket.io";

declare global {
	namespace Express {
		interface Request {
			authUser: LoggedInUserDetails;
			customer: LoggedInCustomerDetails;
			// profile: any;
			socketIo: Server;
			mergedBody: any;
		}
		interface Response {
			api: ApiResponse;
		}
	}
}
