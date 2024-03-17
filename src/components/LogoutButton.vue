<script setup lang="ts">
import { useRouter } from 'vue-router';

import { AuthenticationService } from '../services/authentication.service';

const router = useRouter();
const authenticationService = new AuthenticationService;

function logout(){
    authenticationService.logout()
        .then(() => {
            router.push('/');            
        });
}
</script>

<template>
    <div class="wrapper body-row">
        <input type="button" value="Logout" @click="logout">
    </div>
</template>

<style scoped lang="scss">

.wrapper {
    text-align: right;
}

</style>