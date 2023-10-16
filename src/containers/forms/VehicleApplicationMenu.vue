<template>
   <application-menu>
      <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }">
         <div class="p-4">
            <p class="text-muted text-small mb-3">{{ $t('pages.status') }}</p>
            <ul class="list-unstyled mb-4">
               <li class="nav-item">
                  <i :class="items.sum_docdepoth > 0 ? 'simple-icon-check text-success' : 'iconsminds-remove text-primary'" />
                  <span class="d-inline-block">{{ $t('pages.availability') }}</span>
                  <span class="float-right">{{ items.sum_docdepoth > 0 ? 'Available' : 'Hired' }}</span>
               </li>
            </ul>
            <p class="text-muted text-small mb-1">{{ $t('pages.overview') }}</p>
         </div>
      </vue-perfect-scrollbar>
   </application-menu>
</template>


<script>
import ApplicationMenu from "../../components/Common/ApplicationMenu";
export default {
   components: {
      "application-menu": ApplicationMenu
   },
   props: ["items"],
   mounted() {
      document.body.classList.add("right-menu");
   },
   beforeDestroy() {
      document.body.classList.remove("right-menu");
   }
};
</script>
