import { Component, ViewChild, AfterViewChecked } from "@angular/core";
import { StateMachineService } from "../core/services/state-machine.service";
import { SegmentDynamicLoaderService } from "./services/segment-dynamic-loader.service";
import { Form, Section, SectionHeader, Messages } from "../core/models/form";
import * as Constants from "./constants/constants";
import { NgForm, AbstractControl } from "@angular/forms";
import { I18nService } from "../core/services/i18n.service";
import { ResetPropagationService } from "../core/services/reset-propagation.service";
import * as Handlebars from "handlebars";
import printTemplate from "../app/templates/print";
import printTemplateRtl from "../app/templates/print_rtl";
import * as moment from "moment";
import loadFormHooks from "./hooks/load-form";
import { ProfileRequestorService } from "./services/profile-requestor.service";

declare var $j: any;
@Component({
  selector: "app-wm-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewChecked {
  @ViewChild("f") public formStateObject: NgForm;
  @ViewChild("template") public printFormTemplate;
  private printFormHTML;
  title = "app";
  requestSection: any;
  isReady = false;
  isValidLoad = false;
  isSuccessfullySubmitted = false;
  state = "closed";
  visibility = "void";
  hidden = "hidden";
  visible = "visible";
  showProfileFormContent: boolean;
  showCommentFormContent: boolean;
  form: Form;
  sections: Section[];
  sectionsController: { [key: string]: AbstractControl };
  numberOfComments = 0;
  startedListener = false;
  submitResponse: any;
  creationDate: string;
  isSubmitting = {
    hrSubmit: false,
  };
  profileData = {
    name,
  };
  SectionDetails: any;
  hrRequestIsSubmitted: boolean = false;
  isPrintResponse = false;
  noError = true;
  message: string;
  // hrRequestDetailsSection = new Section(
  //   'hrRequestDetails',
  //   new SectionHeader(
  //     null,
  //     null,
  //     null,
  //     null,
  //     null,
  //     null,
  //     null,
  //     null,
  //     false
  //   ),
  //   {
  //     details: {
  //       isOnBehalfOf: {
  //         key: null,
  //         value: null
  //       },
  //       onBehalfOfEmail: {
  //         personName: null,
  //         personEmail: null
  //       }
  //     }
  //   }
  // );
  public feedBackIcon: string = null;
  showFlagOptions: boolean = false;

  constructor(
    public profileRequestorService: ProfileRequestorService,
    public stateMachineService: StateMachineService,
    public i18n: I18nService,
    public segmentDynamicLoader: SegmentDynamicLoaderService,
    public resetPropagator: ResetPropagationService
  ) {
    // Decode config

    this.showProfileFormContent = true;
    this.showCommentFormContent = true;
    this.submitResponse = null;
    this.stateMachineService
      .dispatch(Constants.STATE_MACHINE_ACTION_LOAD_FORM)
      .then((form: any) => {
        if (form instanceof Form) {
          console.log("forms", form);
          if (form.sections && form.sections.length > 0) {
            this.form = form;
            this.sections = form.sections;
            setTimeout(() => {
              this.profileRequestorService.setForm(form);
            }, 0);

            this.creationDate = moment(form.header.creationDate)
              .locale("en-US")
              .format("DD/MM/YYYY HH:mm:ss");
            /* istanbul ignore next  */
            if (form.commentsDrop) {
              this.numberOfComments = this.form.commentsDrop.length;
            }
            if (
              form.lovs &&
              form.lovs.decision &&
              form.lovs.decision.type === "buttons"
            ) {
              form.lovs.decision.options.forEach((option) => {
                this.isSubmitting[option.value] = false;
              });
            } else {
              this.isSubmitting["SUBMIT"] = false;
            }
            this.isValidLoad = true;
            if (form.header.status.key !== "NEW") {
              this.hrRequestIsSubmitted = true;
            }
          }
        } else if (form instanceof Messages) {
          if (!this.form) {
            this.form = new Form(
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              form
            );
          } else {
            this.form.messages = form;
          }
        }
        this.isReady = true;
        this.noError = true;
        this.profileRequestorService.getSectionDetails().subscribe((data) => {
          this.SectionDetails = data;
          const [sect] = this.form.sections;
          this.requestSection = sect;
        });
      });

    setTimeout(() => {
      if (this.isReady == false) {
        this.isReady = true;
        this.noError = false;
        if (this.stateMachineService["successed"] == "false") {
          this.message = this.i18n.translate("pageErrorLoading");
        }
        if (this.stateMachineService["successed"] == undefined) {
          this.message = this.i18n.translate("pageTimeOut");
        }
      }
    }, 7000);
  }

  messageBoxClasses() {
    return {
      alert: true,
      "alert-danger": true,
    };
  }

  messageClose(event) {
    // this.message=null;
    // this.noError=true
  }

  /* istanbul ignore next  */
  ngAfterViewChecked() {
    if (this.formStateObject && this.form && !this.startedListener) {
      this.formStateObject.valueChanges.subscribe(
        /* istanbul ignore next  */
        (form) => {
          Object.keys(form).forEach((key) => {
            if (
              this.sections[this.sections.length - 1].body.details[key] !==
                form[key] &&
              form[key] !== undefined
            )
              this.sections[this.sections.length - 1].body.details[key] =
                form[key];
          });
        }
      );
      this.sectionsController = this.formStateObject.controls;
      this.startedListener = true;
    }
  }
  private sectionIdHelper(context, id) {
    return context.segmentDynamicLoader.getPrintPartialName(id);
  }

  print() {
    let compiledTemplate = null;
    let popupWin;
    popupWin = window.open(
      "",
      "_blank",
      "top=0,left=0,height=auto,width=auto",
      false
    );
    let printObject = {
      form: this.form,
      i18n: this.i18n,
      segmentDynamicLoader: this.segmentDynamicLoader,
      lovs: this.form.lovs,
      formId: this.form.header.formId,
    };
    Handlebars.registerHelper("i18nTranslate", this.translateHelper);
    Handlebars.registerHelper("dateFormat", this.dateFormatHelper);
    Handlebars.registerHelper("dateFormatHelper3", this.dateFormatHelper3);
    Handlebars.registerHelper("dateFormat2", this.dateFormatHelper2);
    Handlebars.registerHelper("getPartialName", this.sectionIdHelper);
    Handlebars.registerHelper("lovResolver", this.lovResolverHelper);
    Handlebars.registerHelper("paragraphSplit", this.paragraphSplit);
    Handlebars.registerHelper("getSectionTitle", this.sectionTitleHelper);
    Handlebars.registerHelper("consolelog", this.consolelog);
    Handlebars.registerHelper("getCurrentLang", this.getCurrentLang.bind(this));
    Handlebars.registerHelper("eq", this.eq);
    Handlebars.registerHelper("getFormId", this.getFormId.bind(this));
    Handlebars.registerHelper("and", this.and);
    Handlebars.registerHelper("or", this.or);
    Handlebars.registerHelper("not", this.not);
    // Handlebars.registerHelper('performanceRatings', this.performanceRatingsHelper);
    Handlebars.registerHelper("log", function (text) {
      console.log(text);
    });
    
    Handlebars.registerPartial('requestDetails', printTemplate.requestDetails);
    Handlebars.registerPartial('_ExecutivePersonalsComponent', printTemplate._ExecutivePersonalsComponent);
    Handlebars.registerPartial('_OutsourceOperationSectionComponent', printTemplate._OutsourceOperationSectionComponent);
    Handlebars.registerPartial('_PeopleDataManagementComponent', printTemplate._PeopleDataManagementComponent);

    // Handlebars.registerPartial('sectionApprover', printTemplate.sectionApprover);
    if (this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR) {
      compiledTemplate = Handlebars.compile(printTemplateRtl.printTemplate);
    } else {
      compiledTemplate = Handlebars.compile(printTemplate.printTemplate);
    }
    popupWin.document.open();
    popupWin.document.write(compiledTemplate(printObject));
    popupWin.document.close();
  }

  // private getSecrionData(this) {
  //   console.log('*************getSecrionData****************', this);
  //   let userEmail = (this.header.personToThumbnail.split('=')[1])
  //   this.stateMachineService.dispatch(Constants.STATE_MACHINE_ACTION_EMPLOYEE_PROFILE, userEmail).then((response) => {
  //     if (response) {
  //       this.profileData['name'] = response;
  //     }
  //   })
  // }

  public getCurrentLang() {
    return this.i18n.getLanguage();
  }

  private translateHelper = (key) => {
    return this.i18n.translate(key);
  };
  private consolelog(type) {
    console.log("------------", type, "-----------------", this);
  }

  private getFormId() {
    return this.form.header.formId;
  }

  private dateFormatHelper(key) {
    return moment(key).format(Constants.DATE_TIME);
  }

  private dateFormatHelper2(key) {
    return moment(key).format(Constants.DATE_DASH);
  }

  private dateFormatHelper3(key) {
    if (key != null && key !== undefined )
    {
      return moment(key).format(Constants.DATE_SLASH);
    }
  
  }
  private lovResolverHelper(key, lov) {
    let description = "NOT_FOUND_IN_LOV";
    if (lov && lov.options && key) {
      lov.options.forEach((element) => {
        if (element.value === key) {
          description = element.description;
        }
      });
    }
    return description;
  }

  private paragraphSplit(string) {
    return string.split("\n");
  }

  // private performanceRatingsHelper(key, yearBehind) {
  //   let performanceRatingsObj = {};
  //   key.forEach(({ year, rating }) => {
  //     performanceRatingsObj[year] = rating;
  //   })
  //   let currentYear = new Date().getFullYear();
  //   return performanceRatingsObj[currentYear - yearBehind]
  // }

  private sectionTitleHelper(componentId, segmentDynamicLoader) {
    return segmentDynamicLoader.getSectionName(componentId);
  }

  private eq(valueA, valueB) {
    let result = valueA === valueB;
    return result;
  }

  private and(valueA, valueB) {
    let result = valueA && valueB;
    return result;
  }

  private or(valueA, valueB) {
    let result = valueA || valueB;
    return result;
  }

  private not(valueA) {
    let result = !valueA;
    return result;
  }

  onProfileFormClick() {
    if ($j(Constants.PROFILE_CONTAINER).is(":visible")) {
      $j(Constants.PROFILE_CONTAINER).slideUp(300);
    } else {
      this.slideUpOpenedContainer();
      $j(Constants.PROFILE_CONTAINER).delay(300).slideDown(300);
    }
  }

  onCommentsFormClick() {
    if ($j(Constants.COMMENT_CONTAINER).is(":visible")) {
      $j(Constants.COMMENT_CONTAINER).slideUp(300);
    } else {
      this.slideUpOpenedContainer();
      $j(Constants.COMMENT_CONTAINER).delay(300).slideDown(300);
    }
  }

  onFeedbackFormClick() {
    if ($j(Constants.FEEDBACK_CONTAINER).is(":visible")) {
      $j(Constants.FEEDBACK_CONTAINER).slideUp(300);
    } else {
      this.slideUpOpenedContainer();
      $j(Constants.FEEDBACK_CONTAINER).delay(300).slideDown(300);
    }
  }

  slideUpOpenedContainer() {
    $j(".formInfoModals").slideUp(300);
  }

  isReadOnly(index: number) {
    return this.sections.length - index !== 1;
  }

  statusClass(status) {
    if (
      status === Constants.FORM_STATUS_REJECTED ||
      status === Constants.FORM_STATUS_CANCELLED
    ) {
      return {
        status: true,
        danger:
          status === Constants.FORM_STATUS_REJECTED ||
          status === Constants.FORM_STATUS_CANCELLED,
      };
    } else if (
      status === Constants.FORM_STATUS_COMPLETED ||
      status === Constants.FORM_STATUS_APPROVED
    ) {
      return {
        status: true,
        success:
          status === Constants.FORM_STATUS_COMPLETED ||
          Constants.FORM_STATUS_APPROVED,
      };
    } else if (status === Constants.FORM_STATUS_PENDING) {
      return {
        status: true,
        warning: status === Constants.FORM_STATUS_PENDING,
      };
    }
  }

  // tryParseJSON(value) {
  //   try {
  //     let o = JSON.parse(value);
  //     if (o && typeof o === "object") {
  //       return o;
  //     }
  //   } catch (e) { }
  //   return value;
  // }

  onSubmit(action) {
    let sectionSize = this.sections.length - 1;
    let sectionDecision = this.sections[sectionSize].body.details.decision;
    // let detailsKeys = Object.keys(this.sections[sectionSize].body.details)
    if (sectionDecision && action === "SUBMIT") {
      sectionDecision = { key: action };
    }

    
    if (sectionDecision && action !== "SUBMIT") {
      sectionDecision = { key: action };
      // SAVE_CHANGES
    }
    this.sections[sectionSize].body.details.decision = sectionDecision;
    // detailsKeys.forEach((key) => {
    //   let value = this.sections[sectionSize].body.details[key];
    //   this.sections[sectionSize].body.details[key] = this.tryParseJSON(value)
    //   // if (value !== null && value instanceof Date) {
    //   //   this.sections[sectionSize].body.details[key] = moment(value).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    //   // }
    // })

    // if (this.sections[sectionSize].id == "requestDetails") {
    // }
    console.log("this.sections", this.sections);
    this.isSubmitting[action] = true;
    this.stateMachineService
      .dispatch(
        Constants.STATE_MACHINE_ACTION_SUBMIT_FORM,
        this.sections[sectionSize],
        action
      )
      .then((form) => {
        if (form.error) {
          if (!this.form) {
            this.form = new Form(
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              Constants.NO_VALUE,
              form
            );
          } else {
            this.form.messages = form;
            this.form = loadFormHooks.afterTranspilePayload(this.form);
          }
          window.scrollTo(0, 0);
        } else {
          this.submitResponse = form;
          this.isSuccessfullySubmitted = true;
          this.submitResponse.creationDate = moment(
            this.submitResponse.creationDate
          )
            .locale("en-US")
            .format("DD/MM/YYYY HH:mm:ss");
          // this.submitResponse.creationDate = moment(this.submitResponse.creationDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
          if (this.stateMachineService.isOpenOnInbox()) {
            (window as any).verifySuccessOrFailureBPM();
          }
          window.scrollTo(0, 0);
        }
        this.isSubmitting[action] = false;
        console.log(this.submitResponse);
      });
  }

  // gregorianDay(date) {
  //   let m = moment(date);
  //   let rtn = m.format('D');
  //   if (m.toString() === m.startOf('month').toString()) {
  //     rtn = m.format('D MMM');
  //   }

  //   return rtn;
  // }

  validForm(action) {
    let returnValue = true;
    let lastSection = this.form.sections[this.form.sections.length - 1].body
      .details;
    let lastSectionId = this.form.sections[this.form.sections.length - 1].id;
    let formIsValid = this.formStateObject ? this.formStateObject.valid : true;
    let commentValid;
    if (lastSection.comment && lastSection.comment.length > 0) {
      if (
        lastSection.comment.length >= 15 &&
        lastSection.comment.length <= 500
      ) {
        commentValid = true;
      } else {
        commentValid = false;
      }
    } else {
      commentValid = true;
    }
    switch (action) {
      case "SUBMIT":
        if (formIsValid) {
          returnValue = true;
        } else {
          returnValue = false;
        }
        break;
      case "APPROVE":
        if (formIsValid && commentValid) {
          returnValue = true;
        } else {
          returnValue = false;
        }
        break;
      case "REJECT":
        if (lastSection.comment && commentValid) {
          returnValue = true;
        } else {
          returnValue = false;
        }
        break;
      case "SENDBACK":
        if (lastSection.comment && commentValid) {
          returnValue = true;
        } else {
          returnValue = false;
        }
        break;
      case "SAVE_CHANGES":
        returnValue = true;
        break;
      case "CANCEL":
        if (lastSection.comment && commentValid) {
          returnValue = true;
        } else {
          returnValue = false;
        }
        break;
    }
    return returnValue;
  }

  resetForm() {
    console.log(this.formStateObject.value);
    this.formStateObject.reset();
    this.resetPropagator.propagate();
    console.log(this.formStateObject.value);
  }

  // validHrForm() {
  //   if (this.hrRequestDetailsSection.body.details.onBehalfFlag == 'true'
  //     && this.hrRequestDetailsSection.body.details.onBehalfOfEmail) {
  //     return true
  //   } else if (this.hrRequestDetailsSection.body.details.onBehalfFlag == 'false') {
  //     return true
  //   } else if (this.hrRequestDetailsSection.body.details.onBehalfFlag == 'true'
  //     && !this.hrRequestDetailsSection.body.details.onBehalfOfEmail) {
  //     return false
  //   }
  // }

  // resetFormHr() {
  //   this.resetPropagator.propagate();
  //   let lastSection = this.hrRequestDetailsSection.body.details;
  //   lastSection.isOnBehalfOf.key = null;
  //   lastSection.isOnBehalfOf.value = null;
  //   lastSection.onBehalfOfEmail.personName = null;
  //   lastSection.onBehalfOfEmail.personEmail = null;
  // }

  // onHrSubmit() {
  //   this.isSubmitting.hrSubmit = true;
  //       if (this.hrRequestDetailsSection.body.details.onBehalfFlag == 'true') {
  //     this.stateMachineService.dispatch(Constants.STATE_MACHINE_ACTION_LOAD_FORM, this.hrRequestDetailsSection.body.details).then((form: any) => {
  //       if (form instanceof Form) {
  //         if (form.sections && form.sections.length > 0) {
  //           this.form = form;
  //           this.sections = form.sections;
  //           this.creationDate = moment(form.header.creationDate).format("DD/MM/YYYY HH:mm:ss");
  //           /* istanbul ignore next  */
  //           if (form.commentsDrop) {
  //             this.numberOfComments = this.form.commentsDrop.length;
  //           }
  //           if (form.lovs && form.lovs.decision && form.lovs.decision.type === 'buttons') {
  //             form.lovs.decision.options.forEach((option) => {
  //               this.isSubmitting[option.value] = false;
  //             })
  //           }
  //           else {
  //             this.isSubmitting['SUBMIT'] = false;
  //           }
  //           this.isValidLoad = true;
  //         }
  //       } else if (form instanceof Messages) {
  //         if (!this.form) {
  //           this.form = new Form(
  //             Constants.NO_VALUE,
  //             Constants.NO_VALUE,
  //             Constants.NO_VALUE,
  //             Constants.NO_VALUE,
  //             Constants.NO_VALUE,
  //             Constants.NO_VALUE,
  //             form
  //           );
  //         } else {
  //           this.form.messages = form;
  //         }
  //       }
  //       this.isReady = true;
  //       this.hrRequestIsSubmitted = true;
  //     });
  //   }
  //   else {
  //     this.hrRequestIsSubmitted = true;
  //   }
  // }

  buttonTypes(key) {
    return {
      "btn-primary": true,
    };
  }

  nameOnly(status) {
    return {
      nameOnly: status === Constants.FORM_STATUS_NEW,
    };
  }

  loaderArabic() {
    return {
      loaderArabic:
        this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR &&
        !this.stateMachineService.isMobileApp(),
    };
  }

  rtlDir() {
    return {
      "ar-dir-rtl": this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
    };
  }

  rtlFloatRight() {
    return {
      "ar-float-right": this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
    };
  }

  rtlFloatLeft() {
    return {
      "ar-float-left": this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
    };
  }

  rtlAlignRight() {
    return {
      "ar-align-right": this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
    };
  }

  containerClass() {
    return {
      "ar-dir-rtl": this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
      "mobile-app-container": this.stateMachineService.isMobileApp(),
    };
  }

  isOnBehalfOfAuthorized() {
    return this.form.profileInfoDrop.onBehalfAuthorized;
  }

  // public b64DecodeUnicode(str: string): string {
  //   if (window
  //     && 'atob' in window
  //     && 'decodeURIComponent' in window) {
  //     return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
  //       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //     }).join(''));
  //   } else {
  //     console.warn('b64DecodeUnicode requirements: window.atob and window.decodeURIComponent functions');
  //     return null;
  //   }
  // }

  flagOptionsHandler() {
    this.showFlagOptions = true;
  }

  setFlagPriority(id: string) {
    this.form.inboxItem.flagPriority = id;
    this.showFlagOptions = false;
    this.stateMachineService
      .dispatch(Constants.STATE_MACHINE_ACTION_SET_FLAG, id)
      .then((Response) => {});
  }

  changeFeedbackStatus(event) {
    const self = this;
    setTimeout(function () {
      self.feedBackIcon = event;
    }, 100);
  }

  showPrintIcon() {
    let rtn = true;
    if (
      this.stateMachineService.isOpenOnInbox() ||
      this.stateMachineService.showPrint()
    ) {
      rtn = true;
    } else if (this.stateMachineService.isMobileApp()) {
      rtn = false;
    }
    return rtn;
  }

  // isPrintAble() {
  //   return this.requestSection.body.canPrint === 'true' ? true : false;
  // }
}
