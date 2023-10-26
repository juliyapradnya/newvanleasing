<template>
  <b-row class="icon-cards-row d-flex justify-content-stretch">
    <b-colxx>
      <icon-card
        :title="$t('performance.income')"
        icon="iconsminds-financial"
        :isComa="true"
        :value="Number(theIncome)"
      />
    </b-colxx>
    <b-colxx>
      <icon-card
        :title="$t('performance.cost')"
        icon="iconsminds-billing"
        :isComa="true"
        :value="Number(theCost)"
      />
    </b-colxx>
    <b-colxx>
      <icon-card
        :title="$t('performance.margin')"
        icon="iconsminds-scale"
        :isComa="true"
        :value="Number(theMargin)"
      />
    </b-colxx>
    <b-colxx>
      <icon-card
        :title="$t('performance.residual')"
        icon="iconsminds-money-bag"
        :isComa="true"
        :value="Number(residualValue)"
      />
    </b-colxx>
    <b-colxx v-show="!isSold">
      <icon-card
        :title="$t('performance.rental-income')"
        icon="iconsminds-pricing"
        :isComa="true"
        :value="Number(rentalIncome)"
      />
    </b-colxx>
    <b-colxx v-show="isSold">
      <icon-card
        :title="$t('performance.sold-price')"
        icon="iconsminds-pricing"
        :isComa="true"
        :value="Number(soldPrice)"
      />
    </b-colxx>
  </b-row>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '../../constants/config';
import IconCard from '../../components/Cards/IconCard';
export default {
  components: {
      'icon-card': IconCard
  },
  props: ['vehicle'],
  data() {
    return {
      totalIncome: 0,
      otherIncome: 0,
      totalCost: 0,
      otherCost: 0,
      residualValue: 0,
      rentalIncome: 0,
      soldPrice: 0,
      isSold: false
    }
  },
  methods: {
    async getTotalIncome(id) {
      let url = apiUrl + "/listtotalincome/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.totalIncome = res.data.sum_total_income
        })
    },
    async getOtherIncome(id) {
      let url = apiUrl + "/listotherincome/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.otherIncome = res.data.sum_other_income
        })
    },
    async getTotalCost(id) {
      let url = apiUrl + "/listtotalcost/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.totalCost = res.data.sum_total_cost
        })
    },
    async getOtherCost(id) {
      let url = apiUrl + "/listothercost/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.otherCost = res.data.sum_other_cost
        })
    },
    async getResidualValue(id) {
      let url = apiUrl + "/listresidualvalue/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.residualValue = (res.data.sum_residual_value == null) ? 0 : res.data.sum_residual_value
        })
    },
    async getRentalIncome(id) {
      let url = apiUrl + "/listrentalincome/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.rentalIncome = (res.data.sum_rental_income == null) ? 0 : res.data.sum_rental_income
        })
    },
    async getSoldPrice(id) {
      let url = apiUrl + "/listsoldprice/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          if(res.data.sum_sold_price !== null) {
            this.isSold = true
            this.soldPrice = res.data.sum_sold_price
          } else {
            this.soldPrice = 0
          }
        })
    }
  },
  computed: {
    theIncome() {
      return (this.otherIncome !== null) ? Math.abs(Number(this.totalIncome) + Number(this.otherIncome))
      : this.totalIncome
    },
    theCost() {
      return (this.otherCost !== null) ? Math.abs(Number(this.totalCost) + Number(this.otherCost))
      : this.totalCost
    },
    theMargin() {
      return Number(this.theIncome) - Number(this.theCost)
    }
  },
  mounted() {
    this.getTotalIncome(this.vehicle.id)
    this.getOtherIncome(this.vehicle.id)
    this.getTotalCost(this.vehicle.id)
    this.getOtherCost(this.vehicle.id)
    this.getResidualValue(this.vehicle.id)
    this.getRentalIncome(this.vehicle.id)
    this.getSoldPrice(this.vehicle.id)
  }
}
</script>