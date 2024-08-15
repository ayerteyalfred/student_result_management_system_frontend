<script setup>
import { ref } from 'vue';
import crypto from '@/services/crypto'

import AppMenuItem from './AppMenuItem.vue';

const encryptedUser = ref(localStorage.getItem('userInfo'));
const user = encryptedUser.value ? JSON.parse(crypto.decryptData(encryptedUser.value, crypto.secretKey())) : {}

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/overview-teacher' },
            { label: 'Class', icon: 'pi pi-fw pi-id-card', to: '/teacher-class' },
            { label: 'Results', icon: 'pi pi-book', to: '/student-result' },
            { label: 'Personal Details', icon: 'pi pi-fw pi-home', to: '/teacher-details' },
        ]
    }
]);

const student_model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Student Results', icon: 'pi pi-fw pi-home', to: '/my-result' },
            { label: 'Personal Details', icon: 'pi pi-fw pi-home', to: '/student-details' },
        ]
    }
]);

const staff_model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Overview', icon: 'pi pi-fw pi-home', to: '/overview-staff' },
            { label: 'Teachers', icon: 'pi pi-fw pi-home', to: '/create-teachers' },
            { label: 'Students', icon: 'pi pi-fw pi-home', to: '/create-students' },
            { label: 'Personal Details', icon: 'pi pi-fw pi-home', to: '/staff-details' }
        ]
    }
]);
</script>

<template>
    <ul v-if="user.user_type == 'teacher'" class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>

    <ul v-if="user.user_type == 'student'" class="layout-menu">
        <template v-for="(item, i) in student_model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>

    <ul v-if="user.user_type == 'staff'" class="layout-menu">
        <template v-for="(item, i) in staff_model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
