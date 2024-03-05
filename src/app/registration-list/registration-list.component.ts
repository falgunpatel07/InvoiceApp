import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

interface AnswerSheet {
  Name: string;
  InvoiceNo: string;
  Email: string;
  PhoneNo: string;
  gender: string;
  hobby: string[];
  enquiryDate: Date;
}
@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})



export class RegistrationListComponent implements OnInit{
public dataSource !: MatTableDataSource<User>;
public users!: User[];




@ViewChild(MatPaginator) paginator !: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
// AnswerSheet : string[] = ['Name','enquiryDate','InvoiceNo','Email','PhoneNo','action']
  mastercustomer: any;


  data: Array<User> = [];
  
constructor(private api: ApiService,
  private toast: NgToastService, 
  private router: Router,
  private confirm: NgConfirmService){

}
ngOnInit(): void {
  // this.getUsers();


  this.api.getQuestionPaperList().subscribe((res: any) => {
    console.log('Question paper list:', res);
    this.data = [];
    console.log(res)
    for (let i = 0; i < res.data.items.length; i++) {
      const answerSheetJson = res.data.items[i].answerSheet;
      const answerSheetObj = JSON.parse(answerSheetJson);
      answerSheetObj.id = res.data.items[i].id;
    
     this.data.push(answerSheetObj);
    
  console.log(this.data);
    }



    
    // this.data = res.data.items.map((item: { answerSheet: string }) => {
    //   const answerSheet: AnswerSheet = JSON.parse(item.answerSheet);
    //   return {
    //     Name: answerSheet.Name,
    //     InvoiceNo: answerSheet.InvoiceNo,
    //     Email: answerSheet.Email,
    //     PhoneNo: answerSheet.PhoneNo,
    //     gender: answerSheet.gender,
    //     hobby: answerSheet.hobby.join(', '),
    //     enquiryDate: answerSheet.enquiryDate
    //   };
      
    // });
    // Do something with the response data
  }, error => {
    console.log('Error:', error);
    // Handle error response
  });


}
// getUsers(){
//   this.api.getRegisteredUser()
//   .subscribe(res=>{
//     this.users = res;
//     this.dataSource = new MatTableDataSource(this.users);
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;


//   })
// }











applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}


edit(id:number){
this.router.navigate(['update',id]);
 
}






delete(id: number){


  this.confirm.showConfirm("Are you sure want to delete?",
 ()=>{
  console.log(id)
  this.api.deleteQuestionPaper(id).subscribe(res=>{
    this.toast.success({detail:"Sucess",summary:"Deleted Successfully",duration:3000});
   
    const index = this.data.findIndex(item => item.id === id);
  if (index !== -1) {
    this.data.splice(index, 1);
  }
  })
 },

 
 ()=>{

 },

  )
  

}
isArray(value: any): boolean {
  return Array.isArray(value);
}









}
