import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { FormsSummaryComponent } from "./results.component";

const v2DynamicFormsSummaryRoutes: Routes = [
    { path: '', component: FormsSummaryComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(v2DynamicFormsSummaryRoutes)
    ],
    exports: [RouterModule]
})
export class FormsSummaryRoutingModule {}
