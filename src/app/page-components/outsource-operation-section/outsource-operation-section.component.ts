import { Component, OnInit, Input } from '@angular/core';
import { Section } from '../../../core/models/form';
import { I18nService } from '../../../core/services/i18n.service';
import { ResetPropagationService } from '../../../core/services/reset-propagation.service';
import { ProfileRequestorService } from '../../services/profile-requestor.service';
import { StateMachineService } from '../../../core/services/state-machine.service';


@Component({
  selector: 'app-outsource-operation-section',
  templateUrl: './outsource-operation-section.component.html',
  styleUrls: ['./outsource-operation-section.component.css']
})
export class OutsourceOperationSectionComponent implements OnInit {
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
  

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  handleCheckboxChange(fieldName ,  checkboxState) {
    this.section.body.details[fieldName] = checkboxState;
  }
  reset() {
    if (!this.isReadOnly) {
      this.section.body.details.decision.key = null;
    }
  }

  handleSelectChange(fieldName, object) {
    this.section.body.details[fieldName] = { key: object.key };
  }
}
