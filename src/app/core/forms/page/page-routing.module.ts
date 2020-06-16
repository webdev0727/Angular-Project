import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { FormsPageComponent } from "./page.component"

const v2DynamicFormsDriversRoutes: Routes = [
    { path: '', component: FormsPageComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(v2DynamicFormsDriversRoutes)
    ],
    exports: [RouterModule]
})
export class FormsPageRoutingModule {}
