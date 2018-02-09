import { Injectable } from '@angular/core';
import { Web3Service } from './../web-3/web-3.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ButtcoinService {

  private balanceSource: Subject<number> = new Subject<number>();

  get balance$(): Observable<number> {
    return this.balanceSource.asObservable();
  }

  constructor(private web3Service: Web3Service) {}

  getButtcoinFactoryContract(): Promise<any> {
    return this.web3Service
      .getContract('buttcoin-factory')
      .then(contract => contract.deployed());
  }

  getButtcoinContract(): Promise<any> {
    return this.getButtcoinFactoryContract()
      .then((buttcoinFactoryContract) => {
        return this.web3Service
          .getContract('buttcoin')
          .then((ButtcoinContract) => {
            ButtcoinContract.setProvider(this.web3Service.web3Provider);
            return buttcoinFactoryContract.buttcoin.call().then((addr, err) => {
              return ButtcoinContract.at(addr);
            });
          });
      });
  }

  onBalanceUpdated(balance: number) {
    this.balanceSource.next(balance);
  }

  transferFromTo(from, to, value): Promise<boolean> {
    return this.getButtcoinFactoryContract().then((contract) => {
      return contract.transferFrom(from, to, value, {
        from: to
      });
    });
  }

  transfer(to, value): Promise<boolean> {
    return this.getButtcoinContract().then((contract) => {
      return this.web3Service.getAddress().then((address) => {
        return contract.transfer(to, value, {
          from: address
        });
      })
    });
  }

  getOriginalButtcoinAddress(): Promise<string> {
    return this.getButtcoinFactoryContract().then((contract) => {
      return contract.originalAddress();
    });
  }

  getBalance(): Promise<number> {
    return this.getButtcoinContract().then((contract) => {
      return this.web3Service.getAddress().then((address) => {
        return contract.balanceOf(address).then((bigNumberBalance) => {
          const balance = bigNumberBalance.toNumber();
          this.onBalanceUpdated(balance);
          return balance;
        });
      });
    });
  }
}
