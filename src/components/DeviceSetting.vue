<template>
    <div class="device-setting-container">
        <div class="grid w-full h-full grid-cols-2">
            <RobotStatus @submit="get" :default-robot="props.defaultRobot"/>
            <ControlDashboard :robotType="robotType" :serial-number="serialNumber"/>
        </div>
    </div>
</template>

<style scoped>
.device-setting-container{
    width: 100%;
    height: 100%;
    opacity: 1;
}
</style>

<script setup lang="ts">
import ControlDashboard from "@/components/ControlDashboard.vue"
import RobotStatus from "@/components/RobotStatus.vue"
import { ref, reactive, computed, onMounted, onBeforeMount, watch } from "vue";

const robotType = ref("")
const serialNumber = ref("")
var loading = ref(true)

const props = defineProps<{
  defaultRobot: string,
}>()

function get(type: string, robotName:string){
    robotType.value = type;
    serialNumber.value = robotName;
}

</script>