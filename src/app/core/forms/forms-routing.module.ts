import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { Forms } from "./forms.component";

const dynamicFormsRoutes: Routes = [
    { path: '', component: Forms, children: [
        { path: '', redirectTo: 'page/start', pathMatch: 'full'},
        { path: 'form', redirectTo: 'page/start', pathMatch: 'full'},
        { path: 'start', redirectTo: 'page/start', pathMatch: 'full'},
        { path: 'mobile', redirectTo: 'page/start', pathMatch: 'full'},
        { path: 'page/:page', loadChildren: () => import('./page/page.module').then(m => m.FormsPageModule)},
        { path: 'discounts', loadChildren: () => import('./discounts/discounts.module').then(m => m.FormsDiscountsModule)},
        { path: 'results', loadChildren: () => import('./results/results.module').then(m => m.FormsSummaryModule)},
        { path: 'thank-you', loadChildren: () => import('./thank-you/thank-you.module').then(m => m.FormsThankYouModule)},
    ]},
];

@NgModule({
    imports: [
        RouterModule.forChild(dynamicFormsRoutes)
    ],
    exports: [RouterModule]
})
export class FormsRoutingModule {}
