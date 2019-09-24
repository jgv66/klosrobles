import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
var ItemComponent = /** @class */ (function () {
    function ItemComponent() {
        this.informacion = [];
    }
    ItemComponent.prototype.ngOnInit = function () { };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ItemComponent.prototype, "informacion", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ItemComponent.prototype, "concepto", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ItemComponent.prototype, "fila", void 0);
    ItemComponent = tslib_1.__decorate([
        Component({
            selector: 'app-item',
            templateUrl: './item.component.html',
            styleUrls: ['./item.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], ItemComponent);
    return ItemComponent;
}());
export { ItemComponent };
//# sourceMappingURL=item.component.js.map