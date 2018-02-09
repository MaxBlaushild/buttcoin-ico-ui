import { Component, OnInit } from '@angular/core';
import { ButtcoinService } from './../../services/buttcoin/buttcoin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  icoAddress: string;

  constructor(private buttoinService: ButtcoinService) { }

  ngOnInit() {
    this.buttoinService.getButtcoinContract().then((contract) => {
      this.icoAddress = contract.address;
    });
  }

}
