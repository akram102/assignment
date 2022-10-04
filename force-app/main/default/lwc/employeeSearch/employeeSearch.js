import { LightningElement, track } from 'lwc';

export default class EmployeeSearch extends LightningElement {

    searchValue

    handleSearchValue(event){
        this.searchValue = event.detail.value;
        
    }
    handleSearch(){
        
        const custom = new CustomEvent('search',
        {
            detail : this.searchValue
        });
        this.dispatchEvent(custom);
        console.log('resu ',this.searchEmployee)
    }
}