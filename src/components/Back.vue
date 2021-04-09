<template>
    <div id="back-comp" @click="handler"></div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "Back",
    props: {
        handler: {
            type: Function,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            default: (): void => {},
            required: true,
        },
    },
});
</script>
<style lang="scss" scoped>
#back-comp {
    width: 60px;
    height: 60px;
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
    background-image: url("~static/img/quiz/back.png");
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 50%;
}
#back-comp:active {
    transform: scale(0.9);
}
</style>
