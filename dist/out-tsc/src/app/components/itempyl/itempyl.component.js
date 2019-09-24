import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
var ItempylComponent = /** @class */ (function () {
    function ItempylComponent() {
        this.informacion = [];
    }
    ItempylComponent.prototype.ngOnInit = function () { };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ItempylComponent.prototype, "informacion", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ItempylComponent.prototype, "concepto", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ItempylComponent.prototype, "fila", void 0);
    ItempylComponent = tslib_1.__decorate([
        Component({
            selector: 'app-itempyl',
            templateUrl: './itempyl.component.html',
            styleUrls: ['./itempyl.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], ItempylComponent);
    return ItempylComponent;
}());
export { ItempylComponent };
//# sourceMappingURL=itempyl.component.js.map