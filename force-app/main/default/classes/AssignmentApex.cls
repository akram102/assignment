public with sharing class AssignmentApex {


    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployee(){
        return [select Id,Address__c,Contact__c,Email__c,Employee_Id__c,Name from Employee__c];
    }

    @AuraEnabled
    public static void deleteEmployee(List<Employee__c> empList){
        delete empList;
    }

    @AuraEnabled
    public static List<Employee__c> searchResult(String key){
        String searchParam = '%' + key + '%';
        String queryStr = '';
        if(key != null){
            queryStr = 'select Id,Address__c,Contact__c,Email__c,Employee_Id__c,Name from Employee__c where name like :searchParam';
        }
        List<Employee__c> result = Database.query(queryStr);
        return result;
    }
}
