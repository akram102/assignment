import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

import getEmployee from  '@salesforce/apex/AssignmentApex.getEmployee';
import deleteEmployee from '@salesforce/apex/AssignmentApex.deleteEmployee';
import searchResult from '@salesforce/apex/AssignmentApex.searchResult';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
]

const COLUMNS = [
    { label: 'Emp ID', fieldName: 'Employee_Id__c', type: 'text' },
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email__c', type: 'text' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
]

// SUCCESS_TITLE = 'Success!!';
// MESSAGE_EMPOLYEE = 'records are deleted.';  
// SUCCESS_VARIANT = 'success'; 
// ERROR_TITLE = 'Error while deleting Record';
// ERROR_VARIANT  = 'error';

export default class EmployeeData extends NavigationMixin(LightningElement) {

    columns = COLUMNS;

    searchValue
    selctedRecord = new Array();
    isLoading = false;
    data;
    error;
    refreshTable;

    @wire(getEmployee)
    wiredResult(result){
        this.refreshTable = result;
        if(result.data){
            this.data = result.data;
            this.error = undefined;
        }else if(result.error){
            this.data = undefined;
            this.error = result.error;
        }
        console.log('data---> ',this.data);
        console.log('error---> ',this.error);
    }

    getSelectedRecords(event){
        const selectedRows = event.detail.selectedRows;
        console.log('selected----> ',selectedRows);
        for(let i = 0; i < selectedRows.length; i++){
            this.selctedRecord.push(selectedRows[i].Id);
        }
        console.log('delete----> ',this.selctedRecord)
    }

    handleSeachData(event){
        this.searchValue = event.detail;
        searchResult({key : this.searchValue})
        .then((result)=>{
            this.data = result;
        })
        .catch((error)=>{
            this.error = error;
        })
    }

    deleteRecord(){
        console.log('deleting record')
        if(this.selctedRecord){
            deleteEmployee({empList : this.selctedRecord})
            .then((result)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'success!!',
                        message: 'Record deleted',
                        variant: 'success',
                    }),
                );
                this.template.querySelector('lightning-datatable').selectedRows = [];
                return refreshApex(this.refreshTable);
            })
            .catch(error => {             
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'error',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
        }
    }
    handleRowAction(event){
        const Id = event.detail.row.Id;
        const row = event.detail.row;
        const action = event.detail.action.name;
        console.log('action  ',action);
        if(action == 'edit'){
            this.showEditRecord(Id);
        }
        else if(action == 'delete'){
            console.log('delete records')
            this.selctedRecord.push(row);
            console.log('record--->',this.selctedRecord)
            this.deleteRecord();
        }
        
    }
    showEditRecord(recordId){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Employee__c',
                actionName: 'edit'
            }
        })
    }
    refresh(){
        return refreshApex(this.refreshTable);
    }
    refreshData(){
        return refreshApex(this.refreshTable);
    }
}