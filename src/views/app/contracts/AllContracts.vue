<template>
  <b-row>
    <datatable-heading :title="$t('menu.all-contracts')" :changePageSize="changePageSize" :searchChange="searchChange"
      :from="from" :to="to" :total="total" :perPage="perPage" :separator="true">
      <div class="top-right-button-container">
        <b-button v-b-modal.modalright variant="primary" size="lg" class="top-right-button">{{ $t('pages.add-new')
        }}</b-button>
      </div>
      <add-new-contract @added-data-table="onAddedDataTable" :key="componentKey"/>
    </datatable-heading>
    <b-colxx xxs="12">
      <vuetable ref="vuetable" class="table-divided order-with-arrow responsive-table" :api-url="apiBase"
        :query-params="makeQueryParams" :per-page="perPage" :reactive-api-url="true" :fields="fields"
        data-path="data.data" pagination-path="data" @vuetable:pagination-data="onPaginationData">
        <template slot="status" slot-scope="props">
          <b-badge pill :variant="(props.rowData.next_step_status_sales === 'Hired') ? 'primary' : 'light'">{{ props.rowData.next_step_status_sales }}</b-badge>
        </template>
        <template slot="actions" slot-scope="props">
          <div v-if="props.rowData.next_step_status_sales !== 'Innactive'">
            <b-button :to="{ path: `${props.rowData.id}` }" variant="light" class="mr-1" size="sm"><i class="simple-icon-pencil" /></b-button>
            <b-button @click="showDelBox(props.rowData.id)" v-b-modal.modalDeletion variant="danger" size="sm">Delete <i class="simple-icon-trash" /></b-button>
          </div>
          <div v-else>
            <b-button variant="outline-dark" class="mr-1" size="sm" disabled><i class="simple-icon-pencil" /></b-button>
            <b-button variant="outline-dark" size="sm" disabled>Delete <i class="simple-icon-trash" /></b-button>
          </div>
        </template>
      </vuetable>
      <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
      <delete-item-modal :selectedItem="selectedItem" :endpoint="'/salesorder/'" @delete-modal-hide="updateTableRow"></delete-item-modal>
    </b-colxx>
  </b-row>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import { apiUrl } from "../../../constants/config";
import DatatableHeading from "../../../containers/datatable/DatatableHeading";
import AddNewContract from "../../../containers/pages/AddNewContract";
import DeleteItemModal from "../../../containers/pages/DeleteItemModal";

export default {
  props: ["title"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading,
    "add-new-contract": AddNewContract,
    "delete-item-modal": DeleteItemModal
  },
  data() {
    return {
      isLoad: false,
      apiBase: apiUrl + "/salesorder",
      sort: "",
      order: "",
      page: 1,
      perPage: 8,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      selectedItem: null,
      componentKey: 0,
      fields: [
        {
          name: "agreement_number",
          sortField: "agreement_number",
          title: "Aggrement Number",
          titleClass: "center aligned",
          dataClass: "text-uppercase list-item-heading",
          width: "10%"
        },
        {
          name: "vehicle_registration",
          sortField: "vehicle_registration",
          title: "Assigned Vehicle",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "cust_name",
          sortField: "cust_name",
          title: "Customer Name",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "type",
          sortField: "type",
          title: "Contract Type",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "term_months",
          sortField: "term_months",
          title: "Contract Period (Months)",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "10%"
        },
        {
          name: "__slot:status",
          title: "Status",
          titleClass: "center aligned text-center",
          dataClass: "center aligned text-center",
          width: "10%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "",
          dataClass: "center aligned text-right",
          width: "18%"
        }
      ],
      sortOrder: [
        {
          field: 'updated_at',
          direction: 'desc'
        }
      ]
    };
  },
  methods: {
    makeQueryParams(sortOrder, currentPage, perPage) {
      this.selectedItems = [];
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
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    onAddedDataTable() {
      this.componentKey++;
      this.updateTableRow()
    },
    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },
    searchChange(val) {
      this.search = val;
      this.$refs.vuetable.refresh();
    },
    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    },
    showDelBox(id) {
      this.selectedItem = id;
    },
    updateTableRow() {
      this.$refs.vuetable.refresh();
    }
  }
};
</script>