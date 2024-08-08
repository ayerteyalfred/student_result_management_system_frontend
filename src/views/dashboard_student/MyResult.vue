<template>
    <div>
        <div class="card flex flex-col justify-center items-center">
            <h2>My Results</h2>
            <img src="/img/student_icon.png" class="lg:w-[5%] w-[10%] rounded-full bg-slate-500" alt="">
        </div>

        <form @submit.prevent="handleGetResults" class="card flex flex-col md:flex-row gap-4">

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-user"></i>
                </InputGroupAddon>
                <InputText placeholder="Website" :value="username" disabled />
            </InputGroup>

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-graduation-cap"></i>
                </InputGroupAddon>
                <Select v-model="yearValue" :options="academic_year" optionLabel="name" araia-required
                    placeholder="Select Academic Year" class="w-full md:w-56" />
            </InputGroup>

            <InputGroup>
                <InputGroupAddon>
                    <img src="/img/school_term.png" alt="">
                </InputGroupAddon>
                <Select v-model="termValue" :options="terms" optionLabel="name" placeholder="Select School Term"
                    required class="w-full md:w-56" />
            </InputGroup>

            <div class="flex justify-end items-end">
                <Button type="submit" label="Submit" />
            </div>
        </form>
        <div v-if="loading" class="flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8"
                class="fill-surface-0 dark:fill-surface-800" aria-label="loading" />
        </div>

    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useSchoolYearStore } from '@/stores/school_years';
import { useStudentResultStore } from '@/stores/student_store/student_result';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button';
import Select from 'primevue/select';
import { storeToRefs } from 'pinia';

const { getUser } = storeToRefs(useAuthStore())
const { getSchoolYears } = storeToRefs(useSchoolYearStore())
const { fetchSchoolYearsAction } = useSchoolYearStore()
const { fetchStudentResultAction } = useStudentResultStore()

const loading = ref(false)
const username = ref(`${getUser.value.first_name} ${getUser.value.last_name}`)
const termValue = ref();
const yearValue = ref()

const terms = ref([
    { name: 'First Term', code: 1 },
    { name: 'Second Term', code: 2 },
    { name: 'Third Term', code: 3 },
]);

const academic_year = ref([])

onBeforeMount(async () => {
    await fetchSchoolYearsAction()
        .then(() => {
            academic_year.value = getSchoolYears.value.map((value) => ({
                name: value.academic_year,
                code: value.id
            }))
        })
        .catch(error => {
            console.log("Error fetching:", error);
        });
})

const handleGetResults = async () => {
    console.log(yearValue.value, termValue.value);
    loading.value = true
    await fetchStudentResultAction(`${yearValue.value?.code}/${termValue.value?.code}`)
        .then(() => {
            loading.value = false
        })
        .catch(error => {
            console.log("Error fetching", error);
            loading.value = false

        })

}


</script>

<style scoped>
input:disabled {
    background-color: white;
}
</style>