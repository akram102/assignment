import { api, LightningElement } from 'lwc';

import EMPLOYEE_OBJECT from '@salesforce/schema/Employee__c';
import NAME_FIELD from '@salesforce/schema/Employee__c.Name'
import EMAIL_FIELD from '@salesforce/schema/Employee__c.Email__c'
import CONTACT_FIELD from '@salesforce/schema/Employee__c.Contact__c'
import ADDRESS_FIELD from '@salesforce/schema/Employee__c.Address__c'

export default class RecordForm extends LightningElement {

    @api
    recordId;

    fields = [NAME_FIELD,EMAIL_FIELD,CONTACT_FIELD];
    objectApiName = EMPLOYEE_OBJECT;

    handleSubmit(){
        console.log('record-id ',this.recordId)
    }
}