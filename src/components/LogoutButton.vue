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
    <main>
        <input type="button" value="Logout" @click="logout">
    </main>
</template>