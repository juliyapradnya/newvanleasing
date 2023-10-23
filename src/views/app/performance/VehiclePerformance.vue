<template>
  <div>
    <b-row>
      {{ rentalIncome }}
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('performance.header')" />
        <div class="d-flex justify-content-stretch align-items-center top-right-button-container">
          <i class="h5 simple-icon-calendar mb-0 mr-2" />
          <datepicker
            :bootstrap-styling="true"
            class="mr-2"
            v-model="pastDate"
          ></datepicker>
          <datepicker
            :bootstrap-styling="true"
            :disabled-dates="availableDate"
            calendar-class="r-0"
            v-model="endDate"
          ></datepicker>
        </div>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx sm="12" lg="4" class="mb-4">
        <gradient-with-radial-progress-card
          icon="iconsminds-inbox-out"
          :title="`${ totalHiredVehicle } ${$t('performance.vehicle-hired')}`"
          :detail="$t('performance.last-30days')"
          :percent="`${ totalHiredVehicle }`*100/`${ cars.length }`"
          :progressText="`${ totalHiredVehicle }/${ cars.length }`"
        />
      </b-colxx>
      <b-colxx sm="12" lg="4" class="mb-3">
        <gradient-with-radial-progress-card
          icon="iconsminds-basket-coins"
          :title="`£ 24.000`"
          :detail="$t('performance.card-2')"
          :percent="4*100/10"
          :progressText="`target`"
        />
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx sm="12" md="6" class="mb-4">
        <sold-vehicle-chart-card></sold-vehicle-chart-card>
      </b-colxx>
      <b-colxx sm="12" md="6" class="mb-4">
        <hired-vehicle-chart-card></hired-vehicle-chart-card>
      </b-colxx>
      <b-colxx xxs="12" class="mb-4">
        <b-card :title="$t('performance.top-hired')">
          <vuetable ref="vuetable" class="responsive-table" :api-url="apiBase" :query-params="makeQueryParams"
            :per-page="perPage" :reactive-api-url="true" :fields="fields" data-path="data.data" pagination-path="data"
            @vuetable:pagination-data="onPaginationData">
            <template slot="action" slot-scope="props">
              <div>
                <b-button :to="{ path: `/app/performance/${props.rowData.id}` }" variant="light" class="mr-1" size="sm"><i class="simple-icon-magnifier mr-1" /> View details</b-button>
              </div>
            </template>
          </vuetable>
          <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import axios from 'axios'
import { apiUrl } from "../../../constants/config";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GradientWithRadialProgressCard from "../../../components/Cards/GradientWithRadialProgressCard";
import SoldVehicleChartCard from "../../../containers/dashboards/SoldVehicleChartCard";
import HiredVehicleChartCard from "../../../containers/dashboards/HiredVehicleChartCard";
import Datepicker from "vuejs-datepicker";

export default {
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "gradient-with-radial-progress-card": GradientWithRadialProgressCard,
    "sold-vehicle-chart-card": SoldVehicleChartCard,
    "hired-vehicle-chart-card": HiredVehicleChartCard,
    "datepicker": Datepicker
  },
  data() {
    return {
      cars: [],
      items: [],
      apiBase: apiUrl + "/showvehiclenumberexceptsold",
      sort: "",
      order: "",
      page: 1,
      perPage: 8,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      returnCount: 0,
      selectedItem: "",
      componentKey: 0,
      startDate: null,
      endDate: new Date,
      fields: [
        {
          name: "vehicle_registration",
          sortField: "vehicle_registration",
          title: "Registration Number",
          titleClass: "center aligned",
          dataClass: "text-uppercase list-item-heading",
          width: "15%"
        },
        {
          name: "vehicle_manufactur",
          sortField: "vehicle_manufactur",
          title: "Manufacture",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "purchase_method",
          sortField: "purchase_method",
          title: "Funding method",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "hire_purchase_starting_date",
          sortField: "hire_purchase_starting_date",
          title: "Purchase date",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "__slot:action",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
        }
      ],
      sortOrder: [
        {
          field: 'updated_at',
          direction: 'desc'
        }
      ]
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
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
    },
    async fetchData() {
      let date1 = this.formatDate(this.pastDate),
      date2 = this.formatDate(this.endDate),
      url = apiUrl + `/showdashboard/${date1},${date2}`;
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.items = res.data
        }).catch(_error => {
          console.log(_error)
        })
    },
    async onStartChange(date1) {
      let newDate1 = this.formatDate(date1),
      date2 = this.formatDate(this.endDate),
      url = apiUrl + `/showdashboard/${newDate1},${date2}`;
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.items = res.data
        }).catch(_error => {
          console.log(_error)
        })
    },
    async onEndChange(date2) {
      let date1 = this.formatDate(this.pastDate),
      newDate2 = this.formatDate(date2),
      url = apiUrl + `/showdashboard/${date1},${newDate2}`;
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.items = res.data
        }).catch(_error => {
          console.log(_error)
        })
    },
    makeQueryParams(sortOrder, currentPage, perPage) {
      this.isLoading = false;
      return sortOrder[0]
        ? {
          order: sortOrder[0]
            ? sortOrder[0].direction
            : "",
          sort: sortOrder[0]
            ? sortOrder[0].field
            : "",
          page: currentPage,
          per_page: this.perPage,
          search: this.search
        }
        : {
          page: currentPage,
          per_page: this.perPage,
          order: this.sortOrder[0].direction,
          sort: this.sortOrder[0].field,
          search: this.search
        };
    },
    onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
  },
  computed: {
    totalHiredVehicle() {
      return this.items.filter(x => x.status_next_step == 'Hired').length
    },
    pastDate: {
        get (val) {
          let past = new Date();
          return past.setDate(past.getDate() - 30)
        },
        set (val) {
          this.startDate = val            
        }
    },
    availableDate() {
      let dates = {
        to: new Date(this.startDate)
      }
      return dates
    },
   rentalIncome() {
    let total = this.items.map(x => x.monthly_payment)
    return total
   }
  },
  watch: {
    startDate(newId, oldId) {
      if(newId) {
        this.onStartChange(newId)
      }
    },
    endDate(newId, oldId) {
      if(newId) {
        this.onEndChange(newId)
      }
    }
  },
  mounted() {
    this.fetchCars()
    this.fetchData()
  }
}
</script>