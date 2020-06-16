import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { FormsThankYouRoutingModule } from "./thank-you-routing.module";
import { FormsThankYouComponent } from "./thank-you.component";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    declarations: [
        FormsThankYouComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FormsThankYouRoutingModule,
        SharedModule
    ]
})
export class FormsThankYouModule {}
