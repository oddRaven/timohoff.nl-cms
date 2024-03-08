<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { AuthenticationService } from '../services/authentication.service'

const router = useRouter();
const authenticationService = new AuthenticationService;

let username = ref();
let password = ref();

function login(){
    const data = {
        'name': username.value,
        'password': password.value
    };

    authenticationService.login(data)
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