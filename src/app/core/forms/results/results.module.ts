import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { FormsSummaryRoutingModule } from "./results-routing.module";
import { FormsSummaryComponent } from "./results.component";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    declarations: [
        FormsSummaryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FormsSummaryRoutingModule,
        SharedModule
    ]
})
export class FormsSummaryModule {}
