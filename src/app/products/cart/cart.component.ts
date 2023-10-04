import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  showpaypalButton:boolean=false;

  showSuccess:boolean=false;

  // Paypal variable
  public payPalConfig?: IPayPalConfig;

  //Used to hide discount coupen
  discountStatus:boolean=false;

  //used to show offers
  offerClick:boolean=false;

  //Used to hide address form
  proceedToPaymentStatus:boolean=false;

  // To hold delivery information
  name:string='';
  houseNumber:string='';
  streetName:string='';
  state:string='';
  pincode:string='';
  mobileNumber:string='';

  allCart:any=[]//To hold cart products

  cartTotalPrice=0;

  constructor(private api:ApiService, private cartfb:FormBuilder){}

  ngOnInit(): void {
    this.api.getCart().subscribe((result:any)=>{
      console.log(result);//Array of products
      this.allCart=result;
      this.getCartTotal()

      //Paypal function
      this.initConfig();
      
    },
    (result:any)=>{
      console.log(result.error);
      
    })
  }
  deleteCartProduct(id:any){
    this.api.deleteCartProduct(id).subscribe((result:any)=>{
      //result? - remaining products
      this.allCart=result;
      this.api.cartCount()//Update cart count
      this.getCartTotal()
    },
    (result:any)=>{
      alert(result.error)
    })
  }

  //Get cart total
  getCartTotal(){
    let total=0;
    this.allCart.forEach((item:any)=>{
      total+=item.grandTotal
      this.cartTotalPrice=Math.ceil(total)
    })
  }

  //Increment cart product
  incrementCartProduct(id:any){
    this.api.incrementProduct(id).subscribe((result:any)=>{
      this.allCart=result
      this.getCartTotal()

    },(result:any)=>{
      alert(result.error)
    })
  }

  //Decrement cart product
  decrementCartProduct(id:any){
    this.api.decrementProduct(id).subscribe((result)=>{
      this.allCart=result
      this.getCartTotal()
    },(result:any)=>{
      alert(result.error)
    })
  }

  //Address form
  addressForm=this.cartfb.group({
    name:[''],
    houseNumber:[''],
    streetName:[''],
    state:[''],
    pinNumber:[''],
    MobileNumber:[''],
})

submitForm(){
  if(this.addressForm.valid){

    this.proceedToPaymentStatus=true;

    this.name=this.addressForm.value.name||'';
    this.houseNumber=this.addressForm.value.houseNumber||'';
    this.streetName=this.addressForm.value.streetName||'';
    this.state=this.addressForm.value.state||'';
    this.pincode=this.addressForm.value.pinNumber||'';
    this.mobileNumber=this.addressForm.value.MobileNumber||'';

  }
  else{
    alert("Please enter a valid details")
  }
}


offerClicked(){
  this.offerClick=true;
}

discountCalculate(value:any){
  this.discountStatus=true
  this.cartTotalPrice=this.cartTotalPrice*(100-value)/100
}

private initConfig(): void {
  this.payPalConfig = {
  currency: 'EUR',
  clientId: 'sb',
  createOrderOnClient: (data) => <ICreateOrderRequest>{
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: '9.99',
          breakdown: {
            item_total: {
              currency_code: 'EUR',
              value: '9.99'
            }
          }
        },
        items: [
          {
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '9.99',
            },
          }
        ]
      }
    ]
  },
  advanced: {
    commit: 'true'
  },
  style: {
    label: 'paypal',
    layout: 'vertical'
  },
  onApprove: (data, actions) => {
    console.log('onApprove - transaction was approved, but not authorized', data, actions);
    actions.order.get().then((details:any) => {
      console.log('onApprove - you can get full order details inside onApprove: ', details);
    });
  },
  onClientAuthorization: (data) => {
    console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    this.showSuccess = true;
  },
  onCancel: (data, actions) => {
    console.log('OnCancel', data, actions);
  },
  onError: err => {
    console.log('OnError', err);
  },
  onClick: (data, actions) => {
    console.log('onClick', data, actions);
  },
};
}

Makepay(){
  this.showpaypalButton=true;
}

}
