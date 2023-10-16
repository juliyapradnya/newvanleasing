<template>
  <b-tabs
    nav-class="separator-tabs ml-0 mb-5"
    content-class="tab-content"
    v-model="tabIndex"
    :no-fade="false"
    key="itemList"
  >
    <b-tab>
      <template #title>
        <p>{{ $t('contract.return') }} <b-badge variant="light"></b-badge></p>
      </template>
      <tab-contract-return />
    </b-tab>
    <b-tab>
      <template #title>
        <p>{{ $t('contract.sold') }} <b-badge variant="light"></b-badge></p>
      </template>
      <h3>Contract Sold</h3>
    </b-tab>
  </b-tabs>
</template>
<script>
import TabContractReturn from "../../../containers/tabs/contract/TabContractReturn";
// import DeleteItemModal from "../../../containers/pages/DeleteItemModal";

export default {
  props: ["title"],
  components: {
    "tab-contract-return": TabContractReturn
  },
  data() {
    return {
      tabIndex: 0
    };
  }
};
</script>