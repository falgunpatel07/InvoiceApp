import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  public userID !: number;
  userDetail !: User;
answerSheetObj!: User;

  constructor(private activatedRoute: ActivatedRoute,private api:ApiService){

  }
ngOnInit(): void{
this.activatedRoute.params.subscribe(val=>{
  this.userID = val['id'];
  this.fetchUserDetails(this.userID);
})
}

fetchUserDetails(userID: number){
  this.api.getQuestionPaper(userID).subscribe(res=>{
    this.userDetail = res;
    console.log(this.userDetail);
    const answerSheetJson = res.data.answerSheet;
const answerSheetObj = JSON.parse(answerSheetJson);
console.log(answerSheetObj)
console.log(answerSheetObj.Name)
this.userDetail = answerSheetObj;
console.log(answerSheetObj.totalAmount)
console.log(answerSheetObj.products)
for (let i = 0; i < answerSheetObj.products.length; i++) {
  console.log(answerSheetObj.products[i].productName);
}

  })
}
}
