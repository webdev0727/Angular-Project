import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { FormsThankYouComponent } from "./thank-you.component";

const v2DynamicFormsThankYouRoutes: Routes = [
    { path: '', component: FormsThankYouComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(v2DynamicFormsThankYouRoutes)
    ],
    exports: [RouterModule]
})
export class FormsThankYouRoutingModule {}
