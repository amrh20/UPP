import { Component, OnInit, Input } from '@angular/core';
import { Section } from '../../../core/models/form';
import { I18nService } from '../../../core/services/i18n.service';
import { ResetPropagationService } from '../../../core/services/reset-propagation.service';
import { ProfileRequestorService } from '../../services/profile-requestor.service';
import { StateMachineService } from '../../../core/services/state-machine.service';

@Component({
  selector: 'app-people-data-management',
  templateUrl: './people-data-management.component.html',
  styleUrls: ['./people-data-management.component.css']
})
export class PeopleDataManagementComponent  {
  @Input() isReadOnly: boolean;
  @Input() section: Section;
  @Input() lov: any;

  constructor(
    public i18n: I18nService,
    public resetPropagator: ResetPropagationService,
    public profileRequestorService: ProfileRequestorService,
    public stateMachine: StateMachineService
  ) {
    this.resetPropagator.subscribe(this, this.reset);
  }
 

  reset() {
    if (!this.isReadOnly) {
      this.section.body.details.decision.key = null;
    }
  }
  handleCheckboxChange(fieldName ,  checkboxState) {
    this.section.body.details[fieldName] = checkboxState;
  }
  handleSelectChange(fieldName, object) {
    this.section.body.details[fieldName] = { key: object.key };
  }
}
