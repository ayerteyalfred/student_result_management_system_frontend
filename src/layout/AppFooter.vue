<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
    <div
        class="layout-footer font-bold text-lg shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]">
        © {{ currentYear }} Deks Institute
    </div>
</template>
