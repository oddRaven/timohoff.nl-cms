<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from "axios";
import { useRouter } from 'vue-router'

const router = useRouter();

let username = ref();
let password = ref();

function login(){
    const data = {
        'name': username.value,
        'password': password.value
    };

    axios.defaults.withCredentials = true;

    let url = 'http://localhost:80/api/authentication';

    axios.post(url, data)
        .then((response) => {
            if (response.status == 200) {
                router.push('/main');
            }
        });
}
</script>

<template>
  <main>
    <input type="text" v-model="username" >
    <input type="password" v-model="password" >
    <input type="button" value="Login" @click="login" >
  </main>
</template>