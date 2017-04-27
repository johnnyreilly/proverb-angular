﻿export const sidebarName = "sidebar";

sidebar.$inject = [];
export function sidebar() {
    // Opens and closes the sidebar menu.
    // Usage:
    //  <div sidebar>
    // Creates:
    //  <div sidebar class="sidebar">
    const directive = {
        link: link,
        restrict: "A"
    };
    return directive;

    function link(scope: ng.IScope, element: ng.IAugmentedJQuery, _attrs: ng.IAttributes) {

        const $sidebarInner = element.find(".sidebar-inner");
        const $dropdownElement = element.find(".sidebar-dropdown a");
        let sideBarIsExpanded = false;
        const sideBarIsExpandedClass = "sideBarIsExpanded";

        element.addClass("sidebar");

        $dropdownElement.click(e => {
            e.preventDefault();

            // Show or hide the sidebar
            if (sideBarIsExpanded) {
                collapseSidebar();
            } else {
                expandSidebar();
            }
        });

        // collapse sidebar when route change starts (only affects mobile)
        scope.$on("$stateChangeStart", (_event, _toState, _toParams, _fromState, _fromParams) => {
            if (sideBarIsExpanded) {
                collapseSidebar();
            }
        });

        /**
         * Slide up and hide the sidebar (only used when in mobile view mode)
         */
        function collapseSidebar() {

            $sidebarInner.slideUp(350);
            $dropdownElement.removeClass(sideBarIsExpandedClass);
            sideBarIsExpanded = false;
        }

        /**
         * Slide down and show the sidebar (only used when in mobile view mode)
         */
        function expandSidebar() {

            $sidebarInner.slideDown(350);
            $dropdownElement.addClass(sideBarIsExpandedClass);
            sideBarIsExpanded = true;
        }
    }
}
