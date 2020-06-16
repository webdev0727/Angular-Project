import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { FormsDiscountsComponent } from "./discounts.component";

const v2DynamicFormsDiscountsRoutes: Routes = [
    { path: '', component: FormsDiscountsComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(v2DynamicFormsDiscountsRoutes)
    ],
    exports: [RouterModule]
})
export class FormsDiscountsRoutingModule {}
