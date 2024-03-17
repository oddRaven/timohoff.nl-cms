<script setup lang="ts">
import { ref } from 'vue'

defineExpose({
    assign
});

const prop = defineProps(['listName', 'items', 'keyProperty', 'valueProperty']);
const emit = defineEmits(['select']);

const selectedItem = ref<any>();

function assign (item: any) {
    selectedItem.value = item;
}

function selectItem (item: any) {
    assign(item);
    emit('select', selectedItem.value);
}
</script>

<template>
    <div class="list">
        <div class="inner-list">
            <header> {{ prop.listName }} </header>
            <ul>
                <li v-for="item in prop.items" :key="item[prop.keyProperty]" :class="item == selectedItem && 'selected'" @click="selectItem(item)"> 
                    {{ item[prop.valueProperty] }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .list {
        padding: 5px;
        width: 150px;

        .inner-list {
            background: lightblue;
        }

        header {
            font-weight: bold;
            padding: 2px;
        }

        ul {
            padding: 0px;
            margin: 0px;

            li {
                list-style: none;
                cursor: pointer;
                user-select: none;
                padding: 2px;

                &.selected {
                    outline: 1px solid black;
                }
            }
        }
    }
</style>