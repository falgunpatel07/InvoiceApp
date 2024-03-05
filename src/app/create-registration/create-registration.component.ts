import { Component, OnInit } from '@angular/core';
import { FormGroup,FormArray,Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit{
public HobbiesList: String[] =[
  "Singing",
  "Travelling",
  "dancing",
  "sports",
  "watchingTV",
  "Swimming"
];

public registerForm !: FormGroup;
public userIdToUpdtae !: number;
public isUPdateActive : boolean = false;
private mastercustomer: any;
 public editinvdetail : any;
productsdetails !: FormArray<any>;
constructor(private fb: FormBuilder,
  private activatedRoute: ActivatedRoute,
  private api: ApiService,
private router: Router,

  private toastService: NgToastService){

}
ngOnInit(): void {
  this.registerForm = this.fb.group({
   
    Name: ['', Validators.required],// add this control
    InvoiceNo: [''],
    Email: ['', [Validators.required, Validators.email]],
    PhoneNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    gender: [''],
    item: [''],
    hobby: [''],
    enquiryDate: [''],
    products: this.fb.array([]),
    totalAmount: [''],

  });

  this.activatedRoute.params.subscribe(val=>{
    this.userIdToUpdtae = val['id'];




    console.log(this.userIdToUpdtae)

    this.api.getQuestionPaper(this.userIdToUpdtae).subscribe((res: any)=>{
      this.isUPdateActive = true;
const answerSheetJson = res.data.answerSheet;
const answerSheetObj = JSON.parse(answerSheetJson);
console.log(res);
console.log(answerSheetObj);
console.log(answerSheetObj.products);
console.log(answerSheetObj.products[0]);
console.log(answerSheetObj.totalAmount);
this.fillFormToUpdate(answerSheetObj);
    })
  })

  

}
onsubmit(){


  if (this.registerForm.invalid) {
    return;
  }
  console.log(this.registerForm.value);
  

  this.api.login().subscribe(res=>{
    this.mastercustomer=res;
     
    }) 

    const user: User = this.registerForm.value;

    // make the API call
    this.api.postQuestionPaper(user).subscribe(
      response => {
        // handle successful response from the server
      },
      error => {
        // handle error response from the server
      }
    );
    this.router.navigate(['list'])
}

update(){
  console.log(this.registerForm.value)

 const user: User = this.registerForm.value;
    
  this.api.putQuestionPaper(this.userIdToUpdtae,user).subscribe(res=>{

    this.toastService.success({detail:"Sucess",summary:"Enquiry Updated",duration:3000})
    this.registerForm.reset();
  this.router.navigate(['list'])
  }) 
  
} 


SetEditInfo(id: any){

  
}







fillFormToUpdate(user : User){
  
  const productsArray = user.products as any[]; // Assuming `products` is an array of type `any`
  const productDetailsArray = this.registerForm.get('products') as FormArray<any>;

  for (let i = 0; i < productsArray.length; i++) {
    const product = productsArray[i];
    const row = this.setRowValues(product.productName, product.quantity, product.rate, product.amount);
    productDetailsArray.push(row);
  }
  
this.registerForm.setValue({

  Name: user.Name,
  InvoiceNo: user.InvoiceNo,
  Email: user.Email,
  PhoneNo: user.PhoneNo,
  gender: user.gender,
  item: user.item,
  hobby: user.hobby,
  enquiryDate: user.enquiryDate,
  products:productDetailsArray,
  totalAmount:user.totalAmount
})



}
addproduct(){
  this.productsdetails = this.registerForm.get('products') as FormArray<any>;
  this.productsdetails.push(this.generateRow());
}


callrow(){
  
}

setRowValues(productName: string, quantity: number, rate: number, amount: number) {
  return this.fb.group({
    productName: this.fb.control(productName, Validators.required),
    quantity: this.fb.control(quantity, Validators.required),
    rate: this.fb.control(rate, Validators.required),
    amount: this.fb.control({ value: amount, disabled: true }),
  });
 
}


generateRow(){
  return this.fb.group({
    productName: this.fb.control('', Validators.required),
    quantity: this.fb.control(1, Validators.required),
    rate: this.fb.control(0, Validators.required),
    amount: this.fb.control({ value: 0, disabled: true }),
  });
}



removeProduct(index: number) {
  const productsFormArray = this.registerForm.get('products') as FormArray;
  productsFormArray.removeAt(index);
  this.calculateTotal();
}
calculateamount(index: any) {
  const productsFormArray = this.registerForm.get('products') as FormArray;
  const qt = productsFormArray.at(index).get('quantity')?.value;
  const rate = productsFormArray.at(index).get('rate')?.value;
  const amount = qt * rate;
  productsFormArray.at(index).get('amount')?.setValue(amount);
  this.calculateTotal();
}
calculateTotal() {
  const productsFormArray = this.registerForm.get('products') as FormArray;
  let total = 0;
  for (let i = 0; i < productsFormArray.length; i++) {
    total += productsFormArray.at(i).get('amount')?.value;
  }
  this.registerForm.get('totalAmount')?.setValue(total);
  // console.log(total);
}
get getproducts() {
  return this.registerForm.get('products') as FormArray;
}

generateInvoiceNo() {
  //code to generate invoice number that is an integer
  const id = Math.floor(Math.random() * 1000000000);

  this.registerForm.get('id')?.setValue(id.toString());
}

}
