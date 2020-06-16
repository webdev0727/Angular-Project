import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { FormsPageRoutingModule } from "./page-routing.module";
import { FormsPageComponent } from "./page.component";
import { SharedModule } from "../../../shared/shared.module";


@NgModule({
    declarations: [
        FormsPageComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        FormsPageRoutingModule,
        SharedModule
    ]
})
export class FormsPageModule {}
