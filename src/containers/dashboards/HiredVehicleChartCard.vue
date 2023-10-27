<template>
  <b-card class="dashboard-filled-line-chart" no-body>
    <b-card-body>
      <div class="float-left float-none-xs">
        <div class="d-inline-block">
          <h5 class="d-inline">{{ $t('performance.chart-2') }}</h5>
          <span class="text-muted text-small d-block">{{ $t('dashboards.per-session') }}</span>
        </div>
      </div>
      <b-dropdown
        id="ddown5"
        :text="$t('dashboards.this-week')"
        size="xs"
        variant="outline-primary"
        class="float-right float-none-xs mt-2"
      >
        <b-dropdown-item>{{ $t('dashboards.last-week') }}</b-dropdown-item>
        <b-dropdown-item>{{ $t('dashboards.this-month') }}</b-dropdown-item>
      </b-dropdown>
    </b-card-body>
    <div class="chart card-body pt-0">
      <area-chart :data="areaChartData" container-class="chart" shadow />
    </div>
  </b-card>
</template>
<script>
import axios from 'axios'
import { apiUrl } from "../../constants/config";
import moment from 'moment'
import AreaChart from "../../components/Charts/Area"
import { areaChartData } from "../../data/charts"
import { ThemeColors } from '../../utils'
const colors = ThemeColors()

export default {
  props: ["data"],
  components: {
    "area-chart": AreaChart
  },
  data() {
    return {
      areaChartData,
      cars: []
    };
  },
  methods: {
    formatDate(date) {
      return moment(new Date(date)).format('MMM YY')
    },
    fetchCars() {
      let url = apiUrl + "/purchaseorderall";
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.cars = res.data.data
        }).catch(_error => {
          console.log(_error)
        })
    }
  },
  computed: {
    charData() {
      const dataRental = this.data.map(x => (Number(x.rental_income))),
      dataLabel = this.data.map(x => (this.formatDate(x.hire_purchase_starting_date))),
      hired = {
        labels: ['jun', 'jul', 'aug', 'sep'],
        datasets: [
          {
            label: '',
            data: this.cars.map(x => (Number(x.rental_income))),
            borderColor: colors.themeColor1,
            pointBorderColor: colors.themeColor1,
            pointHoverBackgroundColor: colors.themeColor1,
            pointHoverBorderColor: colors.themeColor1,
            pointRadius: 2,
            pointBorderWidth: 3,
            pointHoverRadius: 2,
            fill: true,
            borderWidth: 3,
            backgroundColor: colors.themeColor2_10
          }
        ]
      };
      return hired
    }
  },
  mounted() {
    // this.fetchCars()
  }
};
</script>
