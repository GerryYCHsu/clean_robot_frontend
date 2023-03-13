<template>
    <div class="navbar-container flex py-5 pl-2 justify-between">
        <div class="nav-box">
            <img src="../../assets/img/icon.svg" alt="">
        </div>
        <div class="flex inf-box">
            <router-link to="./devices" class="navbar-text mx-3">裝置列表</router-link>
            <a href="" class="navbar-text mx-3">地圖列表</a>
            <img class="mx-3" src="../../assets/img/person-circle.svg" alt="">
        </div>
        
    </div>
</template>

<style scoped>
.navbar-container {
    background: #070A3C 0% 0% no-repeat padding-box;
    opacity: 1;
    color: #ffffff;
}

.navbar-text {
    text-align: left;
    font: normal normal medium 18px/23px Helvetica Neue;
    letter-spacing: 2.88px;
    color: #FFFFFF;
    opacity: 1;
    align-self: center;
}

.navbar-text:hover {
    text-align: left;
    font: normal normal medium 18px/23px Helvetica Neue;
    letter-spacing: 2.88px;
    color: #FFE664;
    opacity: 1;
    align-self: center;
}
</style>