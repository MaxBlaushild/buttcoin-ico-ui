import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as Contract from 'truffle-contract';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as Web3 from 'web3';
declare var web3: any;

@Injectable()
export class Web3Service {

  private addressSource: Subject<string> = new Subject<string>();

  get address$(): Observable<string> {
    return this.addressSource.asObservable();
  }

  web3: any;
  web3Provider: any;
  contracts = {};
  _address: string = '';

  constructor(private http: Http) {
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    this.web3 = new Web3(this.web3Provider);
  }

  getAddress(): Promise<string> {
    if (this._address) {
      return Promise.resolve(this._address);
    } else {
      return this.web3.eth.getAccounts().then((accounts) => {
        this._address = accounts[0];
        this.onAddressUpdated(this._address);
        return this._address;
      });
    }
  }

  onAddressUpdated(address: string) {
    this.addressSource.next(address);
  }

  private initContract(name): Promise<any> {
    return this.http.get(`assets/contracts/${name}.contract.json`)
        .toPromise()
        .then((res) => {
           const contractJSON = res.json();
           const contract = Contract(contractJSON);
           contract.setProvider(this.web3Provider);
           this.contracts[name] = contract;
           return contract;
         });
  }

  getContract(name): Promise<any> {
    let contract = this.contracts[name];

    if (contract) {
      return Promise.resolve(contract);
    } else {
      return this.initContract(name);
    }
  }

}
