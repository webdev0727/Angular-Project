import { Component, Input, ViewChild, Output, EventEmitter, ViewChildren, QueryList, OnInit } from '@angular/core';
import { Question } from '../../../models/question.model';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { Answer } from '../../../models/answer.model';
import { Company } from '../../../models/company.model';
import { Router } from '@angular/router';
import { Client } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';
import { LogService } from '../../../services/log.service';

import {
    HttpEvent, HttpEventType
  } from "@angular/common/http"
import { Form } from '../../../models/form.model';
import { FormMethodService } from '../../../services/form-method.service';
import { NgForm, FormGroup } from '@angular/forms';
import { Vehicle } from '../../../models/vehicle.model';
import { Agent } from '../../../models/agent.model';
import { MatChipInputEvent, MatAutocompleteTrigger } from '@angular/material';
import hexToRgba from 'hex-to-rgba';
import { Driver } from '../../../models/driver.model';
import { Location } from '../../../models/location.model';
import { Incident } from '../../../models/incident.model';
import { RecreationalVehicle } from '../../../models/recreational-vehicle.model';
import { Policy } from '../../../models/policy.model';
import { Home } from '../../../models/home.model';
import { AgentService } from '../../../services/agent.service';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { findOccupations } from '../../../utils/industry.util';

@Component({
    selector: 'app-questions',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent {
    @ViewChildren('groups') formGroups!: QueryList<any>;

    @Input() company: Company;
    @Input() questions: Question[];
    @Input() client: Client;
    @Input() form: Form;
    @Input() isAutoForm: boolean;
    @Input() driverDataSource: any;
    @Input() vehicleDataSource: any;
    @Input() locationDataSource: any;
    @Input() incidentDataSource: any;
    @Input() recreationalVehicleDataSource: any;
    @Input() policyDataSource: any;
    @Input() homeDataSource: any;
    @Input() isMobile: boolean;
    @Input() queryParams: any;
    @Input() loading: any;
    @Input() filteredMakes: string[];
    @Input() filteredModels: string[];
    @Input() filteredBodyStyles: string[];
    @Input() isSimpleForm: boolean;
    @Input() agentsList: any[];
    @Input() occupations: any[];

    @Output() filterVehicles = new EventEmitter<any>();
    @Output() filter = new EventEmitter<any>();
    @Output() getVehicle = new EventEmitter<any>();
    @Output() getVehicleByVIN = new EventEmitter<any>();
    @Output() transitionQuestion = new EventEmitter<any>();
    @Output() onFireNewLead = new EventEmitter<any>();
    @Output() onAutocomplete = new EventEmitter<any>();
    @Output() onLocationSelected = new EventEmitter<any>();
    @Output() onGetRates = new EventEmitter<any>();
    @Output() onAddObject = new EventEmitter<any>();
    @Output() onRemoveObject = new EventEmitter<any>();
    @Output() onSelectObject = new EventEmitter<any>();
    @Output() onGetUSDotData = new EventEmitter<any>();
    @Output() onCalculateAge = new EventEmitter<any>();
    @Output() transitionUploadDocument = new EventEmitter<any>();
    @Output() update = new EventEmitter<any>();
    @Output() onSubmitForm = new EventEmitter<any>();
    @Output() upsertMultiple = new EventEmitter<any>();

    @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;
    @ViewChild('insuranceForm', { static: false }) insuranceForm: NgForm;

    columnsToDisplay = ['name', 'action'];

    disableFileUpload = false;
    uploadFormData: FormData;
    fileUploaded = false;
    httpEvent:HttpEvent<{}>
    filesToUpload;
    lastQuestion = null;
    cardHoverId = null;
    searchValue = '';
    searchOptions = {};
    randomArray = [];
    occupationsRetrieved = false;
    industry = null;
    homeAddress = false;
    clientAddress = false;
    isClientaddress:any = '';
    button = 1;

    public user: any = SocialUser;

    constructor(
        private agentService: AgentService,
        private formMethodService: FormMethodService,
        private logService: LogService,
        private router: Router,
        private clientService: ClientService,
        private authService: AuthService
    ) {
         
    }

    updateInput(value, answer: Answer, question: Question) {
        value = value.target ? value.target.value : value.option ? value.option.value : value;
        this.isClientaddress = value;
        
        if ((value || value === false) && typeof value != 'undefined' && value !== '') {
            if (answer.transformResponse === 'capitalize') {
                value = value.toUpperCase();
            } else if (answer.transformResponse === 'lowercase' ) { 
                value = value.toLowerCase() 
            }
            if (answer.isDatePicker) {
                value = new Date(value.toString());
            }
            if (answer.isAgeInput) { 
                this.onTriggerCalculateAge(value, true); 
            }
            if (answer.isCheckbox) {
                value = this.checkboxValue(this.returnObject(answer)[answer.propertyKey], answer);
            }
            this.returnObject(answer)[answer.propertyKey] = value
            this.returnEvent(answer, value, question); 
            this.onUpdate(answer, value, question);
        }
    }

    groupsAreValid() {
        const isValidArray = this.questions.map(q => {
            return this.groupIsValid(q.id)
        });
        return !isValidArray.includes(false);
    }

    groupIsValid(id: any) {
        const group = this.formGroups.filter((gr, i) => {
            return gr.name === id;
        });
        if (group && group[0]) {
            return group[0].valid
        } else {
            return true;
        }
    }

    onClickAnswer(answer: Answer, question?: Question, index?, group?: FormGroup) {
        const key = answer.propertyKey;
        let value = this.returnBoolean(answer.propertyValue);
        if (answer.isMultipleSelect) {
            if (!this.returnObject(answer)[key]) {
                this.returnObject(answer)[key] = [];
                this.returnObject(answer)[key].push(value);
                value = this.returnObject(answer)[key];
            } else if (this.returnObject(answer)[key].includes(value)) {
                const optIndex = this.returnObject(answer)[key].findIndex(i => i === value);
                this.returnObject(answer)[key].splice(+optIndex, 1);
                value = this.returnObject(answer)[key];
            } else {
                this.returnObject(answer)[key].push(value);
                value = this.returnObject(answer)[key];
            }
        } else {
            this.returnObject(answer)[key] = value;
        }
        if (answer.isConditionParent || answer.isMultipleSelect) {
            this.updateInput(value, answer, question);
        } else if (this.groupIsValid(question.id)) {
            this.updateInput(value, answer, question);
            this.onTransition(answer, 1, false, question, index);
        }
    }

    getStartDate(startDate) {
        if (startDate === 'today') {
            return new Date();
        } else if (startDate) {
            let newDate = new Date(startDate);
            return newDate;
        } else {
            return new Date();
        }
    }

    isRequired(answer: Answer, question: Question) {
        if (question && question.questionConditions && !this.formMethodService.conditionsAreTrue(this.client, this.queryParams, question.questionConditions)) {
            return false;
        } else {
            if (answer && answer.isRequired && (!answer.answerConditions || 
                        this.formMethodService.conditionsAreTrue(this.client, this.queryParams, answer.answerConditions))) {
                return true;
            } else {
                return false;
            }
        }
    }

    isChecked(value: any, answer: Answer) {
        return value && (value === answer.propertyValue);
    }

    checkboxValue(value: any, answer: Answer) {
        if (value && value === answer.propertyValue) {
            return null;
        } else {
            return answer.propertyValue;
        }
    }

    styleBrand() {
        return {'background-color': this.company.brandColor, 'color': 'white'}
    }

    styleProgressButtons() {
        if (this.formMethodService.isMobile || this.formMethodService.browser === 'IE') {
            return { 'margin-top': '-200px'  }
        }
    }

    styleCondition(answer: Answer, question?: Question) {
        if (this.returnButtonConditionIsTrue(answer, question)) {
            return {'background-color': this.company.brandColor, 'color': 'white'}
        }
    }

    returnButtonConditionIsTrue(answer: Answer, question: Question) {
        if (this.returnExists(answer) && this.returnExists(this.returnObject(answer)) && 
            this.returnExists(answer.propertyKey) && this.returnExists(answer.propertyValue) && 
            this.returnExists(this.returnObject(answer)[answer.propertyKey])) {
                let conditionValue = this.returnBoolean(this.returnObject(answer)[answer.propertyKey]);
                let propertyValue = this.returnBoolean(answer.propertyValue);
                if (propertyValue === conditionValue || (answer.isMultipleSelect && conditionValue.includes(propertyValue))) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
    }

    returnBoolean(value) {
        switch(value) {
            case "false":
                return false;
            case "true":
                return true;
            default:
                return value;
        }
    }

    returnEvent(answer: Answer, event?: any, question?: Question) {
        this.onCheckForFilter(event, answer);
        if (answer) {
            if (answer.fireNewLead) {
                this.onTriggerNewLead(question, answer);
            } else if (answer.getRate) {
                this.onTriggerGetRates();
            } else if (answer.getUSDotData) {
                const value = event;
                if (value && value.length > 2) {
                    this.onTriggerGetUSDotData(value);
                }
            }

        }
    }

    onCheckForFilter(value, answer) {
        if (answer.hasFilter === true && this.returnBoolean(value) === this.returnBoolean(value)) {
            this.router.navigate(['/client-app/thank-you'], {queryParams: this.queryParams});
        } else {
        }
    }

    onCheckForVIN(value) {
        if (value && value.length === 17) {
            this.onTriggerGetVehicleByVIN(value);
        }
    }

    onSelectOption(opt: any, answer: Answer, question?: Question) {
        this.returnObject(answer)[answer.propertyKey].push(opt);
    }

    onTransition(answer: Answer, transition: number, progress?: boolean, question?: Question, index?: any,arg?:any) {
        
        try {
            
            if(this.insuranceForm.form.value && arg=='Continue &#8594;'  ){

                if(this.homeAddress==false && localStorage.getItem("homeAddress")=='false'){
                    this.logService.snack('Enter home address', 'Dismiss', {
                        verticalPosition: 'top',
                        panelClass: ['snackbar-warning'],
                        duration: 2000
                    });
                    return false;  
                }
                
                for (var prop in this.insuranceForm.form.value) {
                    var form_id = prop;
                    if(this.insuranceForm.form.value[form_id]['client-hasPreviousAddress']=='Yes'){
                        if(this.clientAddress==false && localStorage.getItem("clientAddress")=='false'){
                            this.logService.snack('Enter current address', 'Dismiss', {
                                verticalPosition: 'top',
                                panelClass: ['snackbar-warning'],
                                duration: 2000
                            });
                            return false;
                        }
                    }

                }


                localStorage.setItem("clientAddress", 'true');
                localStorage.setItem("homeAddress", 'true');

             
            }
            
            const isMobileFlow = (this.isMobile || this.formMethodService.browser === 'IE');
            const isFirstQuestion = (+this.queryParams.question === 0);
            progress = (typeof progress == 'undefined' || (isMobileFlow && isFirstQuestion)) ? false : progress;
            if (isMobileFlow && !this.queryParams.question && !this.isSimpleForm) {
                this.queryParams['question'] = 0;
            }
            if (progress && this.groupsAreValid()) {
                if (location.pathname.includes('driver') && this.client.drivers && this.client.drivers[0] && 
                    this.client.drivers[0].applicantMaritalStatusCd === 'Married' && this.client.drivers.length < 2) {
                        this.logService.snack('You Must Add Your Spouse', 'Dismiss', {
                            verticalPosition: 'top',
                            panelClass: ['snackbar-warning']
                        });
                        return false;                        
                }
                question = this.questions[this.questions.length - 1];
                index = this.questions.length - 1;
            } else if (progress && !this.groupsAreValid()) {
                this.logService.snack('Invalid or Missing Response', 'Dismiss', 2000);
                return false;
            } else if (isMobileFlow && isFirstQuestion && !this.isSimpleForm && this.groupsAreValid()) {
                index = 0;
                question = this.questions[0];
            } else if (isMobileFlow && isFirstQuestion && !this.isSimpleForm && (!this.groupsAreValid() && transition > 0)) {
                this.logService.snack('Invalid or Missing Response', 'Dismiss', 2000);
                return;
            } else if (!progress && (!this.groupIsValid(question.id) && transition > 0)) {
                this.logService.snack('Invalid or Missing Response', 'Dismiss', 2000);
                return false;
            }
            let el = `question-${index}`;
            let element = null;
            if (transition > 0) {
                let els = document.querySelectorAll('.show-div');
                if (els && els[0]) {
                    let elsArray = Array.from(els);
                    let i = elsArray.findIndex(e => (e.id === el));
                    element = (elsArray[+i + 1] && elsArray[+i+1]) ? elsArray[+i+1].id : null;
                }
            }
            let transObj = {answer: answer, index: index, element: element, client: this.client, progress: progress === true ? true : false, page: question.page.title.toLowerCase(), question: question, nextQuestion: null, transition: transition};
            if (this.questions[index+ transition]) {
                transObj.nextQuestion = this.questions[index+transition];
            }
            if (transition !== null) {
                this.transitionQuestion.emit(transObj);
            }
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    resetForm() {
        // if (this.insuranceForm.form.status === 'INVALID') {
        //     return;
        // }
        // this.insuranceForm.resetForm(this.insuranceForm.form.value);
    }

    onTriggerAutocomplete(event, title: string, answer: Answer, question: Question,index) {
        const obj = {data: event, title: title, answer: answer, question: question};

        if(index==0){
            localStorage.setItem("homeAddress", 'false');
            this.homeAddress = true;
        }
        if(index==2){
            localStorage.setItem("clientAddress", 'false');
            this.clientAddress = true;
        }
        this.onAutocomplete.emit(obj);
    }

    onTriggerCalculateAge(event, date?) {
        let value;
        if (date === true) {
            value = event.value._d;
        } else {
            value = event.target.value.replace(/\//g, '-');
        }
        this.onCalculateAge.emit(value);
    }

    onTriggerGetUSDotData(event) {
        this.onGetUSDotData.emit(event);
    }

    onTriggerGetRates() {
        this.onGetRates.emit(true);
    }

    onTriggerNewLead(question: Question, answer: Answer) {
        let eObj = {object: this.returnObject(answer), page: question.page.title.toLowerCase(), question: question};
        this.onFireNewLead.emit(eObj);
    }

    onTriggerLocationSelected(event, answer: Answer) {
        const obj = {data: event, answer: answer};
        this.onLocationSelected.emit(obj);
    }

  
    onTriggerLocationSelectedkeyup(event,index) {

        localStorage.setItem("page1", 'false');

        if(index==0){
            this.homeAddress = false;
            localStorage.setItem("homeAddress", 'false');

        }

        if(index==2){
            this.clientAddress = false;
            localStorage.setItem("clientAddress", 'false');
        }

    }

    onTriggerGetVehicle(event, type) {
        if (event) {
            let eObj = {value: this.returnExists(event.option) ? event.option.value : event, type: type, update: true};
            this.getVehicle.emit(eObj);
        }
    }

    onTriggerFilterVehicles(event, type) {
        let eObj = {value: event, type: type};
        this.filterVehicles.emit(eObj);
    }

    onTriggerFilter(event) {
        this.filter.emit(event);
    }

    onTriggerGetVehicleByVIN(value) {
        this.getVehicleByVIN.emit(value);
    }

    onTriggerAddObject(type: string) {
        this.onAddObject.emit(type);
    }

    onTriggerRemoveObject(index: any, type: string) {
        if (confirm('Are you sure want to delete this?')) {
            this.onRemoveObject.emit({index: index, type: type});
        }
    }

    onTriggerSelectObject(index: any, type: string) {
        this.onSelectObject.emit({index: index, type: type});
    }

    onTriggerSecureDocumentUpload() {
        this.loading = true;
        const interval = setInterval(() => {
            if (this.uploadFormData) {
                this.clientService.uploadDocument(this.client, this.uploadFormData).subscribe(
                (event: HttpEvent<{}>) => {
                    this.httpEvent = event
                    if (event.type === HttpEventType.Response) {
                        this.loading = false;
                        this.fileUploaded = true;
                        this.logService.success('File Uploaded Successfully');
                        delete this.filesToUpload
                      }
                }, error => {
                    this.loading = false;
                });
                clearInterval(interval);
            }
        }, 500);
        setTimeout(() => {
            clearInterval(interval);
        }, 6000)
    }

    onTriggerFilterOccupations(industry: string, answer: Answer) {

        if (industry && answer.isIndustry) {
            this.occupations = findOccupations(industry);
            this.occupationsRetrieved = true;
            this.industry = industry;
        }
    }

    onUpdate(answer: Answer, value: any, question?: Question) {
        if (this.returnExists(answer)) {
            const objectName = answer.objectName;
            const hasConditions = (question && this.hasConditions(answer, question))
            const updateObj = {objectName: objectName, object: this.returnObject(answer), hasConditions: hasConditions, 
                                questionId: answer.questionAnswerId, answer: answer, value: value};
            this.update.emit(updateObj)
        }
    }

    returnDriverName(driver: any) {
        if (driver.applicantGivenName && driver.applicantSurname) {
            return `${driver.applicantGivenName} ${driver.applicantSurname}`;
        } else if (driver.fullName) {
            return ` ${driver.fullName}`;
        } else if (driver.driverLicenseNumber) {
            return driver.driverLicenseNumber
        } else {
            return 'Not Complete'
        }
    }

    returnVehicle(vehicle: Vehicle) {
        if (vehicle.vehicleModelYear && vehicle.vehicleModel) {
            return `${vehicle.vehicleModelYear} ${vehicle.vehicleModel}`;
        } else if (vehicle.vehicleModel) {
            return vehicle.vehicleModel;
        } else if (vehicle.vehicleVin) {
            return vehicle.vehicleVin;
        } else {
            return 'Not Complete'
        }
    }

    returnIsLastAnswer(i, question: Question) {
        return (+i === question.answers.length -1);
    }

    returnIsLastQuestion(i, questions: Question[]) {
        if (this.isMobile || this.formMethodService.browser === 'IE') {
            return ((+i === 0) || +i === questions.length -1);
        } else {
            const el = `question-${i}`;
            const els = document.querySelectorAll('.show-div');
            if (els && els[0]) {
                const elsArray = Array.from(els);
                const index = elsArray.findIndex(e => (e.id === el));
                return (+index === (elsArray.length - 1));
            } else {
                return false;
            }
        }
    }

    isFirstQuestion(i) {
        const el = `question-${i}`;
        const els = document.querySelectorAll('.show-div');
        if (els && els[0]) {
            const elsArray = Array.from(els);
            const index = elsArray.findIndex(e => (e.id === el));
            return (+index === 0);
        } else {
            return false;
        }
    }

    returnLastAnswerIsButton(question: Question) {
        if (question.answers && question.answers.length && question.answers[question.answers.length -1] 
                && question.answers[question.answers.length -1].isButton) {
                return true;
        } else {
            return false;
        }
    }

    returnFirstAnswerIsButton(question: Question) {
        if (question.answers && question.answers[0] && question.answers[0].isButton) {
            return true;
        } else {
            return false;
        }
    }

    returnIsLastNonConditionalAnswer(i, question: Question) {
        return (+i === question.answers.length -1);
    }

    returnIsLastQuestionAndAnswer(questions: Question[], question: Question, i, j) {
        if (!questions[i+1]) {
            if (this.returnIsLastAnswer(j, question)) {
                return true;
            } else {
                return false;
            }
        } else if (((this.questions[i].pageQuestionId !== questions[i+1].pageQuestionId) && 
                    this.returnIsLastAnswer(j, question))) {
            return true;
        } else {
            return false;
        }
    }

    returnLastConditionalAnswerIndex(question: Question) {
        for (let i=question.answers.length; i>=0;i--) {
            let answer = question.answers[i];
            if (!answer.isConditional) {
                return i;
            }
        }
    }

    returnLastAnswerIsConditional(answer, question: Question) {
        if (question.answers && answer.isConditional) {
            return true;
        } else {
            return false;
        }
    }

    returnLastAnswerIsConditionalAndConditionIsTrue(question: Question) {
        let answer;
        if (question && question.answers) {
            answer = question.answers[question.answers.length-1]
        } else {
            return false;
        }
        if (this.returnLastAnswerIsConditional(answer, question) && this.returnConditionIsTrue(answer, question)) {
            return true;
        } else {
            return false;
        }
    }

    returnConditionIsTrue(answer: Answer, question?: Question) {
        if (this.returnExists(answer) && (this.returnExists(this.returnObject(answer)) || this.returnAnswerIsValid(answer)) && 
            this.returnExists(answer.conditionKey &&
                this.returnExists(answer.conditionValue))) {
                    const conditionAnswers: Answer[] = question.answers.filter(fAnswer => fAnswer.propertyKey === answer.conditionKey);
                    let conditionAnswer;
                    if (!conditionAnswers || !conditionAnswers[0]) {
                        return false;
                    } else {
                        conditionAnswer = conditionAnswers[0];
                    }
                    return (this.returnBoolean(this.returnBoolean(this.returnObject(conditionAnswer)[conditionAnswer.propertyKey])) == this.returnBoolean(answer.conditionValue));
                } else {
                    return false;
                }
    }

    returnAnswerIsValid(answer: Answer) {
        return (answer.isSecureDocumentUpload || answer.isText || answer.isLink || answer.isSpacer)
    }

    returnIsValidAnswer(answer: Answer) {
        if (answer.isProgressButton === true || answer.isPrevNextButtons === true 
            || answer.hasCustomHtml === true || answer.isAddDriver === true || 
            answer.isAddVehicle === true || answer.isConditional === true || answer.isAddLocation || 
            answer.isAddHome || answer.isAddIncident || answer.isAddRecreationalVehicle || answer.isAddPolicy) {
                return false;
            } else {
                return true;
            }
    }

    returnExists(value) {
        if ((typeof value != 'undefined' && value && value !== '') || value === false) {
            return true;
        } else {
            return false;
        }
    }

    returnQuestionCondition(index) {
        const paramsExist = (this.queryParams && this.queryParams.companyId) ? true : false;
        const isMobileFlow = (this.isMobile || this.formMethodService.browser === 'IE');
        const isDesktopFlow = (!this.isMobile && this.formMethodService.browser !== 'IE');
        const isCurrentQuestion = (+this.queryParams.question === +index);
        if ((paramsExist && ((isMobileFlow && isCurrentQuestion) || this.isSimpleForm)) || isDesktopFlow) {
            return true;
        } else {
            return false;
        }
    }

    returnPageTitle(answer: Answer, question?: Question) {
        const page = answer.page ? answer.page : question.page; 
        const obj = answer.objectName ? answer.objectName : null;
        if (obj) {
            return obj;
        } else {
            if (page.isDriver) {
                return 'drivers';
            } else if (page.isVehicle) {
                return 'vehicles';
            } else if (page.isHome) {
                return 'homes';
            } else if (page.isBusiness) {
                return 'business';
            } else {
                return 'client'
            }
        }
    }

    returnSelectObject(answer: Answer) {
        if (answer.isSelectObject) {
            const obj = answer.selectObjectName;
            if (obj === 'drivers') {
                return this.client.drivers;
            } else if (obj === 'vehicles') {
                return this.client.vehicles;
            } else if (obj === 'homes') {
                return this.client.homes;
            } if (obj === 'locations') {
                return this.client.locations;
            } else if (obj === 'incidents') {
                return this.client.incidents;
            } else if (obj === 'recreationalVehicles') {
                return this.client.recreationalVehicles;
            } else if (obj === 'policies') {
                return this.client.policies;
            } else if (obj === 'agents') {
                return this.agentsList;
            }
        }
    }

    returnSelectObjectOption(obj: any, answer: Answer, index: any) {
        const selectName = answer.selectObjectName;
        if (selectName === 'drivers') {
            return this.returnDriverName(obj);
        } else if (selectName === 'vehicles') {
            return this.returnVehicle(obj);
        } else if (selectName === 'agents') {
            return this.returnAgent(obj, index);
        }
    }

    returnAgent(agent: Agent, index: any) {
        if (agent.firstName && agent.lastName) {
            return `${agent.firstName} ${agent.lastName}`;
        } else if (agent.firstName) {
            return `${agent.firstName}`;
        } else if (agent.lastName) {
            return `${agent.lastName}`;
        } else {
            return `Agent ${index}`;
        }
    }

    returnAddressProperty(answer: Answer, key: string) {
        const pageTitle = this.returnPageTitle(answer, answer.question);
        if (key === 'streetNumber') {
            if (pageTitle === 'vehicles') {
                return 'applicantAddrStreetNumber';
            } else {
                return 'streetNumber';
            }
        } else if (key === 'streetName') {
            if (pageTitle === 'vehicles') {
                return 'applicantAddrStreetName';
            } else {
                return 'streetName';
            }
        } else if (key === 'city') {
            if (pageTitle === 'vehicles') {
                return 'applicantAddrCity';
            } else {
                return 'city';
            } 
        } else if (key === 'state') {
            if (pageTitle === 'vehicles') {
                return 'applicantStateCd';
            } else if (pageTitle === 'client') {
                return 'stateCd';
            } else {
                return 'state';
            }
        } else if (key === 'zipCode') {
            if (pageTitle === 'vehicles') {
                return 'applicantPostalCd';
            } else if (pageTitle === 'client') {
                return 'postalCd';
            } else {
                return 'zipCode';
            }
        } else {
            if (pageTitle === 'vehicles') {
                return this.client.vehicles[this.queryParams.vehicles][key];
            } else {
                return key;
            }
        }
        
    }

    returnObject(answer?: Answer) {

        try {
            if (answer && answer.objectName) {
                const obj = answer.objectName;
                if (obj === 'client') {
                    return this.client;
                } else if (obj === 'drivers') {
                    if (!this.client.drivers || this.client.drivers.length === 0) {
                        const newDriver = new Driver();
                        newDriver.companyDriverId = this.company.id;
                        newDriver.clientDriverId = this.client.id ? +this.client.id : null;
                        this.client.drivers = [newDriver];
                        this.queryParams.drivers = 0;
                    }
                    if (!this.queryParams.drivers) {
                        this.queryParams.drivers = 0;
                    }
                    return this.client.drivers[this.queryParams.drivers]
                } else if (obj === 'vehicles') {
                    if (!this.client.vehicles || this.client.vehicles.length === 0) {
                        const newVehicle = new Vehicle();
                        newVehicle.companyVehicleId = this.company.id;
                        newVehicle.clientVehicleId = this.client.id ? +this.client.id : null;
                        this.client.vehicles = [newVehicle];
                        this.queryParams.vehicles = 0;
                    }
                    if (!this.queryParams.vehicles) {
                        this.queryParams.vehicles = 0;
                    }
                    return this.client.vehicles[this.queryParams.vehicles]
                } else if (obj === 'homes') {
                    if (!this.client.homes || this.client.homes.length === 0) {
                        const newHome = new Home();
                        newHome.companyHomeId = this.company.id;
                        newHome.clientHomeId = this.client.id ? +this.client.id : null;
                        this.client.homes = [newHome];
                    }
                    if (!this.queryParams.homes) {
                        this.queryParams['homes'] = 0;
                    }
                    return this.client.homes[this.queryParams.homes];
                } else if (obj === 'business') {
                    if (!this.client.business) {
                        this.client.business = {companyBusinessId: this.company.id, clientBusinessId: this.client.id ? +this.client.id : null};
                    }
                    return this.client.business;
                } else if (obj === 'locations') {
                    if (!this.client.locations || this.client.locations.length === 0) {
                        const newLocation = new Location();
                        newLocation.companyLocationId = this.company.id;
                        newLocation.clientLocationId = this.client.id ? +this.client.id : null;
                        this.client.locations = [newLocation];
                    }
                    if (!this.queryParams.locations) {
                        this.queryParams['locations'] = 0;
                    }
                    return this.client.locations[this.queryParams.locations];
                } else if (obj === 'incidents') {
                    if (!this.client.incidents || this.client.incidents.length === 0) {
                        const newIncident = new Incident();
                        newIncident.clientIncidentId = this.client.id ? +this.client.id : null;
                        this.client.incidents = [newIncident];
                    }
                    if (!this.queryParams.incidents) {
                        this.queryParams['incidents'] = 0;
                    }
                    return this.client.incidents[this.queryParams.incidents];
                } else if (obj === 'recreationalVehicles') {
                    if (!this.client.recreationalVehicles || this.client.recreationalVehicles.length === 0) {
                        const newRecVehicle = new RecreationalVehicle();
                        newRecVehicle.clientRecreationalVehicleId = this.client.id ? +this.client.id : null;
                        this.client.recreationalVehicles = [newRecVehicle];
                    }
                    if (!this.queryParams.recreationalVehicles) {
                        this.queryParams['recreationalVehicles'] = 0;
                    }
                    return this.client.recreationalVehicles[this.queryParams.recreationalVehicles];
                } else if (obj === 'policies') {
                    if (!this.client.policies || this.client.policies.length === 0) {
                        const newPolicy = new Policy();
                        newPolicy.clientPolicyId = this.client.id ? +this.client.id : null;
                        this.client.policies = [newPolicy];
                    }
                    if (!this.queryParams.policies) {
                        this.queryParams['policies'] = 0;
                    }
                    return this.client.policies[this.queryParams.policies];
                }
            } else {
                return this.client;
            }
        } catch (error) {
            this.logService.console(error ,false);
        }
    }

    filterOptions(answer: Answer, value: string): string[] {
        const filterValue = value.toLowerCase();
        this.searchOptions[this.returnId(answer)] = answer.options.filter(option => option.toLowerCase().includes(filterValue));
        return this.searchOptions[this.returnId(answer)];
    }

    returnOptionsArray(values: any[]) {
        if (values && values.length && values.length > 0) {
            return values;
        } else {
            return [];
        }
    }

    returnOptionsMap(values: any[]) {
        return values.map(val => { 
            
            return { option: val }
        });
    }

    returnOption(type: string, option: any) {

        if (typeof option !== 'string') {
            return option[type];
        } else {
            return option;
        } 
    }

    isSelected(array: any[], value: any) {
        if (array && array.length && array.length > 0 && array.includes(value)) {
            return 'checked';
        } else {
            return 'unchecked';
        }
    }

    isSelectedBoolean(array: any[], value: any) {
        if (array && array.length && array.length > 0 && array.includes(value)) {
            return true;
        } else {
            return false;
        }
    }

    addAutocompleteOption(answer: Answer, event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
    
        if ((value || '').trim()) {
          this.addAutocompleteOptions(this.returnObject(answer)[answer.propertyKey], value);
       }
    
        if (input) {
          input.value = '';
        }
      }
    
      removeAutocompleteOption(answer: Answer, value: any): void {
        if (typeof this.returnObject(answer)[answer.propertyKey] == 'object' && this.returnObject(answer)[answer.propertyKey] && this.returnObject(answer)[answer.propertyKey].length && this.returnObject(answer)[answer.propertyKey].length > 0) {
            const index = this.returnObject(answer)[answer.propertyKey].indexOf(value);
            if (index >= 0) {
              this.returnObject(answer)[answer.propertyKey].splice(index, 1);
            }
        }
      }
    
      onAutocompleteSelectionChange(answer: Answer, autoInput): void {
        this.updateAutocompleteList(answer, autoInput);
      }

      autocompleteSelectionMade(trigger: MatAutocompleteTrigger) {
        setTimeout(() => {
            trigger.openPanel();
        }, 0)
      }
    
      addAutocompleteOptions(answer: Answer, value: any): void {
          if (this.returnObject(answer)[answer.propertyKey] && typeof this.returnObject(answer)[answer.propertyKey] == 'object' && this.returnObject(answer)[answer.propertyKey].length && this.returnObject(answer)[answer.propertyKey].length > 0) {
              this.returnObject(answer)[answer.propertyKey].push(value);
          } else {
              this.returnObject(answer)[answer.propertyKey] = [value];
          }
      }
    
      updateAutocompleteList(answer: Answer, autoInput): void {
        if (this.isSelectedBoolean(this.returnObject(answer)[answer.propertyKey], this.searchOptions[this.returnId(answer, 'mat-auto-input-')])) {
            this.removeAutocompleteOption(answer, this.searchOptions[this.returnId(answer, 'mat-auto-input-')]);
        } else {
          this.addAutocompleteOptions(answer, this.searchOptions[this.returnId(answer, 'mat-auto-input-')]);
        }
        this.clearAutocomplete(answer, autoInput);
      }

    clearAutocomplete(answer: Answer, autoInput: any) {
        this.filterOptions(answer, '');
        this.searchOptions[this.returnId(answer, 'mat-auto-input-')] = '';
        if (autoInput && autoInput.value) {
            autoInput.value = '';
        }
    }

    returnProgressConditionMobile() {
        const isMobileFlow = (this.isMobile || this.formMethodService.browser === 'IE');
        const isDesktopFlow = (!this.isMobile && this.formMethodService.browser !== 'IE');
        const isLastQuestion = (+this.queryParams.question === (this.questions.length - 1));
        const isFirstQuestion = (+this.queryParams.question === 0);
        if ((isMobileFlow && (isLastQuestion || isFirstQuestion)) || this.isSimpleForm) {
            return true;
        } else if (isDesktopFlow) {
            return true;
        } else {
            return false;
        }
    }

    returnProgressButtonText() {
        const isMobileFlow = (this.isMobile || this.formMethodService.browser === 'IE');
        const isFirstQuestion = (+this.queryParams.question === 0);     
        if (isMobileFlow && isFirstQuestion && this.questions && this.questions[0]) {
            return this.questions[0].page.progressButtonText;
        } else if (isMobileFlow && (+this.queryParams.question > 0) && this.questions && this.questions[this.questions.length - 1]) {
            return this.questions[this.questions.length - 1].page.progressButtonText;
        } else if (this.questions && this.questions.length > 0 && this.questions[this.questions.length - 1]) {
            return this.questions[this.questions.length - 1].page.progressButtonText;
        } else {
            return `Continue &#8594;`
        }
    }


    returnId(answer: Answer, prefix?: string) {
        if (answer && answer.objectName && answer.propertyKey) {
            return `${prefix ? prefix : ''}${answer.objectName}-${answer.propertyKey}`;
        }
    }

    autocompletecheck(data){
        console.log(data);
    }

    arrayExists(array) {
        return (array && array.length && array.length > 0)
    }

    hasConditions(answer: Answer, question?: Question) {
        return ((answer ? this.arrayExists(answer.answerConditions) : false) || (question && this.arrayExists(question.questionConditions)) || 
                (question.page && this.arrayExists(question.page.conditions)));
    }

    returnConditionsAreTrue(question: Question, answer?: Answer) {
        return ((answer ? this.formMethodService.conditionsAreTrue(this.client, this.queryParams, answer.answerConditions) : true) && 
                this.formMethodService.conditionsAreTrue(this.client, this.queryParams, question.questionConditions) && 
                this.formMethodService.conditionsAreTrue(this.client, this.queryParams, question.page.conditions))
    }

    styleTypes(answer: Answer, question: Question) {
        if (answer.isHiddenInput) {
            return { display: 'none' };
        } else if (answer.isConditional) {
            if (!this.returnConditionIsTrue(answer, question)) {
                return { display: 'none' }
            } else {
                return { display: 'block', flex: `0 1 ${answer.width}%` }
            }
        } else if (this.hasConditions(answer, question)) {
            if (this.returnConditionsAreTrue(question, answer)) {
                if (!answer.isButton) {
                    return { display: 'block', flex: `0 1 ${answer.width}%` }
                }
            } else {
                return { display: 'none' };
            }
        } else if (!answer.isButton) {
            return { flex: `0 1 ${answer.width}%` };
        } 
    }

    answerIsEnabled(answer: Answer, question: Question) {
        if (answer.answerConditions && answer.answerConditions.length && 
            answer.answerConditions.length > 0) {
                if (this.formMethodService.conditionsAreTrue(this.client, this.queryParams, answer.answerConditions)) {
                    return true;
                } else {
                    return false;;
                }
        }
        if (answer.isConditional && !this.returnConditionIsTrue(answer, question)) {
            return false;
        } else if (answer.isConditional && this.returnConditionIsTrue(answer, question)) {
            return true;
        } else if (answer.isHiddenInput) {
            return false;;
        } else if (this.hasConditions(answer, question)) {
            if (this.returnConditionsAreTrue(question, answer)) {
                return true;
            } else {
                return false;;
            }
        } else if (!answer.isButton) {
            return true;
        } 
    }

    styleConditionalQuestions(question: Question) {
        if (!this.formMethodService.conditionsAreTrue(this.client, this.queryParams, question.questionConditions)) {
            return 'hide-div';
        } else {
            return `${this.isSimpleForm ? '' : question.image ? 'question ' : ''}show-div`;
        }
    }

    styleCard(answer: Answer, question: Question) {
        if (answer.id === this.cardHoverId || this.returnButtonConditionIsTrue(answer, question)) {
            return { 'border-color': this.company.brandColor, background: this.returnHexColor() }
        }
    }

    returnHexColor() {
        if (this.company.brandColor && typeof hexToRgba != 'undefined') {
            return hexToRgba(this.company.brandColor, '.25') || 'rgba(169,169,169,.2)';
        } else {
            return 'rgba(169,169,169,.3)';
        }
    }

    classTypes(answer: Answer) {
        if (!answer.isButton) {
            return ('dynamic-input-container' + (answer.isCheckbox ? ' dynamic-checkbox' : ''));
        } else if (answer.isHiddenInput) {
            return '';
        } else {
            return 'dynamic-button'
        }
    }

    formClass() {
        if (!this.isSimpleForm) {
            return 'question-comp-container'
        } else {
            return 'simple-form-container';
        }
    }

    styleActiveRow(i, type: string) {
        if (this.queryParams && (this.queryParams[type] || this.queryParams[type] >= 0)) {
            if (+i === +this.queryParams[type]) {
                return {'background': 'rgba(204,204,204,.4)'};
            }
        }
    }

    isLastQuestion(index: any) {
        let el = `question-${index}`;
        let els = document.querySelectorAll('.show-div');
        if (els && els[0]) {
            let elsArray = Array.from(els);
            let i = elsArray.findIndex(e => (e.id === el));
            return (+i === (elsArray.length -1));
        } else {
            return false;
        }
    }

    submitForm() {
        this.onSubmitForm.emit();
    }

    styleAnswers(index: any) {
        if (this.isSimpleForm) {
            return { margin: 'auto' };
        }
        if (this.isLastQuestion(index) || this.isMobile || this.formMethodService.browser === 'IE') {
            return {'margin-bottom': '0'};
        }
    }

    styleQuestion() {
        if (this.isSimpleForm) {
            return { 'min-height': '0', padding: '0 .6125rem', margin: 'auto' };
        }
    }

    styleSelect() {
        if (this.isSimpleForm && this.isMobile) {
            return {'padding-top': '.87rem'}
        }
    }

    styleText() {
        if (this.isSimpleForm) {
            return {'text-align': 'left'}
        }
    }

    styleProgressBtn() {
        if (this.isSimpleForm) {
            return { 'margin-top': '2rem', 'margin-bottom': '2rem' };
        } else if (this.formMethodService.isMobile || this.formMethodService.browser === 'IE') {
            return {'margin-top': '-1rem', 'margin-bottom': '3rem'}
        }
    }

    styleContinueBtns() {
        if (!this.isSimpleForm && (this.formMethodService.isMobile || this.formMethodService.browser === 'IE')) {
            return {'margin-bottom': '3rem'}
        }
    }

    hasZillowLink(answer: Answer) {
        if (answer && answer.objectName === 'homes' && this.client && this.client.homes && 
            this.client.homes[this.queryParams.homes] && this.client.homes[this.queryParams.homes].zillowLink) {
            return true;
        } else {
            return false;
        }
    }

    openZillow() {
        if (this.client && this.client.homes && this.client.homes[this.queryParams.homes] && this.client.homes[this.queryParams.homes].zillowLink) {
            window.open(this.client.homes[this.queryParams.homes].zillowLink, '_blank');
        } else {
            this.logService.warn('There was an issue with this Zillow link');
        }
    }

    // For Social Login
    getKeyName(data: any) {
        let keyname = '';
        if (data && data.placeholderText) {
            keyname = data.placeholderText.replace(/\s/g, "").toLowerCase(); 
        }
        return keyname;
    }

    updateValue(answer: Answer, question: Question, index: any) {
        this.logService.success("Logged in successfully!");
        const unauthorizedKeys = ['id', 'authToken'];
        for (let key in this.user) {
            if (this.client.hasOwnProperty(key) && !unauthorizedKeys.includes(key)) {
                this.client[key] = this.user[key];
            }
        }
        setTimeout(() => {
            const updateObj = [{objModel: 'Client', object: this.client}];
            this.upsertMultiple.emit(updateObj);
            this.signOut();
            if (!answer.stopTransition) {
                const progress = this.questions[+index+1] ? false : true;
                this.onTransition(answer, 1, progress, question, index);
            }
        }, 500);
    }

    signInWithGoogle(answer: Answer, question: Question, index: any): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
            this.user = userData;
            this.updateValue(answer, question, index);
        }).catch((error) => {
            this.logService.console(error);
        });
    }
    signInWithFB(answer: Answer, question: Question, index: any): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) => {
            this.user = userData;
            this.updateValue(answer, question, index);
        }).catch((error) => {
            this.logService.console(error);
        });
    }
    signOut(): void {
        this.authService.signOut().then(() => {
            this.user = '';
        });
    }

    returnOptions(answer: Answer) {
        if (answer.isOccupation && this.occupations) {
            return this.occupations;
        } else if (answer.hasLabeledSelectOptions) {
            return answer.labeledSelectOptions;
        } else {
            return answer.options;
        }
    }

}
