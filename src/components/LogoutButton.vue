<script setup lang="ts">
import axios from "axios";
import { useRouter } from 'vue-router';

const router = useRouter();

function logout(){
    axios.delete('http://localhost/api/authentication')
        .then((response) => {
            router.push('/');            
        });
}
</script>

<template>
    <div class="wrapper">
        <input type="button" value="Logout" @click="logout">
    </div>
</template>

<style scoped>

.wrapper {
    text-align: right;
}

</style>