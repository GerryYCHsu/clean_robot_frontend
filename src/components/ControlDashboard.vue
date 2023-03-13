<template>
    <div class="control-dashboard-container" v-loading="loading">
        <div class="mode-bar flex p-5 m-2 justify-between">
            <div class="mode-area flex">
                <button class="mx-5" :class="mode=='remote' ? 'mode-area-btn-select' : 'mode-area-btn'" @click="changeMode('remote')">遙控模式</button>
                <button v-if="type.toLowerCase()=='fab'" class="mx-5" :class="mode=='realtimeImg' ? 'mode-area-btn-select' : 'mode-area-btn'" @click="changeMode('realtimeImg')">實機畫面</button>
                <button v-if="type.toLowerCase()=='solar'" class="mx-5" :class="mode=='navigate' ? 'mode-area-btn-select' : 'mode-area-btn'" @click="changeMode('navigate')">自動導航</button>
                <button v-if="type.toLowerCase()=='solar'" class="mx-5" :class="mode=='speedTest' ? 'mode-area-btn-select' : 'mode-area-btn'" @click="changeMode('speedTest')">速度測試</button>
            </div>
            <div class="power-area flex">
                <div class="mode-area-btn mx-5 flex items-center">
                    <img src="../../src/assets/img/charger.svg" alt="">
                    <div class="text-center">
                        <el-progress :show-text="false" :stroke-width="20" :color="progressColors" :percentage="robotCharger" />
                        <div class="progress-text">{{robotCharger}}%</div> 
                    </div>                    
                </div>
                <div class="mode-area-btn mx-5 flex items-center" v-if="type.toLowerCase()=='fab'">
                    <img src="../../src/assets/img/roller.svg" alt="">
                    <div class="text-center">
                        <el-progress :show-text="false" :stroke-width="20" :color="progressColors" :percentage="robotRoller" />
                        <div class="progress-text">{{robotRoller}}%</div> 
                    </div>                    
                </div>
                <div class="mode-area-btn mx-5 flex items-center">                    
                    <img src="../../src/assets/img/power.svg" alt="">
                    <div class="text-center">
                        <el-progress :show-text="false" :stroke-width="20" :color="progressColors" :percentage="robotPower" />                     
                        <div class="progress-text">{{robotPower}}%</div>
                    </div>                    
                </div>
            </div>
        </div>   
        <div class="dashboard p-5 m-2">
            <div class="status-bar">       
                <div class="dashbaord-title m-5">{{ robotName }}</div>
                <ul>
                    <li class="cyna-blue-text dashboard-text m-5">狀態：</li>
                    <li class="cyna-blue-text dashboard-text m-5">錯誤：</li>
                </ul>
                <!-- <img class="h-48 m-auto" id="realtime-image"/> -->
            </div>
            <template v-if="mode=='remote'">
                <div v-if="type.toLowerCase()=='solar'" class="control-bar flex m-5">
                    <div class="cyna-blue-text">毛刷馬達</div>
                    <div class="mx-5 flex">
                        <div class="mx-2" :class="engineMode==false ? 'check-text ' : 'uncheck-text '">關閉</div>
                        <label class="switch">
                            <input id="motor" type="checkbox" v-model="engineMode">
                            <span class="slider round"></span>
                        </label>
                        <div class="mx-2" :class="engineMode==true ? 'check-text ' : 'uncheck-text '">開啟</div>
                    </div>
                </div>
                <div v-else class="control-bar flex m-5">
                    <router-link :to="'./clean-config?defaultRobot='+robotName" custom v-slot="{ navigate }">
                        <button @click="navigate" class="default-fill-btn my-2 p-3">清掃設定</button>
                    </router-link>
                    <!-- <button onclick="location.href='./clean-config'" class="default-fill-btn mx-5 my-2 py-3 px-4">清掃設定</button> -->
                </div>
                <div class="direction-bar">
                    <div class="remote-controller-box">
                        <div class="btn-wrapper">
                            <div type="button" class="controller-btn btn-color"
                                @mouseover="btnHovered = 'forward'"
                                @mouseleave="btnHovered = null">
                                <img style="transform: rotate(-90deg);" :src="btnHovered === 'forward' ? '../../src/assets/img/btn-direction-fill-change.svg' : '../../src/assets/img/btn-direction.svg'" />
                            </div>
                        </div>
                        <div class="btn-wrapper grid grid-cols-3 gap-4">
                            <div type="button" class="controller-btn btn-color"
                                @mouseover="btnHovered = 'left'" @mouseleave="btnHovered = null">
                                <img style="transform: rotate(-180deg);"
                                    :src="btnHovered === 'left' ? '../../src/assets/img/btn-direction-fill-change.svg' : '../../src/assets/img/btn-direction.svg'" />
                            </div>
                            <div type="button" class="controller-btn btn-color" @click="handleDirectionStop"
                                @mouseover="btnHovered = 'pause'" @mouseleave="btnHovered = null">
                                <img
                                    :src="btnHovered === 'pause' ? '../../src/assets/img/btn-pause-fill-change.svg' : '../../src/assets/img/btn-pause.svg'" />
                            </div>
                            <div type="button" class="controller-btn btn-color"
                                @mouseover="btnHovered = 'right'" @mouseleave="btnHovered = null">
                                <img :src="btnHovered === 'right' ? '../../src/assets/img/btn-direction-fill-change.svg' : '../../src/assets/img/btn-direction.svg'" />
                            </div>
                        </div>
                        <div class="btn-wrapper">
                            <div type="button" class="controller-btn btn-color"
                                 @mouseover="btnHovered = 'backward'"
                                @mouseleave="btnHovered = null">
                                <img style="transform: rotate(90deg);"
                                    :src="btnHovered === 'backward' ? '../../src/assets/img/btn-direction-fill-change.svg' : '../../src/assets/img/btn-direction.svg'" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="mode=='navigate'">
                <div class="control-bar grid grid-rows-3 m-5 gap-4">
                    <div class="row-span-1 items-center grid grid-cols-6">
                        <div class="col-span-1 cyna-blue-text">清掃次數</div>
                        <el-slider class="col-span-2 custom-slider" v-model="navigateCleanTime" :show-tooltip="false" />
                        <div class="cyna-blue-text text-center">{{navigateCleanTime}} times</div>
                    </div>
                    <div class="row-span-1 items-center grid grid-cols-6">
                        <div class="col-span-1 cyna-blue-text">清掃速度</div>
                        <el-select class="col-span-1 default-fill-selection">
                            <el-option v-for="option in speedOption" :key="option" :value="option" :label="option">
                                <span class="default-select-option">{{ option }}</span>
                            </el-option>
                        </el-select>
                        <el-input class="col-span-1 mx-2 default-outline-input" placeholder="請輸入數值" />
                    </div>                    
                    <div class="row-span-1 items-center grid grid-cols-6">
                        <div class="col-span-1 cyna-blue-text">清掃面積</div>
                        <el-input class="col-span-1 default-outline-input" placeholder="請輸入數值" />
                    </div>
                </div>
                <div class="direction-bar">
                    <div class="navigate-controller-box">
                        <div class="btn-wrapper">
                            <div type="button" class="controller-btn btn-color"
                                @mouseover="btnHovered = 'roller_left'"
                                @mouseleave="btnHovered = null">
                                <img :src="btnHovered === 'roller_left' ? '../../src/assets/img/roller_left_hover.svg' : '../../src/assets/img/roller_left.svg'" />
                            </div>
                            <div class="btn-wrapper">
                            <div type="button" class="controller-btn btn-color"
                                 @mouseover="btnHovered = 'roller_right'"
                                @mouseleave="btnHovered = null">
                                <img :src="btnHovered === 'roller_right' ? '../../src/assets/img/roller_right_hover.svg' : '../../src/assets/img/roller_right.svg'" />
                            </div>
                        </div>
                        </div>
                        <div class="btn-wrapper">
                            <div type="button" class="controller-btn btn-color"
                                @mouseover="btnHovered = 'roller_restart'" @mouseleave="btnHovered = null">
                                <img :src="btnHovered === 'roller_restart' ? '../../src/assets/img/roller_restart_hover.svg' : '../../src/assets/img/roller_restart.svg'" />
                            </div>
                            <div type="button" class="controller-btn btn-color"
                                @mouseover="btnHovered = 'roller_stop'" @mouseleave="btnHovered = null">
                                <img :src="btnHovered === 'roller_stop' ? '../../src/assets/img/roller_stop_hover.svg' : '../../src/assets/img/roller_stop.svg'" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="mode=='speedTest'">
                <div class="control-bar grid grid-rows-3 m-5 gap-4">
                    <div class="row-span-1 items-center grid grid-cols-6">
                        <div class="col-span-1 cyna-blue-text">清掃次數</div>
                        <el-slider class="col-span-2 custom-slider" v-model="speedTestCleanTime" :show-tooltip="false" />
                        <div class="cyna-blue-text text-center">{{speedTestCleanTime}} times</div>
                    </div>
                    <div class="row-span-1 items-center grid grid-cols-6">
                        <div class="col-span-1 cyna-blue-text">清掃距離</div>
                        <el-slider class="col-span-2 custom-slider" v-model="speedTestDistance" :show-tooltip="false" />
                        <div class="cyna-blue-text text-center">{{speedTestDistance}} times</div>
                    </div>
                    <div class="row-span-1 items-center grid grid-cols-6">
                        <div class="col-span-1 cyna-blue-text">清掃速度</div>
                        <el-select class="col-span-1 default-fill-selection">
                            <el-option v-for="option in speedOption" :key="option" :value="option" :label="option">
                                <span class="default-select-option">{{ option }}</span>
                            </el-option>
                        </el-select>
                        <el-input class="col-span-1 mx-2 default-outline-input" placeholder="請輸入數值" />
                    </div> 
                </div>
                <div class="grid grid-cols-5 m-5 items-center justify-items-start">
                    <img class="m-3" src="../../src/assets/img/speed_dashboard.svg" alt="">
                    <el-input class="col-span-1 m-3 default-outline-input" placeholder="00:00" />
                    <el-button class="col-span-1 mx-5 my-2 py-3 px-4" color="#147891">開始測試</el-button>
                </div>
            </template>
            <template v-else>
                <img class="m-auto" id="realtime-image"/>
            </template>
        </div>
    </div>
</template>


<style scoped>

.control-dashboard-container{
    height: 100%;
    width: 100%;    
    background: #020322 0% 0% no-repeat padding-box;
    opacity: 1;
}


.progress-text{
    text-align: left;
    font: normal normal normal 20px/23px Jura;
    letter-spacing: 0px;
    color: #DCE0EC;
    opacity: 1;
}

progress {
  opacity: 0;
}

.progress-container {
  width: 2vw;
  position: relative;
  display: inline-block;
  background: #eee;
  height: 20px;
  border-radius: 6px;
  overflow: hidden;
  
}

.progress-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #A1C158 0% 0% no-repeat padding-box;;
  border: azure 10px;
  /* background: linear-gradient(right, #A1C158 50%, #020322 50%); */
}


.dashbaord-title{
    text-align: left;
    font: normal normal normal 32px/39px Helvetica Neue;
    letter-spacing: 1.92px;
    color: #9AE2EA;
    opacity: 1;
}

.dashboard-text{
    text-align: left;
    opacity: 1;
    list-style-type: disc;
}

.direction-bar{
    text-align: -webkit-right;
}

.remote-controller-box .btn-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-height: 10vh;

}

.remote-controller-box .controller-btn  {
  display: flex;
  justify-content: center;
  min-width: 8vh;
}

.remote-controller-box .controller-btn img{
  width: 100%;
}

.navigate-controller-box{
    width: 75%;
}

.navigate-controller-box .btn-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-height: 12vh;
}

.navigate-controller-box .controller-btn{
    width: fit-content;
    /* max-width: 10vh; */
}

.navigate-controller-box .controller-btn img{
    width: fit-content;
}

</style>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeMount, watch } from "vue";


var btnHovered = ref(null)
var mode = ref("")
var type = ref("")
var robotName = ref("")
var navigateCleanTime = ref(0)
var speedTestCleanTime = ref(0)
var speedTestDistance = ref(0)
var speedOption= ref([])
const engineMode = ref(false)
const loading = ref(true)
const robotPower = ref(80)
const robotCharger = ref(35)
const robotRoller = ref(19)
const progressColors = [
    { color: '#C92235', percentage: 20 },
    { color: '#D5800E', percentage: 50 },
    { color: '#A1C158', percentage: 100 },
]



const props = defineProps<{
  robotType: string,
  serialNumber: string
}>()

onMounted(async () => {
    await init();
});

watch(props ,async () => {
    await changeMachineType(props.robotType, props.serialNumber);
    if(props.robotType!=null && props.serialNumber!=null){
        loading.value = false
    }
})

function init(){
    mode.value = "remote";
    speedOption.value = [
        "自訂速度",
        "節電模式",
        "快速模式"
    ]
    changeMachineType(props.robotType, props.serialNumber);
    initWebSocket();
}

function changeMode(modeName: string): void{
    mode.value = modeName;
}

function changeMachineType(robotType: string, serialNumber: string): void{
    type.value = robotType;
    robotName.value = serialNumber
    mode.value = 'remote';
}

function initWebSocket(){
    const socket = new WebSocket('ws://tw100043939.corpnet.auo.com:19996/particle-detector');

    socket.addEventListener('message', (event) => {
        var myImage = document.getElementById('realtime-image') as HTMLImageElement;
        var objectURL = URL.createObjectURL(event.data);
        if(myImage){
            myImage.src = objectURL;
        }
    });
}

</script>