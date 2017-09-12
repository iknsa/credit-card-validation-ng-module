/**
 * Created by iKNSA.
 * Author: Khalid Sookia <khalidsookia@gmail.com>
 * Date: 10/09/17
 */
import {AbstractControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

const CC_TYPE_VISA = 'visa';
const CC_TYPE_MASTER = 'master';
const CC_TYPE_AMEX = 'amex';
const CC_TYPE_DISCOVER = 'discover';
const CC_TYPE_DINERS = 'diners';
const CC_TYPE_JCB = 'jcb';
let CC_TYPE = '';
let CVV_LENGTH = 3;

export function validateCreditCardMonth(): any {
    return (control: AbstractControl): { [key: string]: any} => {

        return Observable
            .of(control.value < 13 && control.value > 0)
            .map(result => !!result ? null : {creditCardMonth: true})
    }
}

export function validateCreditCardYear(): any {
    return (control: AbstractControl): { [key: string]: any} => {

        const min = new Date().getFullYear();
        const max = new Date().getFullYear() + 20;

        return Observable
            .of(parseInt(control.value) <= parseInt(max.toString().substr(-2)) && parseInt(control.value) >= parseInt(min.toString().substr(-2)))
            .map(result => !!result ? null : {creditCardMonth: true})
    }
}

export function validateCreditCardCVV():any {
    return (control: AbstractControl): { [key: string]: any} => {

        return Observable
            .of(CC_TYPE !== '' && control.value.length === CVV_LENGTH)
            .map(result => !!result ? null : {creditCardCVV: true})
    }
}

export function validateCreditCardNumber():any {
    return (control: AbstractControl): { [key: string]: any } => {
        /**
         * Visa :- Starting with 4, length 13 or 16 digits.
         * American Express :- Starting with 34 or 37, length 15 digits.
         * MasterCard :- Starting with 51 through 55, length 16 digits.
         * Discover :- Starting with 6011, length 16 digits or starting with 5, length 15 digits.
         * Diners Club :- Starting with 300 through 305, 36, or 38, length 14 digits.
         * JCB :- Starting with 2131 or 1800, length 15 digits or starting with 35, length 16 digits.
         *
         * @type {RegExp}
         */
        const regex = new RegExp("^[1-5][0-9]{12,15}$");

        getCardType(control.value);

        control["cc_type"] = CC_TYPE;

        return Observable
            .of(regex.test(control.value) && luhn10(control.value) && CC_TYPE !== '')
            .map(result => !!result ? null : { creditCardNumber: true });
    };
}

/**
 * Visa :- Starting with 4, length 13 or 16 digits.
 * American Express :- Starting with 34 or 37, length 15 digits.
 * MasterCard :- Starting with 51 through 55, length 16 digits.
 * Discover :- Starting with 6011, length 16 digits or starting with 5, length 15 digits.
 * Diners Club :- Starting with 300 through 305, 36, or 38, length 14 digits.
 * JCB :- Starting with 2131 or 1800, length 15 digits or starting with 35, length 16 digits.
 *
 * @param {string} cardNumber
 */
function getCardType(cardNumber:string) {
    CC_TYPE = '';
    CVV_LENGTH = 3;

    if (cardNumber.substr(0,1) === '4') {
        CC_TYPE = CC_TYPE_VISA;

        return;
    }

    if (cardNumber.substr(0,2) === '34' || cardNumber.substr(0,2) === '37') {
        CC_TYPE = CC_TYPE_AMEX;
        CVV_LENGTH = 4;

        return;
    }

    if (new RegExp("^(5[1-5])").test(cardNumber)) {
        if (cardNumber.length === 16) {
            CC_TYPE = CC_TYPE_MASTER;
        }

        if (cardNumber.length === 15) {
            CC_TYPE = CC_TYPE_DISCOVER;
        }
    }

    if (cardNumber.substr(0, 4) === '6011') {
        CC_TYPE = CC_TYPE_DISCOVER;

        return;
    }

    if (cardNumber.substr(0, 2) === '36' || cardNumber.substr(0, 2) === '37' ||
        new RegExp("^30[0-5]").test(cardNumber)) {
        CC_TYPE = CC_TYPE_DINERS;

        return;
    }

    if (cardNumber.substr(0, 4) === '2131' || cardNumber.substr(0, 4) === '1800' ||
        cardNumber.substr(0, 4) === '35') {
        CC_TYPE = CC_TYPE_JCB;
    }
}

function luhn10(identifier:string) {
    let sum = 0;
    let alt = false;
    let i = identifier.length - 1;
    let num;

    while (i >= 0) {
        num = parseInt(identifier.charAt(i), 10);

        if (alt) {
            num *= 2;
            if (num > 9) {
                num = (num % 10) + 1; // eslint-disable-line no-extra-parens
            }
        }

        alt = !alt;

        sum += num;

        i--;
    }

    return sum % 10 === 0;
}
