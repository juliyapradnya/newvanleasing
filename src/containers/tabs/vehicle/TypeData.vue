<template>
  <div>
    <b-form-group v-show="methodsType === 'hire' || methodsType === 'rent'"
    :label="$t('vehicle.funder')"
    class="has-float-label">
      <b-form-input
        type="text"
        v-model.trim="$v.methodsData.funder.$model"
      />
    </b-form-group>
    <b-form-group v-show="methodsType === 'hire'"
    :label="$t('vehicle.interest-type')" class="has-float-label">
      <v-select v-model.trim="$v.methodsData.interestType.$model" :options="selectData" :dir="direction" />
    </b-form-group>
    <b-form-group v-show="methodsType === 'hire'"
    :label="$t('vehicle.interest-rate')"  class="has-float-label">
      <!-- <b-form-input
        type="text"
        v-model.trim="$v.methodsData.interestRate.$model"
        :state="!$v.methodsData.interestRate.$error"
      /> -->
      <money v-model="$v.methodsData.interestRate.$model" v-bind="percent" class="form-control" :state="!$v.methodsData.interestRate.$error"></money>
      <b-form-invalid-feedback v-if="!$v.methodsData.interestRate.numeric">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group v-show="methodsType === 'hire' || methodsType === 'rent'"
    :label="$t('vehicle.terms')"  class="has-float-label">
      <b-form-input
        type="text"
        v-model.trim="$v.methodsData.terms.$model"
        :state="!$v.methodsData.terms.$error"
      />
      <b-form-invalid-feedback v-if="!$v.methodsData.terms.numeric">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group v-show="methodsType === 'hire'"
    :label="$t('vehicle.deposit')"  class="has-float-label">
      <!-- <b-form-input
        type="text"
        v-model.trim="$v.methodsData.deposit.$model"
        :state="!$v.methodsData.deposit.$error"
      /> -->
      <money v-model="$v.methodsData.deposit.$model" v-bind="money" class="form-control" :state="!$v.methodsData.deposit.$error"></money>
      <b-form-invalid-feedback v-if="!$v.methodsData.deposit.numeric">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group v-show="methodsType === 'hire'"
    :label="$t('vehicle.monthly-repayment')"  class="has-float-label">
      <!-- <b-form-input
        type="text"
        v-model.trim="$v.methodsData.monthlyRepay.$model"
        :state="!$v.methodsData.monthlyRepay.$error"
      /> -->
      <money v-model="$v.methodsData.monthlyRepay.$model" v-bind="money" class="form-control" :state="!$v.methodsData.monthlyRepay.$error"></money>
      <b-form-invalid-feedback v-if="!$v.methodsData.monthlyRepay.decimal">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group v-show="methodsType === 'hire' || methodsType === 'cash'"
    :label="$t('vehicle.final-payment')"  class="has-float-label">
      <!-- <b-form-input
        type="text"
        v-model.trim="$v.methodsData.finalPay.$model"
        :state="!$v.methodsData.finalPay.$error"
      /> -->
      <money v-model="$v.methodsData.finalPay.$model" v-bind="money" class="form-control" :state="!$v.methodsData.finalPay.$error"></money>
      <b-form-invalid-feedback v-if="!$v.methodsData.finalPay.decimal">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group v-show="methodsType === 'hire' || methodsType === 'cash'"
    :label="$t('vehicle.documentation-fee')"  class="has-float-label">
      <!-- <b-form-input
        type="text"
        v-model.trim="$v.methodsData.docFee.$model"
        :state="!$v.methodsData.docFee.$error"
      /> -->
      <money v-model="$v.methodsData.docFee.$model" v-bind="money" class="form-control" :state="!$v.methodsData.docFee.$error"></money>
      <b-form-invalid-feedback v-if="!$v.methodsData.docFee.decimal">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group v-show="methodsType === 'hire' || methodsType === 'cash'"
    :label="$t('vehicle.final-fee')"  class="has-float-label">
      <!-- <b-form-input
        type="text"
        v-model.trim="$v.methodsData.finalFee.$model"
        :state="!$v.methodsData.finalFee.$error"
      /> -->
      <money v-model="$v.methodsData.finalFee.$model" v-bind="money" class="form-control" :state="!$v.methodsData.finalFee.$error"></money>
      <b-form-invalid-feedback v-if="!$v.methodsData.finalFee.decimal">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group v-show="methodsType === 'hire' || methodsType === 'cash'"
    :label="$t('vehicle.other-fee')"  class="has-float-label">
      <!-- <b-form-input
        type="text"
        v-model.trim="$v.methodsData.otherFee.$model"
        :state="!$v.methodsData.otherFee.$error"
      /> -->
      <money v-model="$v.methodsData.finalFee.$model" v-bind="money" class="form-control" :state="!$v.methodsData.finalFee.$error"></money>
      <b-form-invalid-feedback v-if="!$v.methodsData.otherFee.decimal">Must be a number</b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { getDirection } from "../../../utils";
import { Money } from 'v-money';

export default {
  components: {
    "v-select": vSelect,
    "money": Money
  },
  inject: ['$v'],
  props: ['methodsData', 'methodsType'],
  data() {
    return {
      vueSelectForm: "",
      direction: getDirection().direction,
      selectData: [
        "Variable",
        "Non HP",
        "Fixed"
      ],
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '£ ',
        precision: 2,
        masked: false
      },
      percent: {
        decimal: ',',
        thousands: '.',
        suffix: ' %',
        precision: 2,
        masked: false
      }
    };
  }
}
</script>