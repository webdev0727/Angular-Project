import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { Forms } from "./forms.component";
import { FormsRoutingModule } from "./forms-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { CustomFormsModule } from 'ngx-custom-validators'



@NgModule({
    declarations: [
        Forms
    ],
    imports: [
        CommonModule,
        FormsModule,
        CustomFormsModule,
        FormsRoutingModule,
        SharedModule,
    ]
})
export class XiloFormsModule {}
