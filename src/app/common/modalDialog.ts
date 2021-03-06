interface BootstrapDialogOptions {
    title: string;
    message: string;
    okText: string;
    cancelText: string;
}

interface BootstrapDialogScope extends ng.IScope {
    title: string;
    message: string;
    okText: string;
    cancelText: string;
    ok: () => void;
    cancel: () => void;
}

export const modalDialogServiceName = "modalDialog";

export class ModalDialogService {

    static $inject = ["$uibModal", "$templateCache"];
    constructor(
        private $uibModal: ng.ui.bootstrap.IModalService) {
    }

    deleteDialog(message: string = "Delete item?") {

        const title = "Confirm";
        return this.confirmationDialog(title, message);
    }

    confirmationDialog(title: string, msg: string, okText?: string, cancelText?: string) {

        const modalOptions = {
            controller: ModalInstance,
            keyboard: true,
            resolve: {
                options: () => ({
                    title: title,
                    message: msg,
                    okText: okText,
                    cancelText: cancelText
                })
            } as { [index: string]: any },
            template: require("./modalDialog.html")
        };

        return this.$uibModal.open(modalOptions).result;
    }
}

class ModalInstance {

    static $inject = ["$scope", "$uibModalInstance", "options"];
    constructor (
        $scope: BootstrapDialogScope,
        $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
        options: BootstrapDialogOptions) {

        $scope.title = options.title || "Title";
        $scope.message = options.message || "";
        $scope.okText = options.okText || "OK";
        $scope.cancelText = options.cancelText || "Cancel";
        $scope.ok = function () { $uibModalInstance.close("ok"); };
        $scope.cancel = function () { $uibModalInstance.dismiss("cancel"); };
    }
}
