<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('performance.header')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx sm="12" lg="4" class="mb-4">
        <gradient-with-radial-progress-card
          icon="iconsminds-inbox-out"
          :title="`${ totalHiredVehicle } ${$t('performance.vehicle-hired')}`"
          :detail="$t('performance.last-30days')"
          :percent="`${ totalHiredVehicle }`*100/12"
          :progressText="`${ totalHiredVehicle }/${ items.length }`"
        />
      </b-colxx>
      <b-colxx sm="12" lg="4" class="mb-4">
        <gradient-with-radial-progress-card
          icon="iconsminds-basket-coins"
          :title="`£ 40000`"
          :detail="$t('performance.card-2')"
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
        <b-card :title="$t('performance.list')">
          <vuetable ref="vuetable" class="responsive-table" :api-url="apiBase" :query-params="makeQueryParams"
            :per-page="perPage" :reactive-api-url="true" :fields="fields" data-path="data.data" pagination-path="data"
            @vuetable:pagination-data="onPaginationData">
            <template slot="action" slot-scope="props">
              <div>
                <b-button @click="openEditModal(props.rowData)" variant="light" class="mr-1" size="sm">View details</b-button>
              </div>
            </template>
          </vuetable>
        </b-card>
        <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
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

export default {
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "gradient-with-radial-progress-card": GradientWithRadialProgressCard,
    "sold-vehicle-chart-card": SoldVehicleChartCard,
    "hired-vehicle-chart-card": HiredVehicleChartCard
  },
  data() {
    return {
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
    fetchData() {
      let url = apiUrl + "/showvehiclenumberexceptsold?per_page=99"
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          // console.log(res.data.data)
          this.items = res.data.data
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
      this.items = paginationData.data;
      this.itemsCount = this.items.length;
      // this.$emit("mounted-sold-tab", this.itemsCount);
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
  },
  computed: {
    totalHiredVehicle() {
      return this.items.filter(x => x.status_next_step == 'Hired').length
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>