import initSchemaRelationship from "../InitialDBSetup/initSchemaRelationship";
import { logInfo } from "../utils/helper";

class TestService {
	static async run() {
		initSchemaRelationship();
	}
}

TestService.run();
