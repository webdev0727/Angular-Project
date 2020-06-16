import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {CoreRoutingModule} from "./core-routing.module";
import {CoreComponent} from "./core.component";
import {ScrollToModule} from "@nicky-lenaers/ngx-scroll-to";
import {NgxLoadingModule} from "ngx-loading";
import {Ng4GeoautocompleteModule} from "ng4-geoautocomplete";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        CoreComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CoreRoutingModule,
        NgxLoadingModule.forRoot({}),
        ScrollToModule.forRoot(),
        Ng4GeoautocompleteModule.forRoot(),
        SharedModule
    ]
})
export class CoreModule {}
