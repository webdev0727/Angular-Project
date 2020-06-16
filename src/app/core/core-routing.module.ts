import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CoreComponent} from "./core.component";

const coreAppRoutes: Routes = [
    { path: '', pathMatch: 'full', component: CoreComponent },
    { path: 'mobile', redirectTo: 'form'},
    { path: 'simple', loadChildren: () => import('./forms/forms.module').then(m => m.XiloFormsModule)},
    { path: 'form', loadChildren: () => import('./forms/forms.module').then(m => m.XiloFormsModule)},
    { path: 'auto', loadChildren: () => import('./forms/forms.module').then(m => m.XiloFormsModule)},
    { path: 'home', loadChildren: () => import('./forms/forms.module').then(m => m.XiloFormsModule)},
    { path: 'auto-home', loadChildren: () => import('./forms/forms.module').then(m => m.XiloFormsModule)},
 ];

@NgModule({
    imports: [
        RouterModule.forChild(coreAppRoutes)
    ],
    exports: [RouterModule]
})
export class CoreRoutingModule {}
