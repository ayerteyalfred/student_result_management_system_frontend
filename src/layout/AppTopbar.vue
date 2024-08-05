<script setup>
import { useLayout } from '@/layout/composables/layout';

const { onMenuToggle } = useLayout();
</script>

<template>
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
            <div class="layout-config-menu">
                <button class="layout-topbar-action">
                    <i class="pi pi-user"></i>
                </button>
            </div>
        </div>
    </div>
</template>
