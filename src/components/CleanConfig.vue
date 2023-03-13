<template>
    <div class="clean-config-container grid auto-rows-min">
        <div class="clean-config-header">
            <el-breadcrumb :separator-icon="ArrowRight" class="m-5">
                <el-breadcrumb-item>裝置列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{currentRobotName}}</el-breadcrumb-item>
                <el-breadcrumb-item>清掃設定</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="mode-area flex justify-center m-10">
                <button class="mx-5" :class="currentPage=='cleanArea' ? 'mode-area-btn-select' : 'mode-area-btn'" @click="changeCurrentPage('cleanArea')">設定清掃範圍</button>
                <button class="mx-5" :class="currentPage=='cleanMode' ? 'mode-area-btn-select' : 'mode-area-btn'" @click="changeCurrentPage('cleanMode')">設定清掃模式</button>
                <button class="mx-5" :class="currentPage=='trackConfig' ? 'mode-area-btn-select' : 'mode-area-btn'" @click="changeCurrentPage('trackConfig')">設定換帶</button>
            </div>    
        </div>
        <div v-if="currentPage=='cleanArea'" class="clean-area-body">
            <div class="function-bar flex items-center justify-center">
                <router-link :to="'./devices-setting?defaultRobot='+props.defaultRobot" custom v-slot="{ navigate }">
                    <button @click="navigate" class="default-outline-btn my-2 p-3">離開設定</button>
                </router-link>
                <!-- <button  onclick="location.href='./devices-setting'" class="default-outline-btn mx-5 my-2 p-3">離開設定</button> -->
                <el-steps class="grow max-w-2xl" :active="active" finish-status="success" :align-center=true>
                    <el-step title="Step 1 選擇地圖" />
                    <el-step title="Step 2 設定範圍" />
                    <el-step title="Step 3 預覽" />
                </el-steps>
                <div v-if="currentMapId.length>0">
                    <button class="default-outline-btn mx-5 my-2 p-3"  @click="progressSwitch(-1)">上一步</button>
                    <button v-if="active<2" class="default-fill-btn mx-5 my-2 p-3" @click="progressSwitch(1)">下一步</button>
                    <button v-else class="default-fill-btn mx-5 my-2 p-3" >儲存設定</button>
                </div>
            </div>
            <div class="map-list h-[65vh] px-[5vw] py-[1vw] overflow-auto">
                <div class="pt-8 h-full">
                    <el-checkbox-group v-if="active==0" class="w-full grid grid-cols-3 gap-x-16 gap-y-6" v-model="currentMapId" :max=1>
                        <el-card v-for="map in mapList" :key="map.imagePath" class="box-card"  v-loading="mapLoadingCount<mapListLength">
                            <template #header>
                            <div class="card-header">
                                 <el-checkbox size="large" :key="map.id" :label="map.id">
                                    <span class="card-header-title mx-2">{{map.imagePath}}</span>
                                 </el-checkbox>
                            </div>
                            </template>
                            <div class="status mb-5 cyna-blue-text">
                                <li>狀態：正常</li>
                                <li>錯誤：無</li>
                            </div>
                            <div class="max-h-96 max-w-md">
                                <!-- <el-image :id="map.id"
                                class="w-full h-full" 
                                :class="imgRotate('/api/map/download/' + map.id)"                              
                                :src="'/api/map/download/' + map.id" /> -->
                                <img :id="map.id"
                                @load="mapLoadingCount+=1"
                                class="w-full h-full" 
                                :class="imgRotate('/api/map/download/' + map.id)"                              
                                :src="'/api/map/download/' + map.id" alt="">
                            </div>

                            <!-- <img src="../../src/assets/img/clean_robot_map.png" alt=""> -->
                            <!-- <img class="w-full h-full md:rotate-90" :src="'/api/map/download/' + map.id" alt=""> -->
                        </el-card>
                    </el-checkbox-group>
                    <div v-else class="h-full w-full">
                        <div class="h-[90%] w-full flex justify-center">
                            <div class="w-[40%] h-full">
                                <AnnotatorBoard :file="file" :currentLabel="currentLabel" :labels="currentLabels" :editable="mapEditable"/>
                            </div>
                        </div>
                        <div v-if="active==1" class="function-bar flex justify-end items-center">
                            <el-select class="m-2 default-fill-selection" v-model="version">
                                <el-option v-for="ver in versions" :key="ver" :value="ver">
                                    <span class="default-select-option">{{ ver }}</span>
                                </el-option>
                            </el-select>
                            <el-button class="mx-5 my-2 py-3 px-4" :icon="Plus" color="#202255">充電站</el-button>
                            <el-button class="mx-5 my-2 py-3 px-4" :icon="Plus" color="#147891" @click="changeCurrentLabel('noGoZone')" plain>禁制區</el-button>
                            <el-button class="mx-5 my-2 py-3 px-4" :icon="Plus" color="#147891" @click="changeCurrentLabel('cleanZone')">清掃範圍</el-button>
                        </div>
                    </div>
                    <!-- <div v-else class="h-full w-full">
                        <div class="h-[90%] w-full flex justify-center">
                            <div class="w-[40%] h-full">
                                <AnnotatorBoard :file="file" :currentLabel="currentLabel" :labels="currentLabels"/>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
        <div v-else-if="currentPage=='cleanMode'" class="m-10">
            <div class="mode-btn-list grid grid-cols-3 gap-4 w-[80%] m-auto justify-items-center">
                <button class="p-4" :class="cleanMode=='zone' ? 'clean-area-btn-select' : 'clean-area-btn'" @click="changeCleanMode('zone')">
                    <div class="m-1" :class="cleanMode=='zone' ? 'clean-area-btn-text-select' : 'clean-area-btn-text'">Zone</div>
                    <img :src="cleanMode=='zone' ? '../../src/assets/img/clean_mode_zone_select.svg' : '../../src/assets/img/clean_mode_zone.svg'" alt="">
                </button>
                <button class="p-4" :class="cleanMode=='restart' ? 'clean-area-btn-select' : 'clean-area-btn'" @click="changeCleanMode('restart')">
                    <div class="m-1" :class="cleanMode=='restart' ? 'clean-area-btn-text-select' : 'clean-area-btn-text'">Restart</div>
                    <img :src="cleanMode=='restart' ? '../../src/assets/img/clean_mode_restart_select.svg' : '../../src/assets/img/clean_mode_restart.svg'" alt="">
                </button>
                <button class="p-4" :class="cleanMode=='continue' ? 'clean-area-btn-select' : 'clean-area-btn'" @click="changeCleanMode('continue')">
                    <div class="m-1" :class="cleanMode=='continue' ? 'clean-area-btn-text-select' : 'clean-area-btn-text'">Continue</div>
                    <img :src="cleanMode=='continue' ? '../../src/assets/img/clean_mode_continue_select.svg' : '../../src/assets/img/clean_mode_continue.svg'" alt="">
                </button>
            </div>
            <div class="function-bar flex justify-center">
                <button class="default-outline-btn mx-10 my-10 p-3">離開設定</button>
                <button class="default-fill-btn mx-10 my-10 p-3">儲存設定</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.clean-config-container{
    height: 100%;
    width: 100%;    
    background: #020322 0% 0% no-repeat padding-box;
    opacity: 1;
}

.box-card{
    --el-card-bg-color: #070A3C;
    border: none
}

.card-header-title{
    text-align: left;
    font: normal normal medium 18px/23px Helvetica Neue;
    letter-spacing: 0px;
    color: #FFFFFF;
    opacity: 0.88;
}

.clean-area-btn{
    background: #9AE2EA 0% 0% no-repeat padding-box;
    border-radius: 14px;
    opacity: 1;
}

.clean-area-btn-select{
    background: #1C1E46 0% 0% no-repeat padding-box;
    border-radius: 14px;
    opacity: 1;
}

.clean-area-btn-text{
    text-align: center;
    font: normal normal bold 34px/40px Jura;
    letter-spacing: 0px;
    color: #0C0439;
    opacity: 1;
}

.clean-area-btn-text-select{
    text-align: center;
    font: normal normal bold 34px/40px Jura;
    letter-spacing: 0px;
    color: #0F9AAD;
    opacity: 1;
}
</style>

<script setup lang="ts">
import AnnotatorBoard from '@/components/AnnotatorBoard.vue'
import { ArrowRight, Plus } from '@element-plus/icons-vue'
import { ref, reactive, computed, onMounted, onBeforeMount, watch } from "vue";
import {FileInfo, Label, Markbox} from "@/services/annotator.service";
import Api from "@/services/api.service"
const currentPage = ref("cleanArea")
const active = ref(0)
const cleanMode = ref("zone")
const currentMapId = ref([])
const currentRobotName = ref("Clean Robot 1")
const versions = ref([])
const version = ref("")
var currentLabels = ref([])
var currentLabel = ref(new Label())
var file = ref(new FileInfo())
var mapList = ref([])
var mapLoadingCount = ref(0)
var loading = ref(true)

const props = defineProps<{
  defaultRobot: string,
}>()

onMounted(async () => {
    init();
      // setInterval(testDrawLine, 5000);

});

watch(currentMapId, async () => {
    await changeCurrentMapId()
})

const mapEditable = computed(() => {
    if(active.value==1){
        return true;
    }else{
        return false;
    }
});

const mapListLength = computed(() => {
    return Object.entries(JSON.parse(JSON.stringify(mapList.value))).length;
});

// async function testDrawLine() {
//     function getRandomInt(max) {
//         return Math.floor(Math.random() * max);
//     }
//     let randomPoint = [getRandomInt(1000), getRandomInt(1000)]
//     file.value.lines[0].points.push(getRandomInt(1000))
//     file.value.lines[0].points.push(getRandomInt(1000))
//     console.log(file.value.lines[0].points)
// }

async function init(){
    await loadMapList();
    changeCurrentMapId();
    versions.value = ["預設空白", "MAMCA3 - 4f"]
    version.value = "預設空白"
}

async function loadMapList() {
    const res = await Api.getMapList();
    mapList.value = res.data;
}

function changeCurrentPage(pageName: string): void{
    currentPage.value = pageName;
    if(pageName == 'cleanArea'){
        resetLineData()
    }
}

function changeCleanMode(modeName: string){
    cleanMode.value = modeName
}

function imgRotate(url: string) {
    var imgObj = new Image();
    imgObj.src = url;
    if(imgObj.clientWidth+150 < imgObj.clientWidth){
        return "max-w-sm max-h-[28rem] rotate-90"
    }else{
        return "max-h-96 max-w-md"
    }
}

function progressSwitch(num: number){
    if (active.value + num <= 2 && active.value + num > 0){
        active.value += num;
    }else{
        active.value = 0;
    }    
    if(active.value == 0){
        resetLineData()
    }
}

//annotator重建 尚無路經資料故須重設
function resetLineData(){
        file.value.lines = [{
            points: [150, 435, 170, 437, 190, 433, 210, 435],
            stroke: '10',
            lineCap: 'round',
            lineJoin: 'round',
        }]
}

// const next = () => {
//   if (active.value++ > 2) active.value = 0
// }

// const back = () => {
//   if (active.value-- <= 0) active.value = 0
// }

async function changeCurrentMapId(){
    if(currentMapId.value.length == 0){
        file.value = new FileInfo()
    }else{
        currentLabels.value = [
            {
                name: "cleanZone",
                color: "#A1C158"
            },
            {
                name: "noGoZone",
                color: "#C92235"
            }
        ]  

        const mapItemRes = await Api.getMapItems();
        const mapItem = mapItemRes.data.map_items; 

        const map = mapList.value[currentMapId.value[0]]

        const items = []
        mapItem.chargerPoint.forEach(element => {
            items.push(pointConvert(map.origin, element, "chargerPoint"));
        });
        const homePoint = {}
        const markboxes = []
        mapItem.cleanZone.forEach(element => {
            markboxes.push(markboxConvert(map.origin, 'cleanZone', element))
        });

        mapItem.noGoZone.forEach(element => {
            markboxes.push(markboxConvert(map.origin, 'noGoZone', element))
        });

        file.value.name = currentMapId.value;
        file.value.url = "/api/map/download/" + currentMapId.value;
        file.value.markboxes = markboxes;
        file.value.items = items;
        resetLineData()
    }
}

function pointConvert(origin: Array<number>, point: Array<number>, name: string){
    var convertPoint = {};
    var imgObj = new Image();
    imgObj.src = "../../src/assets/img/" + name + ".svg"
    convertPoint = {
        width: 30,
        height: 30,
        offsetX: 15,
        offsetY: 15,
        rotation: point[2] + 90,
        x: point[0] + origin[0],
        y: point[1] + origin[1],
        image: imgObj
    }
    return convertPoint;
}

function markboxConvert(origin: Array<number>, markBoxType:string, markboxPointsList: Array<Array<number>>){
    var convertedMarkbox = new Markbox()
    convertedMarkbox.labelName = markBoxType;
    convertedMarkbox.x = markboxPointsList[0][0] + origin[0];
    convertedMarkbox.y = markboxPointsList[0][1] + origin[1];
    convertedMarkbox.width = Math.abs(markboxPointsList[0][0] - markboxPointsList[2][0]);
    convertedMarkbox.height = Math.abs(markboxPointsList[0][1] - markboxPointsList[2][1]);
    return convertedMarkbox;    
}

function changeCurrentLabel(name: string){
    let labels = JSON.parse(JSON.stringify(currentLabels.value))
    // annotator.changeAnnotateMode("add");
    currentLabel.value = labels.filter(item => item.name == name)[0]
}

</script>