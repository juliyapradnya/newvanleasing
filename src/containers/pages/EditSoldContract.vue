<template>
  <b-modal
    id="modalEditSold"
    ref="modalEditSold"
    :title="$t('contract.edit-sold')"
    modal-class="modal-right"
  >
    <div v-if="isProcessing" class="bg-white pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-50 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>
   
    <b-form
      id="addContractForm"
      class="av-tooltip tooltip-right-bottom"
      label="Bottom Right"
      @submit.prevent="onAddContractSubmit"
      >
      <b-form-group :label="$t('contract.agreement-number')" class="has-top-label">
        <v-select
          label="id"
          v-model="$v.form.id_sales_order.$model"
          :filterable="false"
          :options="optionData"
          @search="fetchOptions"
          :dir="direction"
        >
          <template slot="no-options">type to search Aggrement number..</template>
          <template slot="option" slot-scope="option">
            <div class="d-center">
              {{ option.agreement_number }}
            </div>
          </template>
          <template slot="selected-option" slot-scope="option">
            <div class="selected d-center">
              {{ itemReturn }}
            </div>
          </template>
          <template slot="spinner" slot-scope="spinner">
            <div class="spinner-border text-primary" v-show="spinner"></div>
          </template>
        </v-select>
        <div v-if="!$v.form.id_sales_order.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.id_sales_order.$error && !$v.form.id_sales_order.required }"
        >This field is required</div>
      </b-form-group>
      <b-form-group :label="$t('contract.vehicle-registration')" class="has-top-label">
        <v-select
          label="id"
          v-model="$v.form.id_purchase_order.$model"
          :filterable="false"
          :options="optionCars"
          @search="fetchCars"
          :dir="direction"
        >
          <template slot="no-options">type to search Vehicale registration number..</template>
          <template slot="option" slot-scope="option">
            <div class="d-center">
              {{ option.vehicle_registration }}
            </div>
          </template>
          <template slot="selected-option" slot-scope="option">
            <div class="selected d-center">
              {{ itemSold }}
            </div>
          </template>
          <template slot="spinner" slot-scope="spinner">
            <div class="spinner-border text-primary" v-show="spinner"></div>
          </template>
        </v-select>
        <div v-if="!$v.form.id_purchase_order.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.id_purchase_order.$error && !$v.form.id_purchase_order.required }"
        >This field is required</div>
      </b-form-group>
      <div class="form-group has-top-label">
        <datepicker
          :bootstrap-styling="true"
          v-model="$v.form.vehicle_sold_date.$model"
        ></datepicker>
        <span>{{ $t('contract.sold-date') }}</span>
        <div
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.vehicle_sold_date.$error && !$v.form.vehicle_sold_date.required }"
        >Please select a date</div>
      </div>
      <b-form-group :label="$t('contract.sold-price')" class="has-top-label">
        <b-input-group>
          <money v-model="$v.form.sold_price.$model" v-bind="money" class="form-control" :state="!$v.form.sold_price.$error"></money>
        </b-input-group>
        <div v-if="!$v.form.sold_price.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.sold_price.$error && !$v.form.sold_price.required }"
        >This field is required!</div>
        <div v-if="!$v.form.sold_price.maxValue"
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.sold_price.$error && !$v.form.sold_price.maxValue }"
        >Value must be greater than zero</div>
      </b-form-group>
    </b-form>

    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('modalEditSold')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :class="{
          'btn-multiple-state': true,
          'show-spinner': status === 'processing',
          'show-success': status === 'success',
          'show-fail': status === 'fail'
        }"
        variant="primary" type="submit" form="addContractForm"
        :disabled="status != 'default' || this.$v.$anyError">
        <span class="spinner d-inline-block">
          <span class="bounce1"></span>
          <span class="bounce2"></span>
          <span class="bounce3"></span>
        </span>
        <span class="icon success">
          <i class="simple-icon-check"></i>
        </span>
        <span class="icon fail">
          <i class="simple-icon-exclamation"></i>
        </span>
        <span v-if="buttonTitle" class="label">
          {{ buttonTitle }}
        </span>
        <span v-else class="label">
          {{ $t('pages.submit') }}
        </span>
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import axios from 'axios'
import { apiUrl } from "../../constants/config";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { getDirection } from "../../utils";
import { Money } from 'v-money';
import Datepicker from "vuejs-datepicker";
import {
  validationMixin
} from "vuelidate";
const {
  required
} = require("vuelidate/lib/validators");
const greaterThanZero = (value) => value > 0;

export default {
  components: {
    "v-select": vSelect,
    "datepicker": Datepicker,
    "money": Money
  },
  props: ["selectedItem"],
  data() {
    return {
      buttonTitle: "",
      isProcessing: false,
      status: "default",
      message: "",
      optionData: [],
      optionCars: [],
      vehiclesolds: [],
      direction: getDirection().direction,
      
      form: {
        id_sales_order: "",
        id_purchase_order: "",
        vehicle_return_date: "",
        sold_price: ""
      },
      editId: "",
      tempSalesOrder: "",
      tempPurchaseOrder: "",
      tempOrderNumber: "",
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '£ ',
        precision: 2,
        masked: false
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      id_sales_order: { required },
      id_purchase_order: { required },
      vehicle_sold_date: { required },
      sold_price: {
        required,
        maxValue: greaterThanZero
      }
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    objectToFormData(obj) {
      const formData = new FormData();

      Object.entries(obj).forEach(([key, value]) => {
        formData.append(key, value);
      });

      return formData;
    },
    fetchOptions(search, loading) {
      let url = apiUrl + "/rehiringorder?per_page=99&search=" + encodeURI(search);
      loading(true);
      setTimeout(() => {
        axios
          .get(url)
          .then(r => r.data)
          .then(res =>  {
            this.optionData = res.data.data
          }).catch(_error => {
            console.log(_error)
          }).finally(() => {
            loading(false);
          })
      }, 1000);
    },
    fetchCars(search, loading) {
      let url = apiUrl + "/showvehiclenumberexceptsold?per_page=99&search=" + encodeURI(search);
      loading(true);
      setTimeout(() => {
        axios
          .get(url)
          .then(r => r.data)
          .then(res =>  {
            this.optionCars = res.data.data
          }).catch(_error => {
            console.log(_error)
          }).finally(() => {
            loading(false);
          })
      }, 1000);
    },
    getReturnData(array) {
      this.$refs.modalEditSold.show()
      this.editId = array.id
      this.form.id_sales_order = array.agreement_number
      this.form.id_purchase_order = array.vehicle_registration
      this.form.vehicle_sold_date = array.vehicle_sold_date
      this.form.sold_price = array.sold_price
      this.tempSalesOrder = array.id_sales_order
      this.tempPurchaseOrder = array.id_purchase_order
    },
    onAddContractSubmit() {
      let url = apiUrl + "/vehiclesold/" + this.editId;
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      let salesId = this.form.id_sales_order.id_sales_order;
      let purchaseId = this.form.id_purchase_order.id;
      const soldContract = {
        id_sales_order: (salesId == undefined) ? this.tempSalesOrder : salesId,
        id_purchase_order: (purchaseId == undefined) ? this.tempPurchaseOrder : purchaseId,
        vehicle_sold_date: this.formatDate(this.form.vehicle_sold_date),
        sold_price: this.form.sold_price
      }
      // console.log(soldContract);
      this.$v.form.$touch();
      this.isProcessing = true;
      this.status = "processing";
      axios
        .put(url, soldContract, config)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "Your data was saved!";
          setTimeout(() => {
            this.hideModal('modalEditSold');
          }, 1500)
        }).catch(_error => {
          this.status = "fail";
          this.message = "An error occured while saving the data. Please try again later.";
          setTimeout(() => {
            this.isProcessing = false;
            this.status = "default";
            this.buttonTitle = "Try again"
          }, 1000)
        })
    },
    hideModal(refname) {
      this.status = "default"
      this.$refs[refname].hide()
      setTimeout(() => {
        this.$emit('added-data-table')
      }, 1500)
    }
  },
  computed: {
    itemReturn() {
      if(typeof this.form.id_sales_order === 'object') {
        return this.form.id_sales_order.agreement_number
      } else {
        return this.form.id_sales_order
      }
    },
    itemSold() {
      if(typeof this.form.id_purchase_order === 'object') {
        return this.form.id_purchase_order.vehicle_registration
      } else {
        return this.form.id_purchase_order
      }
    }
  }
};
</script>

