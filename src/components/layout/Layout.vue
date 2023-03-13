<template>
    <header>
        <navbar/>
    </header>
    <main>
        <div class="main-container">
            <router-view/>
        </div>
    </main>
</template>

<script setup lang="ts">

import { ref } from 'vue'

import navbar from '@/components/layout/Navbar.vue'

</script>

<style scoped>

    header{
        height: 7%;
    }
    main{
        height: 93%;
        display: flex;
    }
    .main-container{
        width: 100%;
        height: 100%;
    }
</style>