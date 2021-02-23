import { ExecutivePersonalsComponent } from './../page-components/executive-personals/executive-personals.component';
import { OutsourceOperationSectionComponent } from './../page-components/outsource-operation-section/outsource-operation-section.component';
import { PeopleDataManagementComponent } from './../page-components/people-data-management/people-data-management.component';
export default {
  roleToApprovalSectionMapping: {
    upp_exp : ExecutivePersonalsComponent,
    upp_pdm : OutsourceOperationSectionComponent,
    upp_oos : PeopleDataManagementComponent,
    upp_dm : ExecutivePersonalsComponent,
    upp_med : ExecutivePersonalsComponent,
    upp_tm : ExecutivePersonalsComponent,
  


  },
};
