<template>
    <div class="device-list-container">
        <div class="device-function-bar px-[5vw] py-[1vw]">
            <div class="device-search-bar flex justify-between">
                <input class="device-name-input w-5/6 ml-0 m-2 p-3 placeholder:text-white" type="text" placeholder="請輸入裝置名稱">
                <button class="default-fill-btn m-2 p-3">新增裝置</button>
            </div>
            <div class="device-filter-bar flex">
                <el-select v-model="searchFilter" class="mr-5 my-2 p-1 default-fill-selection" placeholder="篩選(類型/場域)" name="" id="">
                    <el-option key="option1" label="option1" value="option1">
                        <span class="default-select-option">option1</span>
                    </el-option>
                    <el-option key="option2" label="option2" value="option2">
                        <span class="default-select-option">option2</span>
                    </el-option>                
                </el-select>
                <el-select class="mx-5 my-2 p-1 default-fill-selection" placeholder="顯示方式" name="" id="">
                    <el-option key="option1" label="option1" value="option1">
                        <span class="default-select-option">option1</span>
                    </el-option>
                    <el-option key="option2" label="option2" value="option2">
                        <span class="default-select-option">option2</span>
                    </el-option>  
                </el-select>
                <button class="default-outline-btn mx-5 my-2 py-1 px-3">勾選並刪除</button>
            </div>
        </div>
        <div class="device-list max-h-[70vh] px-[5vw] py-[1vw] overflow-auto">
                <div class="pt-8" v-loading="loading">
                    <el-checkbox-group class="grid w-full gap-y-10 gap-x-6 grid-cols-3" v-model="currentMachineSNum">
                        <div class="card relative m-1" 
                        v-for="machine in machineList"
                        :key="machine.machineName">
                            <div class="card-title px-5 py-3 flex">
                                <el-checkbox size="large" :key="machine.serialNumber" :label="machine.serialNumber">
                                    <span class="machine-name">{{machine.serialNumber}}</span>
                                </el-checkbox>
                                <router-link :to="'./devices-setting?defaultRobot='+machine.serialNumber" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="default-fill-btn my-2 p-3">查看設定</button>
                                </router-link>
                            </div>
                            <div class="card-body px-5 py-10 flex">
                                <div class="min-h-80 h-80 aspect-w-1 aspect-h-1 overflow-hidden rounded-md aspect-none w-2/3">
                                    <img :src="machine.type.toLowerCase().includes('solar') ?  '../../src/assets/img/solar_robot.svg': '../../src/assets/img/clean_robot.svg'" 
                                    alt="" class="h-full w-full object-contain object-center">
                                </div>
                                <div class="machine-info w-1/3">
                                    <div class="m-4">狀態：正常</div>
                                    <div class="m-4">錯誤：無</div>
                                </div>
                            </div>
                        </div>
                    </el-checkbox-group>
            </div>
        </div>
    </div>
</template>

<style scoped>

.device-list-container{
    height: 100%;
    width: 100%;
    background: transparent linear-gradient(295deg, #181A48 50%, #1E1F3B 95%, #FFE664 130%) 0% 0% no-repeat padding-box;
    opacity: 1;
}

.device-function-bar{
    border-bottom: 1px solid #37778E;
}

.device-name-input{
    background: #121440 0% 0% no-repeat padding-box;
    border-radius: 5px;
    opacity: 1;
    text-align: left;
    font: normal normal normal 14px/16px Helvetica Neue;
    letter-spacing: 0.56px;
    color: #9AE2EA;
}

.card{
    background: #070A3C 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 8px;
    opacity: 1;
}

.card-title{
    text-align: left;
    font: normal normal medium 18px/23px Helvetica Neue;
    letter-spacing: 0px;
    color: #FFFFFF;
    opacity: 0.88;
    border-bottom: 1px solid #FFFFFF;
    align-items: center;
    justify-content: space-between;
}

.machine-name{
    list-style-type: disc;
    font-size: 20px;
    letter-spacing: 0px;
    color: #FFFFFF;
    opacity: 0.88;
}

.machine-info{
    text-align: left;
    font: normal normal normal 14px/16px Helvetica Neue;
    letter-spacing: 0.72px;
    color: #9AE2EA;
    opacity: 1;
}

.card-title-dot{
    background: #E1E1E7 0% 0% no-repeat padding-box;
    border: 2px solid #37778E;
    opacity: 1;
}

</style>


<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeMount, watch } from "vue";
import Api from "@/services/api.service"

var machineList = ref([]);
const searchFilter = ref("")
const loading = ref(true)
const currentMachineSNum = ref([])

onMounted(async () => {
    init();
});

function init(){
    loadMachineList();
}

async function loadMachineList() {
    const res = await Api.getRobotList();
    machineList.value = res.data.robot;
    loading.value = false;
}

</script>