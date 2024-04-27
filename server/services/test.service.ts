import initSchemaRelationship from "../InitialDBSetup/initSchemaRelationship";
import { logInfo } from "../utils/helper";
import { CategoryService } from "./";

class TestService {
	static async run() {
		initSchemaRelationship();
	}
}

TestService.run();
