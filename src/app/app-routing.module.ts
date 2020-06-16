import {NgModule} from "@angular/core";
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {UnknownComponent} from "./unknown.component";

const appRoutes: Routes = [
    { path: '', redirectTo: 'client-app', pathMatch: 'full'},
    { path: 'client-app', loadChildren: () => import('./core/core.module').then(m => m.CoreModule)},
    { path: 'unknown', component: UnknownComponent, pathMatch: 'full'},
    { path: '**', redirectTo: 'unknown'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, 
        {
            preloadingStrategy: PreloadAllModules, 
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'top',
            onSameUrlNavigation: 'reload'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
