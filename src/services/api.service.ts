import axios, { type AxiosResponse } from "axios";


export default class Api {

    static async getMapList() {
        var url = '/api/map/list';
        var result = {}
        await axios.get(url).then((res) => {
            result = res.data
        })
        return result
    }

    static async getMapCurrent() {
        var url = '/api/map/current';
        var result = {};
        await axios.get(url).then((res) => {
            result = res.data
        })
        return result
    }

    static async getMapItems(){
        var url = '/api/map/items';
        var result = {};
        await axios.get(url).then((res) => {
            result = res.data
        })
        return result
    }
    

    static async getMapDownload(id: number) {
        var url = '/api/map/download/'
        var result = {}
        await axios.get(url+id).then((res) => {
            result = res.data
        })
        return result
    }

    static async getRobotList() {
        var url = '/api/robot/list';
        var result = {}
        await axios.get(url).then((res) => {
            result = res.data
        })
        return result
    }
}