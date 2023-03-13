<template>
    <div class="robot-status-container grid" v-loading="loading">
        <div class="function-bar px-[2vw] py-[1vw] grid grid-flow-row items-center justify-between">
            <el-breadcrumb :separator-icon="ArrowRight" class="m-5">
                <el-breadcrumb-item class="breadcrumb-text">裝置列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{currentSerialNumber}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="select-area flex flex-row">
                <el-select class="mr-3 my-2 p-1 default-fill-selection flex-auto"
                v-model="currentSerialNumber" 
                @change="changeMachineName(currentSerialNumber)">
                    <el-option v-for="machine in machineList" 
                    :key="machine.serialNumber" 
                    :value="machine.serialNumber">
                        <span class="default-select-option">{{machine.serialNumber}}</span>                        
                    </el-option>
                </el-select>
                <el-select v-if="currentType.toLowerCase()=='fab'" 
                placeholder="選擇地圖"
                class="m-5 my-2 p-1 default-fill-selection flex-auto"
                v-model="currentMapName" 
                @change="changeMapID()">
                    <el-option v-for="map in mapList" :key="map.imagePath" :value="map.imagePath">
                        <span class="default-select-option">{{map.imagePath}}</span>                                                
                    </el-option>
                </el-select>
                <button class="default-outline-btn ml-16 mr-5 my-2 py-1 px-3" @click="visible = true">
                    <li>數據監控</li>
                </button>
                <div v-if="currentType.toLowerCase()=='fab'" class="flex flex-row min-w-fit self-center">
                    <div class="mx-2" :class="checkMode==false ? 'check-text ' : 'uncheck-text '">裝置模式</div>
                    <label class="switch">
                        <input id="mode-check" type="checkbox" v-model="checkMode">
                        <span class="slider round"></span>
                    </label>
                    <div class="mx-2" :class="checkMode==true ? 'check-text ' : 'uncheck-text '">地圖模式</div>
                </div>
            </div>
        </div>        
        <div v-if="checkMode==false" class="robot-container row-span-5">
            <img class="mx-auto" :class="currentType.toLowerCase()=='fab' ? 'mt-28': 'scale-[80%]'" :src="currentType.toLowerCase()=='solar' ?  '../../src/assets/img/solar_robot-shine.svg': '../../src/assets/img/clean_robot.shine.svg'" alt="">
        </div>
        <div v-else class="h-full w-full row-span-5">
            <div class="h-full w-full flex justify-center">
                <div class="w-[60%] h-full">
                    <AnnotatorBoard :file="file" :currentLabel="currentLabel" :labels="currentLabels" :editable="false"/>
                </div>
            </div>
        </div>
    </div>

    <el-dialog
        v-model="visible"
        width="100%"
        :fullscreen="true"
        :show-close="false"
    >
        <template #header="{close}">
            <div class="my-header">
                <el-button class="col-span-1 mx-5 my-2 py-3 px-4" @click="close" color="#147891">返回</el-button>
            </div>
        </template>
        <div class="mode-area flex justify-center">
            <button class="mx-5" :class="dialogMode=='timely' ? 'mode-area-btn-select' : 'mode-area-btn'" @click="changeDialogMode('timely')">即時資料監控</button>
            <button class="mx-5" :class="dialogMode=='longTerm' ? 'mode-area-btn-select' : 'mode-area-btn'" @click="changeDialogMode('longTerm')">長期資料監控</button>            
        </div>
        <div class="content-area grid grid-cols-5 gap-20 m-12">
            <el-card v-for="data in timelyData" :key="data.title" class="box-card">
                <template #header>
                <div class="card-header">
                    <span>{{data.title}}</span>
                </div>
                </template>
                <div v-if="data.title!='SensorRange'" class="conent-wrapper m-2 grid grid-cols-2">
                    <div class="data-content grid" :class="'grid-rows-'+ Object.keys(data.data).length">
                        <div v-for="key in Object.keys(data.data)" :key="key" class="data-content m-2">
                            <div>{{key}}: </div> 
                        </div>
                    </div>
                    <div class="data-content grid" :class="'grid-rows-'+ Object.keys(data.data).length">
                        <div v-for="key in Object.keys(data.data)" :key="key" class="data-content flex flex-wrap my-2">
                            <div>{{data.data[key]}}</div> 
                        </div>
                    </div>
                </div>
                <div v-else class="conent-wrapper m-2">
                    <div v-for="record in data.data.record" :key="record" class="data-content flex flex-wrap m-2">
                        {{record}} cm
                    </div>
                </div>

            </el-card>        
        </div>
    </el-dialog>
</template>

<style scoped>

.robot-status-container{
    height: 100%;
    width: 100%;
    background: transparent linear-gradient(322deg, #070A3C 71%, #333450 98%, #FFE664 128%) 0% 0% no-repeat padding-box;
    opacity: 1;
}

.box-card{
    --el-fill-color-blank: '';
    --el-card-padding: 0px;
    --el-card-border-color:'';
}

.card-header{
    background: #1C1E46 0% 0% no-repeat padding-box;
    border-radius: 5px;
    opacity: 1;
    text-align: left;
    font: normal normal normal 21px/25px Jura;
    letter-spacing: 0px;
    color: #0F9AAD;
    opacity: 1;
    padding: 10px;
}

.data-content{
    text-align: left;
    font: normal normal normal 16px/18px Jura;
    letter-spacing: 0px;
    color: #DCE0EC;
    opacity: 1;
}
</style>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeMount, watch } from "vue"
import AnnotatorBoard from '@/components/AnnotatorBoard.vue'
import {FileInfo, Label, Markbox} from "@/services/annotator.service"
import Api from "@/services/api.service"
import { debug } from "console"
import { ArrowRight } from '@element-plus/icons-vue'




var machineList = ref([])
var mapList = ref([])
var currentSerialNumber = ref("")
var currentType = ref("")
var currentMapName = ref("")
// var currentMapID = ref("")
var checkMode = ref(false)
var dialogMode = ref("timely")
var timelyData = ref([])
var currentLabels = ref([])
var currentLabel = ref(new Label())
var file = ref(new FileInfo())
const visible = ref(false)
const loading = ref(true)

const props = defineProps<{
  defaultRobot: string,
}>()

const currentMapID = computed(() => {
    // console.log(Object.entries(JSON.parse(JSON.stringify(mapList.value))))
    let mapItemList = []
    Object.entries(JSON.parse(JSON.stringify(mapList.value))).forEach(element => {
        mapItemList.push(element[1])
    });
    return mapItemList.filter(item => item.imagePath == currentMapName.value)[0].id
});


onMounted(async () => {    
    init();
    // file.value.name = currentMap.value
    // file.value.url = "../../src/assets/img/clean_robot_map.png"
    // file.value.markboxes = []
});

async function init(){
    await loadMachineList();
    await loadMapList();
    await loadtimelyData();
    loading.value = false;
    if(props.defaultRobot == ""){
        changeMachineName(JSON.parse(JSON.stringify(machineList.value))[0].serialNumber)
    }else{
        changeMachineName(props.defaultRobot);    
    }
    changeMapID();

}

async function loadMachineList() {
    const res = await Api.getRobotList();
    machineList.value = res.data.robot;
    // currentSerialNumber.value = machineList.value[0].serialNumber;
    // currentType.value = machineList.value[0].type;
}

async function loadMapList() {
    const res = await Api.getMapList();
    mapList.value = res.data;
    currentMapName.value = mapList.value[10].imagePath;
}

function loadtimelyData(){
    timelyData.value = [
        {
            title: "Connection",
            data: {
                "IMU": "Connected",
                "Arduino": "Disconnected",
                "Motor": "Connected",
                "Battery": "Connected",
                "Sensor": "Connected"
            }
        },
        {
            title: "Battery",
            data: {
                "voltage": "5 V",
                "current": "3 A",
                "temperture": "27 ℃",
                "battery percentage": "100 %"
            }
        },
        {
            title: "Odom",
            data: {
                "x": "56 m",
                "y": "77 m",
                "direction angle": "60 rad"
            }
        },
        {
            title: "IMU",
            data: {
                "Roll": "29",
                "Pitch": "12",
                "Yaw": "48"
            }
        },
        {
            title: "SensorRange",
            data: {
                "record": [13, 23, 45, 35, 24 ,64]
            }
        }
    ]
}

const emit = defineEmits<{
  (e: 'submit', type: string, robotName:string): void
}>()

function changeMachineName(name: string) {
    const machine = machineList.value.filter(machine => machine.serialNumber == name)[0];
    if(machine){
        emit('submit', machine.type, machine.serialNumber);
        checkMode.value = false;
    }
    currentType.value = machine.type;
    currentSerialNumber.value = machine.serialNumber;
}

async function changeMapID(){
    if(currentMapID.value == ""){
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

        const map = mapList.value[currentMapID.value]

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

        file.value.name = currentMapID.value;
        file.value.url = "/api/map/download/" + currentMapID.value;
        file.value.markboxes = markboxes;
        file.value.items = items;
        file.value.lines = [{
            points: [150, 435, 170, 437, 190, 433, 210, 435],
            stroke: '10',
            lineCap: 'round',
            lineJoin: 'round',
        }]
    }

}

function changeDialogMode(modeName: string): void{
    dialogMode.value = modeName;
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

</script>