import { ConfigRoute } from "../app.routes";

export const topnavComponentName = "proverbTopnav";

class TopNavController {
    navRoutes: ConfigRoute[];
    currentRoute: string;
    isCollapsed: boolean;
    onIsCollapsedChanged: Function;

    static $inject = ["routes"];
    constructor(private routes: ConfigRoute[]) {}

    $onInit() {
        this.navRoutes = this.getNavRoutes();
    }

    toggleCollapsed() {
        this.onIsCollapsedChanged({ newIsCollapsed: !this.isCollapsed });
    }

    getNavRoutes() {
        return this.routes
            .filter(r => (r.settings && r.settings.nav) ? true : false)
            .sort((r1, r2) => r1.settings.nav - r2.settings.nav);
    }

    isCurrent(route: ConfigRoute) {
        return route && this.currentRoute && route.name === this.currentRoute ? "current" : "";
    }
}

export const topnavComponent = {
    bindings: {
        currentRoute: "<",
        isCollapsed: "<",
        onIsCollapsedChanged: "&"
    },
    controllerAs: "vm",
    controller: TopNavController,
    template: require("./topnav.html")
};

