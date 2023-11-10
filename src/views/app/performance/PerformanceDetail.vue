<template>
  <div v-if="isLoading" class="loading" key="itemLoading"></div>
  <div v-else>
    <b-row class="mb-3">
      <b-colxx xxs="12">
        <b-link @click.prevent="$router.go(-1)" class="heading-icon baseline">
          <i class="simple-icon-arrow-left" />
        </b-link>
        <piaf-breadcrumb :heading="vehicle.vehicle_registration" />
        <!-- <div class="separator mb-5"></div> -->
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12" lg="12">
        <performance-card :vehicle="vehicle" />
      </b-colxx>
      <b-colxx xxs="6" lg="3" class="mb-4">
        <b-card class="mb-lg-3" no-body>
          <vehicle-detail-card v-if="vehicle" :vehicle="vehicle" />
        </b-card>
      </b-colxx>
      <b-colxx xxs="6" lg="3" class="mb-4">
        <b-card class="mb-lg-3" no-body>
          <vehicle-cost-card v-if="vehicle" :vehicle="vehicle" />
        </b-card>
      </b-colxx>
      <b-colxx xxs="12" lg="6" class="mb-4">
        <b-card class="mb-lg-3" no-body>
          <contract-history-card v-if="vehicle" :id="$route.params.id" />
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '../../../constants/config';
import VehicleDetailCard from '../../../containers/dashboards/VehicleDetailCard';
import VehicleCostCard from '../../../containers/dashboards/VehicleCostCard';
import PerformanceCard from '../../../containers/dashboards/PerformanceCard';
import ContractHistoryCard from '../../../containers/dashboards/ContractHistoryCard';

export default {
  components: {
    'vehicle-detail-card': VehicleDetailCard,
    'vehicle-cost-card': VehicleCostCard,
    'performance-card': PerformanceCard,
    'contract-history-card': ContractHistoryCard
  },
  data() {
  return {
    isLoading: true,
    vehicle: [],
    report: []
  }
  },
  methods: {
    fetchCar(id) {
      let url = apiUrl + "/listvehicleinvehiclecard/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.isLoading = false
          this.vehicle = res.data.pop()
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  },
  mounted() {
    this.fetchCar(this.$route.params.id)
  }
}
</script>