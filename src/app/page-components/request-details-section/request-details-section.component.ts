import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
} from "@angular/core";
import { I18nService } from "../../../core/services/i18n.service";
import * as Constants from "../../constants/constants";
import { ProfileRequestorService } from "../../services/profile-requestor.service";
import { Section, Form } from "../../../core/models/form";
import { StateMachineService } from "../../../core/services/state-machine.service";
import { Messages } from "./../../../core/models/form";
import loadFormHooks from "./../../hooks/load-form";
import { max } from "moment";
import { isArray } from "util";


@Component({
  selector: "app-request-details-section",
  templateUrl: "./request-details-section.component.html",
  styleUrls: ["./request-details-section.component.css"],
})
export class RequestDetailsSectionComponent implements AfterViewInit {



  @Input() isReadOnly: boolean;
  @Input() section: Section;
  @Input() lov: any;

  personalProfileVisibility:boolean = false  ;
  organizationalProfileVisibility:boolean = false  ;


  familyProfile = "true";
  nationalAddressSegment = "true";
  officialDocumentSegment = "true";

  currentSectionId: any;
  helpMessage: string = "";
  importFromElmMessage: string = "";
  nationalAddresshelpMessage: string = "";
  organizationalProfilehelpMessage: string = "";
  officialDocumenthelpMessage: string = "";
  personalProfilehelpMessage: string = "";
  previousExperienceMessage: string = "";
  qualificationhelpMessage: string = "";
  originalAddresshelpMessage: string = "";
  contactInformationhelpMessage: string = "";
  officeLocationhelpMessage: string = "";
  medicalDetailhelpMessage : string = "";

  profCertInformationhelpMessage: string = "";
  profParentDetailshelpMessage: string = "";

  
  form: Form;
  haveDataFromElmnationalAddress: boolean;
  haveDataFromElmfamilyProfile: boolean;

  nationalAddressElmData: any;



  // this objects use to Add/ delete from Tables
  familyProfileObj = {
    new: "true",
    supportDoc: {
      fileName: null,
      mimeType: null,
      fileContents: null,
    },
    note: null,
    disabilityType: {
      key: null,
    },
    gender: {
      value: null,
      key: null,
    },
    disabilityFlag: {
      value: null,
      key: null,
    },
    grandFatherNameEn: null,
    familyCard: {
      fileName: null,
      mimeType: null,
      fileContents: null,
    },
    isUpdated: false,
    coverageNote: null,
    title: {
      value: null,
      key: null,
    },
    idNumber: null,
    fatherNameEn: null,
    working: {
      value: null,
      key: null,
    },
    familyNameAr: null,
    justification: {
      key: null,
    },
    relationship: {
      value: null,
      key: null,
    },
    fatherNameAr: null,
    newToSaudi: null,
    importFromElm: false,
    familyNameEn: null,
    idAttachment: {
      fileName: null,
      mimeType: null,
      fileContents: null,
    },
    noNeedMedical: {
      value: null,
      key: null,
    },
    chronicDisease: {
      value: null,
      key: null,
    },
    birthDate: null,
    firstNameEn: null,
    nationality: {
      value: null,
      key: null,
    },
    chronicDiseaseType: {
      key: null,
    },
    firstNameAr: null,
    passportOrBirthAttachment: {
      fileName: null,
      mimeType: null,
      fileContents: null,
    },
    maritalStatus: {
      value: null,
      key: null,
    },
    age: null,
    grandFatherNameAr: null,
  };
  qualificationObj = {
    action: 'ADD',
    certificate: {fileName: null, isIgate: null, mimeType: null, attachmentId: null, fileContents: null},
    country: {value: null, key: null},
    educationLevel: {value: null, key: null},
    evaluationCertificate: {fileName: null, isIgate: null, mimeType: null, attachmentId: null, fileContents: null},
    evaluationDate: null,
    evaluationNo: null,
    gpa: null,
    graduatedDate: null,
    id: null,
    major: {value: null, key: null},
    scale: {value: null, key: null},
    startDate: null,
    subMajor: {value: null, key: null},
    new: "true",
    universityInstitute: {value: null, key: null},
  }
  nationalAddressObj = {
    action : 'add',
    new: "true",
    note: null,
    streetName: null,
    attachment: {
      fileName: null,
      mimeType: null,
      fileContents: null,
    },
    city: null,
    district: null,
    postalCode: null,
    buildingNumber: null,
    counter: null,
  };
  officialDocumentObj = {
    action : 'add',
    new: "true",
    expiryDate: null,
    profession: null,
    attachment: {
      fileName: null,
      mimeType: null,
      fileContents: null,
    },
    documentType: {
      value: null,
      key: null,
    },
    documentNumber: null,
    issueDate: null,
    version: null,
    issuePlace: {
      value: null,
      key: null,
    },
  };
  medicalDetailsObj = {
    action : 'add',
    new : "new",
    bloodType: { value: null, key: null },
    chronicDiseaseFlag: { value: null, key: null },
    chronicDiseaseType: { value: null, key: null },
    disabilityFlag: { value: null, key: null },
    disabilityId: null,
    disabilityType: { value: null, key: null },
    height: null,
    personId: null,
    smoker: null,
    weight: null
  };
  originalAddressObj = {
    new: "true",
    id: "",
    action : 'add',
    country:{ value: null, key: null },
    city: "",
    districtName: "",
    streetName: "",
    postalCode: "",
    buildingNumber: "",
    unitNumber: "",
    additionalNumber: "",
  };

  previousExperienceObj = {
    new: "true",
    action : 'add',
    attachment: {
      fileName: null,
      isIgate: null,
      mimeType: null,
      attachmentId: null,
    },
    city: null,
    companyName: null,
    companySector: { value: null, key: null },
    country: { value: null, key: null },
    duration: { periodDays: null, periodMonths: null, periodYears: null },
    endDate: null,
    id: null,
    jobField: null,
    jobTitle: null,
    responsibilities: null,
    startDate: null,
  };

  contactInformationObj = {
    new: "true",
    action : 'add',
    type:{ value: null, key: null },
    countryCode:{ value: null, key: null },
    areaCode:{ value: null, key: null },
    phone: "",
     primary : "N"
  }
//----------------------------------------------------------------

getFilteredList(list)
{
    let FilteredList  = []  ;

       debugger  ;
    
        list.forEach(item => {
          if (item.id  !== '-1') 
              {
                FilteredList.push (item)  ;
              }
          
        });
  
              
         return FilteredList   ;
     
  

   

}




// this functions used to update isupdated Flag 

familyProfileSegmentisUpdated: boolean;
onfamilyProfileSegmentisUpdated() {
  if (this.familyProfileSegmentisUpdated) {
    this.section.body.details.familyProfileSegment.isUpdated = "true";
  } else {
    this.section.body.details.familyProfileSegment.isUpdated = "false";
  }
}

nationalAddressSegmentisUpdated: boolean;
nationalAddressSegmentisUpdatedChange() {
  if (this.nationalAddressSegmentisUpdated) {
    this.section.body.details.nationalAddressSegment.isUpdated = "true";
  } else {
    this.section.body.details.nationalAddressSegment.isUpdated = "false";
  }
}

officialDocumentSegmentisUpdated: boolean;
officialDocumentSegmentisUpdatedChange() {
  if (this.officialDocumentSegmentisUpdated) {
    this.section.body.details.officialDocumentSegment.isUpdated = "true";
  } else {
    this.section.body.details.officialDocumentSegment.isUpdated = "false";
  }
}


parentProfile : boolean
parentProfileChange(){
  if (this.parentProfile) {
    this.section.body.details.parentProfileSegment.isUpdated = "true";
  } else {
    this.section.body.details.parentProfileSegment.isUpdated = "false";
  }
}

previousExperience : boolean
previousExperienceChange(){
  if (this.previousExperience) {
    this.section.body.details.previousExperienceSegment.isUpdated = "true";
  } else {
    this.section.body.details.previousExperienceSegment.isUpdated = "false";
  }
}

qualification : boolean
qualificationChange(){
  if (this.qualification) {
    this.section.body.details.qualificationSegment.isUpdated = "true";
  } else {
    this.section.body.details.qualificationSegment.isUpdated = "false";
  }
}
originalAddress : boolean
originalAddressChange(){
  if (this.originalAddress) {
    this.section.body.details.originalAddressSegment.isUpdated = "true";
  } else {
    this.section.body.details.originalAddressSegment.isUpdated = "false";
  }
}
contactInformation : boolean
contactInformationChange(){
  if (this.contactInformation) {
    this.section.body.details.contactInformationSegment.isUpdated = "true";
  } else {
    this.section.body.details.contactInformationSegment.isUpdated = "false";
  }
}

officeLocation : boolean
officeLocationChange(){
  if (this.officeLocation) {
    this.section.body.details.officeLocationSegment.officeLocation.isUpdated = "true";
  } else {
    this.section.body.details.officeLocationSegment.officeLocation.isUpdated = "false";
  }
}

professionalCertificate : boolean
professionalCertificateChange(){
  if (this.professionalCertificate) {
    this.section.body.details.professionalCertificateSegment.professionalCertificate.isUpdated = "true";
  } else {
    this.section.body.details.professionalCertificateSegment.professionalCertificate.isUpdated = "false";
  }
}
medicalDetails : boolean
medicalDetailsChange(){
  if (this.medicalDetails) {
    this.section.body.details.medicalDetailsSegment.medicalDetails.isUpdated = "true";
  } else {
    this.section.body.details.medicalDetailsSegment.medicalDetails.isUpdated = "false";
  }
}

// ---------------------------------------------------------------------


// Generic functions should replace per segment functions

deleteGenericRow (firstLevel ,secondLevel , index)
{
   this.section.body.details[firstLevel][secondLevel].splice(index ,1);
}

AddNewGenericRow(Segment)
{
  
  if (Segment  == "previousExperienceSegment") 
   {
       this.section.body.details.previousExperienceSegment.previousExperience.push(
      Object.assign({}, this.previousExperienceObj));
   }
   else  if (Segment  == "contactInformationSegment") 
   {
    this.section.body.details.contactInformationSegment.contactInformation.push(
      Object.assign({}, this.contactInformationObj));
   }
  
   else  if (Segment  == "qualificationSegment") 
   {
    this.section.body.details.qualificationSegment.qualification.push(
      Object.assign({}, this.qualificationObj));
   }
   else  if (Segment  == "originalAddressSegment") 
   {
    this.section.body.details.originalAddressSegment.originalAddress.push(
      Object.assign({}, this.originalAddressObj));
   }
   
}



//---------------------------------------------



  constructor(
    public i18n: I18nService,
    public stateMachine: StateMachineService,
    public profileRequestorService: ProfileRequestorService
  ) {}
  inputDisplay() {
    // return {
    //   "input-display": this.isReadOnly ,
    // }
  }
  minimizefamilyProfile(fam) {
    fam["minimize"] = true;
  }
  plusfamilyProfile(fam) {
    fam["minimize"] = false;
  }
  ngAfterViewInit() {
    this.helpMessage = this.i18n.translate("helpMessage");
    this.nationalAddresshelpMessage = this.i18n.translate(
      "nationalAddresshelpMessage"
    );
    this.officialDocumenthelpMessage = this.i18n.translate(
      "officialDocumenthelpMessage"
    );

    this.personalProfilehelpMessage = this.i18n.translate(
      "personalProfilehelpMessage"
    );
    this.organizationalProfilehelpMessage = this.i18n.translate(
      "organizationalProfilehelpMessage"
    );

    this.previousExperienceMessage = this.i18n.translate(
      "previousExperienceMessage"
    );
    this.qualificationhelpMessage = this.i18n.translate(
      "qualificationhelpMessage"
    );
    this.originalAddresshelpMessage = this.i18n.translate(
      "originalAddresshelpMessage"
    );

    this.contactInformationhelpMessage = this.i18n.translate(
      "contactInformationhelpMessage"
    );
    this.officeLocationhelpMessage = this.i18n.translate(
      "officeLocationhelpMessage"
    );
    this.medicalDetailhelpMessage = this.i18n.translate(
      "medicalDetailhelpMessage"
    );

    this.profCertInformationhelpMessage = this.i18n.translate(
      "profCertInformationhelpMessage"
    );

    this.profParentDetailshelpMessage = this.i18n.translate(
      "profParentDetailshelpMessage"
    );

    

    
    this.ServicesSubScriptions();

    //to set existing prob
    if (
      this.section.body.details &&
      this.section.body.details.familyProfileSegment &&
      this.section.body.details.familyProfileSegment.familyProfile
    ) {
      this.section.body.details.familyProfileSegment.familyProfile.forEach(
        (element) => {
          element["existing"] = "true";
          element["minimize"] = true;
          element["importFromElm"] = false;
          if (element.justification && element.justification.key != "") {
            element.isUpdated == "true";
          }
        }
      );
    }

    if (
      this.section.body.details &&
      this.section.body.details.nationalAddressSegment &&
      this.section.body.details.nationalAddressSegment.nationalAddress
    ) {
      this.section.body.details.nationalAddressSegment.nationalAddress.forEach(
        (element) => {
          element["existing"] = "true";
          element["importFromElm"] = false;
        }
      );
    }
    if (
      this.section.body.details &&
      this.section.body.details.officialDocumentSegment &&
      this.section.body.details.officialDocumentSegment.officialDocument
    ) {
      this.section.body.details.officialDocumentSegment.officialDocument.forEach(
        (element) => {
          element["existing"] = "true";
          element["importFromElm"] = false;
        }
      );
    }

    if (
      this.section.body.details.familyProfileSegment &&
      this.section.body.details.familyProfileSegment.isUpdated == "true"
    ) {
      this.familyProfileSegmentisUpdated = true;
    } else {
      this.familyProfileSegmentisUpdated = false;
    }

    if (
      this.section.body.details.nationalAddressSegment &&
      this.section.body.details.nationalAddressSegment.isUpdated == "true"
    ) {
      this.nationalAddressSegmentisUpdated = true;
    } else {
      this.nationalAddressSegmentisUpdated = false;
    }

    if (
      this.section.body.details.officialDocumentSegment &&
      this.section.body.details.officialDocumentSegment.isUpdated == "true"
    ) {
      this.officialDocumentSegmentisUpdated = true;
    } else {
      this.officialDocumentSegmentisUpdated = false;
    }
  }
 
  help() {}
  activeRow() {
    return {
      active: 1 == 1,
    };
  }
  rtlButtonBrowseLabel() {
    return {
      rtlButtonBrowseLabel:
        this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
    };
  }
  addNationalAddress() {
    this.section.body.details.nationalAddressSegment.nationalAddress.push(
      Object.assign({}, this.nationalAddressObj)
    );
  }










  deleteRow(type, i, row) {
    if (type == "nationalAddress") {
      this.section.body.details.nationalAddressSegment.nationalAddress.splice(
        i,
        1
      );
    }
    if (type == "officialDocument") {
      this.section.body.details.officialDocumentSegment.officialDocument.splice(
        i,
        1
      );
    }

    if (type == "originalAddress") {
      this.section.body.details.originalAddressSegment.originalAddress.originalAddress.splice(
        i,
        1
      );
    }

    if (type == "previousExperience") {
      this.section.body.details.previousExperienceSegment.previousExperience.previousExperience.splice(
        i,
        1
      );
    }
    if (type == "qualification") {
      this.section.body.details.qualificationSegment.qualification.qualification.splice(
        i,
        1
      );
    }

  }

  addfamilyProfile() {
    // let temp = JSON.parse(JSON.stringify(this.familyProfileObj))
    this.section.body.details.familyProfileSegment.familyProfile.push(
      Object.assign({}, this.familyProfileObj)
    );
  }

  removefamilyProfile() {
    let idx =
      this.section.body.details.familyProfileSegment.familyProfile.length - 1;
    if (
      this.section.body.details.familyProfileSegment.familyProfile[idx] &&
      this.section.body.details.familyProfileSegment.familyProfile[idx][
        "new"
      ] == "true"
    ) {
      this.section.body.details.familyProfileSegment.familyProfile.splice(
        idx,
        1
      );
    }
  }

  addofficialDocumentSegment() {
    this.section.body.details.officialDocumentSegment.officialDocument.push(
      Object.assign({}, this.officialDocumentObj)
    );
  }

  addDeleteRow() {
    this.section.body.details.originalAddress.originalAddress.originalAddress.push(
      Object.assign({}, this.originalAddressObj)
    );
  }

  tableSize() {
    return {
      "ar-float-right": this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
      "col-xs-12": true,
      "col-md-12 ": true,
    };
  }

  tableCellTextAlign() {
    return {
      "control-cells-ar":
        this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
    };
  }

  rtlFloatRight() {
 
    return {
            "ar-float-right": this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
            "en-float-left " :  this.i18n.getLanguage() === Constants.LANGUAGE_CODE_EN,
    };
  }


  public ServicesSubScriptions() {
    this.profileRequestorService.getForm().subscribe((data) => {
      this.form = data;
      this.currentSectionId = this.form.sections[
        this.form.sections.length - 1
      ].id;
    });
  }

  setbirthDate(dateOfBirth: any, familyProfile, fieldName) {
    console.log("dateOfBirthHijri", dateOfBirth);
    if (dateOfBirth) {
      familyProfile["dateOfBirthHijri"] = dateOfBirth;
    } else {
      familyProfile["dateOfBirthHijri"] = null;
    }
  }
  ageFromDateOfBirthday(dateOfBirth: any, familyProfile): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return (familyProfile.age = age);
  }
  handleSelectorganizationalProfileChange(fieldName, object) {
    this.section.body.details.organizationalProfile[fieldName] = {
      key: object.key,
    };
  }

  handlequalificationSelectChange(fieldName, qualification, object) {
    qualification[fieldName] = { key: object.key };
  }

  handlechosenOptionChange(fieldName, object) {
    debugger;
    this.section.body.details.medicalDetails.medicalDetails[fieldName] = { key: object.key };
  }

  handleSelectpersonalProfileChange(fieldName, object) {
    this.section.body.details.personalProfile[fieldName] = { key: object.key };
  }
  handlepreviousExperienceSelectChange(fieldName, previousExperience, object) {
    previousExperience[fieldName] = { key: object.key };
  }
  handleoriginalAddressSelectChange(fieldName, originalAddress, object) {
    originalAddress[fieldName] = { key: object.key };
  }




   onSelectChange(fieldName, GenericDocument, object) {
    GenericDocument[fieldName] = object;
  }

  ConvertStringToBoolean (strValue) 
  {
      if (strValue == "Y") 
      {
         return true ;
      }
      else
      { 
        return false ;

      }
  }

  chaneStringToBoolean ( index  , Flag) 
  {
      if (Flag == true) 
      {
        this.section.body.details.contactInformationSegment.contactInformation[index]["primary"]  = "Y"  
      }
      else
      {
        this.section.body.details.contactInformationSegment.contactInformation[index]["primary"]  = "N"  
      }
  }

  onSelectTwoLevelsChange(fieldName, firstLevel , secondLevel, object) {
     this.section.body.details[firstLevel][secondLevel][fieldName] = object;
  }

  handleDocumentDateChange(fieldName, GenericDocument, object) {
    GenericDocument[fieldName] = object;
  }

  handlenationalAddressSelectChange(fieldName, nationalAddress, object) {
    nationalAddress[fieldName] = {
      key: object.key,
      value: object.value,
    };
  }
  MaxLenthFromNationality = 50;
  getMaxLenthFromNationality(nationalityKey, familyProfile) {
    // GCC
    if (
      nationalityKey == "023" ||
      nationalityKey == "041" ||
      nationalityKey == "058" ||
      nationalityKey == "040" ||
      nationalityKey == "082" ||
      nationalityKey == "UAE"
    ) {
      /// GCC---------------------------------
      familyProfile.idNumber = "";
      this.MaxLenthFromNationality = 15;
    } else if (nationalityKey == "001") {
      /// soudi---------------------------------
      this.MaxLenthFromNationality = 10;
      if (!familyProfile.idNumber || !familyProfile.idNumber.startsWith("1")) {
        familyProfile.idNumber = "1";
      }
    } else {
      this.MaxLenthFromNationality = 10;
      if (!familyProfile.idNumber || !familyProfile.idNumber.startsWith("2")) {
        familyProfile.idNumber = "2";
      }
    }
  }

  handleCheckbo(fieldName, checkboxState) {
    this.section.body.details[fieldName] = checkboxState;
  }

  handleCheckboxChange(fieldName, familyProfile, checkboxState) {
    familyProfile[fieldName] = checkboxState;
    if (fieldName == "importFromElm" && checkboxState == "true") {
      familyProfile.importFromElm = true;
    }
    if (fieldName == "importFromElm" && checkboxState == "false") {
      familyProfile.importFromElm = false;
    }
  }

  handlenationalAddressCheckboxChange(fieldName, checkboxState) {
    this.section.body.details.nationalAddressSegment.importFromElm = checkboxState;
    if (checkboxState == "true") {
      this.importFromElm("nationalAddress");
    }
  }
  handleofficialDocumentCheckboxChange(fieldName, checkboxState) {
    this.section.body.details.officialDocumentSegment.importFromElm = checkboxState;
    if (checkboxState == "true") {
      // this.importFromElm("officialDocument");
    }
  }


  familyProfileData(fieldName, data, familyProfile) {
    familyProfile[fieldName] = data;
    console.log(
      "this.section.body.details.familyProfileSegment.familyProfile",
      this.section.body.details.familyProfileSegment.familyProfile
    );
  }
  callElm(segment, familyProfile, ev) {
    if (ev == "true" && segment == "familyProfile") {
      this.importFromElm(segment, familyProfile);
    }
  }

  hidenational(fieldName, national) {
    if (
      this.haveDataFromElmnationalAddress &&
      this.section.body.details.nationalAddressSegment.importFromElm == "true"
    ) {
      return true;
    } else {
      return false;
    }
  }

  hidenationalAttch(fieldName, national) {
    if (
      this.haveDataFromElmnationalAddress &&
      this.section.body.details.nationalAddressSegment.importFromElm == "true"
    ) {
      return true;
    } else {
      return false;
    }
  }

  hidenationalSelectize(fieldName, national) {
    if (
      this.haveDataFromElmnationalAddress &&
      this.section.body.details.nationalAddressSegment.importFromElm == "true"
    ) {
      return true;
    } else {
      return false;
    }
  }
  isReady: boolean = true;


  getSegmentDetails(segment, checked) {
    let segmentData = {
      segment: segment,
    };
     
    if (segment  == "personalProfile") 
    {
      this.personalProfileVisibility = checked  ; 
    }
    else if (segment  == "organizationalProfile") 
    {
      this.organizationalProfileVisibility = checked  ; 
    }
    else
    {
      if (checked) {
        this.isReady = false;
        this.stateMachine.dispatch("getSegmentDetails", segmentData).then(
          (form) => {
            this.isReady = true;
            console.log("response", form);
            if (form.error) {
              window.scroll(0, 0);
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
            } else {
              console.log("this.section.body.details", this.section.body.details);
  
  
              if (segment == "familySegment") {
                this.section.body.details.familyProfileSegment = {
                  ...this.section.body.details["familyProfileSegment"],
                  ...form.request.details.familyProfileSegment,
                };
              }
              
              let mainSegment = segment + "Segment"  ;

            
                this.section.body.details[mainSegment] = {
                  ...this.section.body.details[mainSegment],
                  ...form.request.details[mainSegment],
                };

               
  
  
                if (isArray (this.section.body.details[mainSegment][segment] ) ) {
                  this.section.body.details[mainSegment][segment].forEach(element => {
                    element['action'] = 'UPDATE'
                  });
                }
  
           
            }
          },
          (err) => {}
        );
      }
    }

   
  }
  loaderArabic() {
    return {
      loaderArabic:
        this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR &&
        !this.stateMachine.isMobileApp(),
    };
  }
  importFromElm(segment, familyProfile?) {
    let idNumberData = "";
    let birthDate = "";
    if (segment == "familyProfile") {
      if (familyProfile.dateOfBirthHijri) {
        birthDate = familyProfile.dateOfBirthHijri;
      } else {
        birthDate = familyProfile.birthDate;
      }
    }

    if (familyProfile && (familyProfile.idNumber || familyProfile.birthDate)) {
      idNumberData = familyProfile.idNumber;
      birthDate = birthDate;
    }
    let segmentData = {
      segment: segment,
      idNumber: idNumberData,
      dateOfBirth: birthDate,
    };

    this.stateMachine.dispatch("importFromElm", segmentData).then(
      (form) => {
        console.log("response", form);
        if (form.error) {
          window.scroll(0, 0);
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
        } else {
          console.log("importFromElm", form);
          if (segment == "familyProfile") {
            if (
              form.data.request.details &&
              form.data.request.details.familyProfileSegment &&
              form.data.request.details.familyProfileSegment.familyProfile &&
              form.data.request.details.familyProfileSegment.familyProfile
                .length > 0
            ) {
              this.haveDataFromElmfamilyProfile = true;
              this.populatefamilyProfile(
                form.data.request.details.familyProfileSegment,
                familyProfile
              );
            } else {
              this.haveDataFromElmfamilyProfile = false;
            }

            // this.section.body.details.familyProfileSegment =response.data.request.details.familyProfileSegment;
          }
          if (segment == "nationalAddress") {
            this.section.body.details.nationalAddressSegment =
              form.data.request.details.nationalAddressSegment;

            this.nationalAddressElmData =
              form.data.request.details.nationalAddressSegment;
            if (
              form.data.request.details &&
              form.data.request.details.nationalAddressSegment &&
              form.data.request.details.nationalAddressSegment
                .nationalAddress &&
              form.data.request.details.nationalAddressSegment.nationalAddress
                .length > 0
            ) {
              this.haveDataFromElmnationalAddress = true;
            } else {
              this.haveDataFromElmnationalAddress = false;
            }
          }
          if (segment == "officialDocument") {
            this.section.body.details.officialDocumentSegment =
              form.data.request.details.officialDocumentSegment;
          }
        }
      },
      (err) => {}
    );
  }

  formComponent() {
    return {
      "ar-float-right": this.i18n.getLanguage() === Constants.LANGUAGE_CODE_AR,
      "form-group": !this.isReadOnly,
      "col-xs-12": true,
      "col-md-6 ": true,
    };
  }

  populatefamilyProfile(familyProfileSegment, familyProfile) {
    this.section.body.details.familyProfileSegment.isUpdated =
      familyProfileSegment.isUpdated;
    familyProfile.age = familyProfileSegment.familyProfile[0].age;
    familyProfile.firstNameEn =
      familyProfileSegment.familyProfile[0].firstNameEn;
    familyProfile.firstNameAr =
      familyProfileSegment.familyProfile[0].firstNameAr;
    familyProfile.fatherNameEn =
      familyProfileSegment.familyProfile[0].fatherNameEn;
    familyProfile.fatherNameAr =
      familyProfileSegment.familyProfile[0].fatherNameAr;
    familyProfile.grandFatherNameEn =
      familyProfileSegment.familyProfile[0].grandFatherNameEn;
    familyProfile.grandFatherNameAr =
      familyProfileSegment.familyProfile[0].grandFatherNameAr;
    familyProfile.familyNameEn =
      familyProfileSegment.familyProfile[0].familyNameEn;
    familyProfile.familyNameAr =
      familyProfileSegment.familyProfile[0].familyNameAr;
    familyProfile.birthDate = familyProfileSegment.familyProfile[0].birthDate;

    // this.ageFromDateOfBirthday(familyProfile ,familyProfileSegment.familyProfile[0].birthDatefamilyProfile)
    familyProfile.nationality =
      familyProfileSegment.familyProfile[0].nationality;
    familyProfile.gender = familyProfileSegment.familyProfile[0].gender;
    familyProfile.idNumber = familyProfileSegment.familyProfile[0].idNumber;
    familyProfile.borderBirthNumber =
      familyProfileSegment.familyProfile[0].borderBirthNumber;
    familyProfile.borderBirthNumber =
      familyProfileSegment.familyProfile[0].borderBirthNumber;
  }

  checkIfImportFromElmFamilyProfile(familyProfile) {
    if (this.haveDataFromElmfamilyProfile && familyProfile.importFromElm) {
      return true;
    } else {
      return false;
    }
  }
}


