<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import crypto from '@/services/crypto'
import helper from '@/services/helper.js'

import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast'

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter()

const { signoutAction } = useAuthStore()


const { onMenuToggle } = useLayout();

const encryptedUser = ref(localStorage.getItem('userInfo'));
const user = encryptedUser.value ? JSON.parse(crypto.decryptData(encryptedUser.value, crypto.secretKey())) : {}

const handleSignout = () => {
    helper.requireConfirmation(toast, confirm, signoutAction, router)
}



</script>

<template>

    <ConfirmDialog group="headless">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
                <div
                    class="rounded-full bg-primary-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
                    <i class="pi pi-question text-5xl"></i>
                </div>
                <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                <p class="mb-0">{{ message.message }}</p>
                <div class="flex items-center gap-2 mt-6">
                    <Button label="Yes" @click="acceptCallback"></Button>
                    <Button label="Cancel" outlined @click="rejectCallback"></Button>
                </div>
            </div>
        </template>
    </ConfirmDialog>

    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img src="/img/school_logo.png" class="w-[40px]" alt="">

                <span>DEKS</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu justify-center items-center">
                <aside class="font-medium text-lg">
                    {{ user.first_name }} {{ user.last_name }}
                </aside>
            </div>
            <div v-if="user.user_type == 'student'" class="layout-config-menu">
                <button class="layout-topbar-action">
                    <img src="/img/student_icon.png" alt="">
                </button>
            </div>
            <div v-if="user.user_type == 'teacher'" class="layout-config-menu">
                <button class="layout-topbar-action">
                    <img src="/img/teacher_icon.png" alt="">
                </button>
            </div>
            <div class="layout-config-menu">
                <button @click="handleSignout" class="layout-topbar-action">
                    <i class="pi pi-sign-out"></i>
                </button>
            </div>
        </div>
    </div>
    <Toast />
</template>
