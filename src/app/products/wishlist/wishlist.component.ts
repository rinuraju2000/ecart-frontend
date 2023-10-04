import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{

  allWishlist:any={};//To hold all wishlist items
  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.viewWishlist().subscribe((result:any)=>{
      console.log(result);//wishlist products details
      this.allWishlist=result

    },(result:any)=>{
      console.log(result.error)
    })
  }

  //delete wishlist item from product
  deleteWishlistItem(id:any){
    this.api.deleteWishlistProduct(id).subscribe((result:any)=>{
      this.allWishlist=result//Assign remaining wishlist items to wishlist
      alert("Product removed successfully")
    })
  }
  
}
