import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from "ngx-pagination";
import {FilterPipeModule} from "ngx-filter-pipe";
import {ngfModule} from "angular-file";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule, MatProgressSpinnerModule, MatDialogModule} from "@angular/material";
import {MatPaginatorModule} from "@angular/material";
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {DragDropModule} from '@angular/cdk/drag-drop';
// import {MomentDateAdapter} from '@angular/material-moment-adapter';

import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_FORMATS
  } from '@angular/material-moment-adapter';
import {MatChipsModule} from '@angular/material/chips';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";
import { AgmCoreModule } from '@agm/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AlertModule } from 'ngx-alerts';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import { SafePipe } from './pipes/safe.pipe';
import { QuestionComponent } from '../core/form-components/questions/question.component';
import {MatListModule} from '@angular/material/list';
import { AgePipe } from './pipes/age.pipe';
import { DiscountComponent } from '../core/form-components/discounts/discounts.component';
import { RaterComponent } from '../core/form-components/raters/raters.component';
import { VendorRaterComponent } from '../core/form-components/raters/vendor/raters.component';
import { NavbarComponent } from '../core/form-components/navbar/navbar.component';
import { ThankYouComponent } from '../core/form-components/thank-you/thank-you.component';
import { ResultsComponent } from '../core/form-components/results/results.component';
import { ProgressBarComponent } from '../core/form-components/progress-bar/progress-bar.component';
import { MultiVendorRaterComponent } from '../core/form-components/raters/vendor/multi-vendor/raters.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
    declarations: [
        SafePipe,
        QuestionComponent,
        DiscountComponent,
        RaterComponent,
        VendorRaterComponent,
        MultiVendorRaterComponent,
        AgePipe,
        NavbarComponent,
        ThankYouComponent,
        ResultsComponent,
        ProgressBarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FilterPipeModule,
        NgxLoadingModule.forRoot({}),
        ngfModule,
        NgxPaginationModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatTableModule,
        MatPaginatorModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatCardModule,
        MatDialogModule,
        MatTooltipModule,
        MatBottomSheetModule,
        MatChipsModule,
        Ng4GeoautocompleteModule,
        MatGoogleMapsAutocompleteModule,
        MatProgressSpinnerModule,
        AgmCoreModule,
        NgSelectModule,
        MatCheckboxModule,
        AlertModule,
        DragDropModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatListModule,
        MatSnackBarModule
    ],
    providers: [
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ],
    exports: [
        CommonModule,
        FilterPipeModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatTableModule,
        MatPaginatorModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatCardModule,
        MatChipsModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatBottomSheetModule,
        NgSelectModule,
        Ng4GeoautocompleteModule,
        MatCheckboxModule,
        AgmCoreModule,
        MatGoogleMapsAutocompleteModule,
        DragDropModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSnackBarModule,
        SafePipe,
        QuestionComponent,
        DiscountComponent,
        RaterComponent,
        VendorRaterComponent,
        MultiVendorRaterComponent,
        MatListModule,
        AgePipe,
        NgxLoadingModule,
        NavbarComponent,
        ThankYouComponent,
        ResultsComponent,
        ProgressBarComponent,
    ]
})
export class SharedModule {}
