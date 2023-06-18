import { category } from "../../utils";
import emit from "./emit";
import status from "./status";
import test_panel from "./test-panel";

export default category("Debug", [emit, status, test_panel]);
