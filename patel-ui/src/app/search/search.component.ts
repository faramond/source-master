import { Component } from '@angular/core';
import { Search } from './search';
import { ShareService } from '../share/share.service';
import { SearchTableDataSource } from './search-table-datasource'
import { log, scrub } from '../app';
import { of } from 'rxjs';
import { finalize, mergeMap, tap } from 'rxjs/operators';
import { SearchService } from './search.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cart, Domain } from './search';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    dataSource: SearchTableDataSource;
    searchFormGroup: FormGroup;
    paymentFormGroup: FormGroup;
    paymentDetailsFormGroup: FormGroup;
    panelOpenState = false;
    cartValue: number = 0;
    showpaymentScreen: boolean = false;
    showCart: boolean = false;
    alreadyAdded: boolean = false;
    showPaymentDetails: boolean = false;
    checkbox: boolean = false;
    searchresult: Cart[] = [];
    domain = [];
    mockdata = [
        { id: '1', name: 'abc', price: 20 },
        { id: '2', name: 'def', price: 20 },
        { id: '3', name: 'ajghi', price: 20 }
    ]
    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, public shareService: ShareService, private searchService: SearchService,
        private router: Router) {
        log(this).construct();
        this.searchFormGroup = formBuilder.group({
            search: [null, Validators.required]
        });
        this.paymentFormGroup = formBuilder.group({
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            mobile: [null, Validators.required],
            email: [null, Validators.required],
            cardNumber: [null, Validators.required],
            nameOnTheCard: [null, Validators.required],
            cvv: [null, Validators.required],
            expire: [null, Validators.required],
            total: [0, Validators.required],
            checkbox: [false, Validators.required],
            doaminNames: [[]]

        });
    }

    onCart() {
        this.shareService.check = true;
        this.showCart = true;
        this.showpaymentScreen = false;
    }

    onBack() {
        this.showCart = false;
        this.showpaymentScreen = false;
        this.showPaymentDetails = false;
    }

    onAddToCart(data) {
        this.alreadyAdded = false;
        if (this.shareService.cart.length > 0) {
            for (let i = 0; i < this.shareService.cart.length; i++) {
                if (this.shareService.cart[i].id === data.id) {
                    this.shareService.snack('Already added')
                    this.alreadyAdded = true;
                }
            }
            if (this.alreadyAdded === false) {
                this.cartValue = this.cartValue + 1;
                this.shareService.cart.push(data)
                this.shareService.snack('Item added to cart')
                console.log(this.shareService.cart)
            }
        } else {
            this.cartValue = this.cartValue + 1;
            this.shareService.cart.push(data)
            this.shareService.snack('Item added to cart')
            console.log(this.shareService.cart)

        }
    }

    onRemove(data) {
        const i = this.shareService.cart.indexOf(data.id);
        this.shareService.cart.splice(i, 1);
        this.cartValue = this.cartValue - 1;
        console.log('hello ' + JSON.stringify(this.shareService.cart));
        if (this.cartValue === 0) {
            this.showpaymentScreen = false;
            this.showCart = false
            this.showPaymentDetails = false;
            this.shareService.cart = [];
        }
    }

    onBuy() {
        alert('buy');
    }

    onSearch() {
        of(scrub(this.searchFormGroup)).pipe(
            tap(() => this.shareService.spinner().start()),
            mergeMap(value => this.searchService.read(value)),
            finalize(() => this.shareService.spinner().stop())
        ).subscribe(next => {
            this.searchresult = next;
            //this.dataSource.setItems(next);
        }, error => this.shareService.snack(error));
    }

    onPayment() {
        this.showPaymentDetails = true;
        this.showCart = false;
        var total = 0;
        for (let i = 0; i < this.shareService.cart.length; i++) {
            console.log(this.shareService.cart[i])
            total = this.shareService.cart[i].price + total;
            this.domain.push(this.shareService.cart[i].name)
        }
        this.paymentFormGroup.get('total').setValue(total);
        this.paymentFormGroup.get('doaminNames').setValue(this.domain);
    }

    onSingleBuy(data) {
        this.showPaymentDetails = true;
        this.showCart = false;
        this.shareService.cart.push(data)
        this.cartValue = this.cartValue + 1;
        this.domain.push(data.name)
        this.paymentFormGroup.get('total').setValue(data.price);
        this.paymentFormGroup.get('doaminNames').setValue(this.domain);
    }

    onPurchase() {

        of(scrub(this.paymentFormGroup)).pipe(
            tap(() => this.shareService.spinner().start()),
            mergeMap(value => this.searchService.payment(value)),
            finalize(() => this.shareService.spinner().stop())
        ).subscribe(next => {
            this.searchresult = next;
            this.createDomain();
            //this.dataSource.setItems(next);
        }, error => this.shareService.snack(error));
    }

    createDomain() {
        for (let i = 0; i < this.shareService.cart.length; i++) {
            const domain = new Domain;
            domain.domainName = this.searchFormGroup.get('search').value;
            domain.currancy = '$';
            domain.email = this.shareService.cart[i].name;
            domain.price = this.shareService.cart[i].price;
            of(scrub).pipe(
                tap(() => this.shareService.spinner().start()),
                mergeMap(() => this.searchService.createDomain(domain)),
                finalize(() => this.shareService.spinner().stop())
            ).subscribe(next => {
            }, error => this.shareService.snack(error));
        }
        this.showpaymentScreen = false;
        this.showCart = false
        this.showPaymentDetails = false;
        this.searchresult = [];
        this.shareService.cart = [];
        this.cartValue = 0;
        this.paymentFormGroup.reset()
        this.searchFormGroup.reset()
        this.shareService.snack('Domains created successfully...')
    }

    onCancelPurchase() {
        this.showPaymentDetails = false;
        this.showCart = true;
        this.paymentFormGroup.reset()
    }

    onLogout() {
        this.router.navigate(['login']);
    }
}
