<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/overview-teacher' }]
    },
    {
        label: 'Functionalities',
        items: [
            { label: 'Class', icon: 'pi pi-fw pi-id-card', to: '/teacher-class' },
            { label: 'Results', icon: 'pi pi-book', to: '/student-result' },
            { label: 'Attendance', icon: 'pi pi-fw pi-check-square', to: '/attendance' },
            { label: 'Subjects', icon: 'pi pi-calculator', to: '/subjects' },
            { label: 'Issues', icon: 'pi pi-question', to: '/issues' },
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
