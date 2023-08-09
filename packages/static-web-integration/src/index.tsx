import "reflect-metadata";
import { URLString } from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import React from "react";
import ReactDOM from "react-dom";

import App from "@static-web-integration/components/App";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

//const webIntegration = new SnickerdoodleWebIntegration();
