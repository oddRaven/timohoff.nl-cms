<script setup lang="ts">
import { ref } from 'vue'

import { type IArticle, Article } from '../models/article'
import { ArticleService } from '../services/article.service'
import { TranslationService } from '../services/translation.service'

defineExpose({
    clear,
    select
});

const emit = defineEmits(['store']);

const article = ref<IArticle>(new Article());

const dutchTitle = ref<string>('');
const englishTitle = ref<string>('');

const dutchText = ref<string>('');
const englishText = ref<string>('');

const articleService = new ArticleService;
const translationService = new TranslationService;

function clear() {
    article.value = new Article();
    dutchTitle.value = '';
    englishTitle.value = '';
    dutchText.value = '';
    englishText.value = '';
}

function select (id? : number) {
    if (!id) {
        article.value = new Article();
        return;
    }

    articleService.get(id)
        .then((response) => {
            article.value = response.data;
            dutchTitle.value = article.value!.title_translations.filter((translation) => translation.language_code == 'nl')[0].text;
            englishTitle.value = article.value!.title_translations.filter((translation) => translation.language_code == 'en')[0].text;
            dutchText.value = article.value!.text_translations.filter((translation) => translation.language_code == 'nl')[0].text;
            englishText.value = article.value!.text_translations.filter((translation) => translation.language_code == 'en')[0].text;
        });
}

function save () {
    if (article.value && article.value.id) {
        update()
    }
    else {
        store();
    }
}

function update () {
    if(!article.value.id){
        return;
    }

    article.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);
    article.value.text_translations = translationService.constructTranslations(dutchText.value, englishText.value);

    articleService.put(article.value.id, article.value)
        .then((response : any) => {
            article.value = response.data.article;
        });
}

function store () {
    if(!article.value) {
        return;
    }

    article.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);
    article.value.text_translations = translationService.constructTranslations(dutchText.value, englishText.value);

    articleService.post(article.value)
        .then((response : any) => {
            article.value.id = response.data.article.id;

            emit('store', 'articles', response.data.article.id);
        });
}
</script>

<template>
    <div>
        <h2>Article edit</h2>

        <div class="row languages">
            <div class="label"></div>
            <div class="flex-1">Dutch</div>
            <div class="flex-1">English</div>
        </div>
        <div class="row title_edit">
            <div class="label">Title</div>
            <div class="flex-1">
                <input v-model="dutchTitle" type="text" class="text" placeholder="Dutch title" />
            </div>
            <div class="flex-1">
                <input v-model="englishTitle" type="text" class="text" placeholder="English title" />
            </div>
        </div>
        <div class="row text-edit">
            <div class="label">Text</div>
            <div class="flex-1">
                <textarea v-model="dutchText" class="text" placeholder="Dutch text"></textarea>
            </div>
            <div class="flex-1">
                <textarea v-model="englishText" class="text" placeholder="English text"></textarea>
            </div>
        </div>
        <div class="inputs">
            <input type="button" value="Save" @click="save" />
        </div>
    </div>
</template>

<style scoped>
.row {
    display: flex;
}

.label {
    width: 50px;
}

.flex-1 {
    flex: 1;
}

.text-edit {
    min-height: 200px;
}

.text {
    width: 100%;
    height: 100%;
}
</style>