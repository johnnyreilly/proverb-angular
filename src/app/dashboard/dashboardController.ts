import { commonServiceName, CommonService } from "../common/common";
import { Loggers } from "../common/logger";
import { datacontextName, DataContext } from "../services/datacontext";
import { Sage } from "../services/repository.sage";

export const dashboardControllerName = "dashboard";

export class DashboardController {

    log: Loggers;
    sages: Sage[];

    static $inject = [commonServiceName, datacontextName];
    constructor(
        private common: CommonService,
        private datacontext: DataContext
        ) {

    }

    $onInit() {
        this.sages = [];

        this.log = this.common.logger.getLoggers(dashboardControllerName);

        const promises: ng.IPromise<any>[] = [this.getSages()];
        this.common.activateController(promises, dashboardControllerName, "Dashboard")
            .then(() => this.log.info("Activated Dashboard View"));
    }

    // Prototype methods

    getSages() {
        return this.datacontext.sage.getAll().then(data => this.sages = data);
    }
}
