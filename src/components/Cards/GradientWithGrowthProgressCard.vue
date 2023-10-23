<template>
<b-card class="progress-banner" no-body>
    <b-card-body class="justify-content-between d-flex flex-row align-items-center">
        <div>
            <i :class="`${icon} mr-2 text-white align-text-bottom d-inline-block`" />
            <div>
                <p class="lead text-white">{{ prefix }} {{ title | withcoma }} {{ suffix }}</p>
                <p class="text-small text-white">{{ detail }}</p>
            </div>
        </div>
        <!-- <div v-show="percent" :class="`text-${intent}`" class="progress-bar-circle progress-bar-banner position-relative">
            {{progressText}}
        </div> -->
    </b-card-body>
</b-card>
</template>
<script>
export default {
    props: ['icon', 'title', 'detail', 'percent', 'intent', 'progressText', 'prefix', 'suffix'],
    data() {
        return {
            diameterDefault: 125,
            strokeWidthDefault: 5,
            diameter: this.diameterDefault,
            strokeWidth: this.strokeWidthDefault
        }
    },
    filters: {
        withcoma: function(num) {
            return Number(num).toLocaleString()
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleWindowResize)
        this.handleWindowResize()
    },
    methods: {
        handleWindowResize(event) {
            if (event && !event.isTrusted) {
                return
            }
            const windowWidth = window.innerWidth
            if (windowWidth <= 1200) {
                this.diameter = 84
                this.strokeWidth = 2
            } else {
                this.diameter = this.diameterDefault
                this.strokeWidth = this.strokeWidthDefault
            }
        }
    }
}
</script>
