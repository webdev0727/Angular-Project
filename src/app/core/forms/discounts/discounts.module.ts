import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { FormsDiscountsRoutingModule } from "./discounts-routing.module";
import { FormsDiscountsComponent } from "./discounts.component";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    declarations: [
        FormsDiscountsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FormsDiscountsRoutingModule,
        SharedModule
    ]
})
export class FormsDiscountsModule {}
