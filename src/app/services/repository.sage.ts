import Moment from "moment";

import { commonServiceName, CommonService } from "../common/common";
import { configName, Config } from "../typesAndInterfaces/config";
import { SaveResult } from "../typesAndInterfaces/saveResult";
import { LoggerFunction } from "../common/logger";
import { Saying } from "./repository.saying";

export interface Sage {
    id: number;
    name: string;
    username: string;
    email: string;
    dateOfBirth: Date;
    sayings?: Saying[];
}

export const repositorySageServiceName = "repository.sage";

export class RepositorySageService {

    log: LoggerFunction;
    rootUrl: string;
    cache: Map<number, Sage>;

    static $inject = ["$http", commonServiceName, configName, "moment"];
    constructor(private $http: ng.IHttpService, private common: CommonService, config: Config, private moment: typeof Moment) {
        this.log = common.logger.getLogFn(repositorySageServiceName);
        this.rootUrl = config.remoteServiceRoot + "sage";
        this.cache = new Map();
    }

    getAll() {
        return this.$http.get<Sage[]>(this.rootUrl).then(response => {
            const sages = response.data.map(sage => {
                sage.dateOfBirth = this.moment(sage.dateOfBirth).toDate();
                return sage;
            });
            this.log(sages.length + " Sages loaded");
            return sages;
        });
    }

    getById(id: number, forceRemote?: boolean) {
        let sage: Sage;
        if (!forceRemote) {
            sage = this.cache.get(id);
            if (sage) {
                this.log("Sage " + sage.name + " [id: " + sage.id + "] loaded from cache");
                return this.common.$q.when(sage);
            }
        }

        return this.$http.get<Sage>(this.rootUrl + "/" + id).then(response => {
            sage = response.data;
            sage.dateOfBirth = this.moment(sage.dateOfBirth).toDate();
            this.cache.set(sage.id, sage);
            this.log("Sage " + sage.name + " [id: " + sage.id + "] loaded");
            return sage;
        });
    }

    remove(id: number) {
        return this.$http.delete<void>(this.rootUrl + "/" + id).then(response => {
            this.log("Sage [id: " + id + "] removed");

            return response.data;
        }, errorReason => this.common.$q.reject(errorReason.data));
    }

    save(sage: Sage) {
        return this.$http.post<SaveResult>(this.rootUrl, sage).then(response => {
            if (response.data.isSaved) {
                this.log("Sage " + sage.name + " [id: " + response.data.savedId + "] saved");
                return response.data.savedId;
            } else {
                return this.common.$q.reject(response.data.validations);
            }
        }, errorReason => this.common.$q.reject(errorReason.data));
    }
}
