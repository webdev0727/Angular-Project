import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MomentModule} from "angular2-moment";
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { FormMethodService } from './services/form-method.service';
import { UnknownComponent } from './unknown.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { AlertModule } from 'ngx-alerts';
import { AgentService } from './services/agent.service';
import { AlertControllerService } from './services/alert.service';
import { CompanyService } from './services/company.service';
import { ClientService } from './services/client.service';
import { DriverService } from './services/driver.services';
import { EmailService } from './services/contact-email.service';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
import { LifecycleAnalyticService } from './services/lifecycle-analytic.service';
import { LifecycleService } from './services/lifecycle.service';
import { ScrollService } from './services/scroll.service';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { UserService } from './services/user.service';
import { VehicleService } from './services/vehicle.service';
import { VehicleApiService } from './services/vehicle-api.service';
import { ApiService } from './services/api.service';
import { VinApiService } from './services/vin-api.service';
import { HomeService } from './services/home.services';
import { LandingPageService } from './services/landing-page.service';
import { CTAService } from './services/ctas.services';
import { MediumService } from './services/medium.service';
import { CronService } from './services/cron.service';
import { LogService } from './services/log.service';
import { AnalyticsService } from './services/analytics-service';
import { PageService } from './services/page.service';
import { FormService } from './services/form.service';
import { AnswerService } from './services/answer.service';
import { QuestionService } from './services/question.service';
import { DiscountService } from './services/discount.service';
import { CoverageService } from './services/coverage.service';
import { RateService } from './services/rate.service';
import { RaterService } from './services/rater.service';
import { ParameterService } from './services/parameter.service';
import { AgePipe } from './shared/pipes/age.pipe';
import { HubspotService } from './services/hubspot.service';
import { DynamicRateService } from './services/dynamic-rate.service';
import { DynamicCoverageService } from './services/dynamic-coverage.service';
import { VehicleListService } from './services/vehicle-list.service';
import { UsDotIntegrationService } from './services/us-dot-integration.service';
import { IntegrationService } from './services/integration.service';
import { VendorService } from './services/vendor.service';
import { CityDistanceService } from './services/city.service';
import { BusinessService } from './services/business.service';
import { LifecycleEmailService } from './services/lifecycle-email.service';
import { InfusionsoftService } from './services/infusionsoft.service';
import { PipedriveService } from './services/pipedrive.service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { HttpConfigInterceptor} from './httpconfig.interceptor';
import { LocationService } from './services/location.service';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { IncidentService } from './services/incident.service';
import { RecreationalVehicleService } from './services/recreational-vehicle.service';
import { MatSnackBarModule } from '@angular/material';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { PdfService } from './services/pdf.service';
import { EZLynxService } from './services/ezlynx.service';


const fbLoginOptions = {
  scope: 'email,user_age_range,user_birthday,user_gender,user_location',
  return_scopes: true,
  enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
 
const googleLoginOptions = {
  scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("713216428726-0crgu1k6td5ra77sc71bcr468ut0qohq.apps.googleusercontent.com", googleLoginOptions)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("488123071615043", fbLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}

export class MyErrorHandler implements ErrorHandler {

  handleError(error) {
    let isProduction = (environment.production === true);
    let maxLength = 150;
    let errStr = error.toString();
    let str = errStr.length > maxLength ? errStr.substr(0, maxLength) + '...' : errStr;
    if (isProduction === true) {
      console.log(str);
    } else {
      console.log('Error: %o', error);
    }
  }
}

@NgModule({
  declarations: [
      AppComponent,
      UnknownComponent
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      NgxLoadingModule.forRoot({}),
      FormsModule,
      CustomFormsModule,
      BrowserAnimationsModule,
      MatGoogleMapsAutocompleteModule.forRoot(),
      AgmCoreModule.forRoot({
        apiKey: environment.GOOGLE_MAPS_API_KEY,
        libraries: ['places', 'visualization'],
        language: 'en-US'
      }),
      MomentModule,
      AlertModule.forRoot({maxMessages: 5, timeout: 5000, position: 'right'}),
      DeviceDetectorModule.forRoot(),
      MatSnackBarModule,
      SocialLoginModule
      // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {provide: ErrorHandler, useClass: MyErrorHandler},
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    FormMethodService,
    AgentService,
    AlertControllerService,
    CompanyService,
    ClientService,
    DriverService,
    EmailService,
    BusinessService,
    GoogleAnalyticsEventsService,
    LifecycleAnalyticService,
    LifecycleService,
    ScrollService,
    ScrollToService,
    UserService,
    VehicleService,
    VehicleApiService,
    ApiService,
    VinApiService,
    HomeService,
    LandingPageService,
    CTAService,
    MediumService,
    CronService,
    LogService,
    AnalyticsService,
    PageService,
    FormService,
    AnswerService,
    QuestionService,
    DiscountService,
    CoverageService,
    RateService,
    RaterService,
    ParameterService,
    AgePipe,
    HubspotService,
    DynamicRateService,
    DynamicCoverageService,
    VehicleListService,
    UsDotIntegrationService,
    IntegrationService,
    VendorService,
    CityDistanceService,
    LifecycleEmailService,
    InfusionsoftService,
    PipedriveService,
    LocationService,
    IncidentService,
    RecreationalVehicleService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    PdfService,
    EZLynxService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
