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

        <div class="card">
            <DataTable :value="resultTableValues" tableStyle="min-width: 50rem" size="large">
                <Column v-for="col of tableColumns" :key="col.field" :field="col.field" :header="col.header"></Column>
            </DataTable>
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
import helper from '@/services/helper';
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia';


import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const toast = useToast()
const { getUser } = storeToRefs(useAuthStore())
const { getSchoolYears } = storeToRefs(useSchoolYearStore())
const { fetchSchoolYearsAction } = useSchoolYearStore()
const { fetchStudentResultAction } = useStudentResultStore()
const { getStudentResult } = storeToRefs(useStudentResultStore())

const loading = ref(false)
const username = ref(`${getUser.value.first_name} ${getUser.value.last_name}`)
const termValue = ref();
const yearValue = ref()
const academic_year = ref([])
const resultTableValues = ref()

const tableColumns = [
    { field: 'subject', header: 'Subject' },
    { field: 'marks', header: 'Marks' },
    { field: 'grade', header: 'Grade' },
    { field: 'remark', header: 'Remark' }
];

const terms = ref([
    { name: 'First Term', code: 1 },
    { name: 'Second Term', code: 2 },
    { name: 'Third Term', code: 3 },
]);


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
    // console.log(yearValue.value, termValue.value);
    if (yearValue.value == undefined || termValue.value == undefined) {
        return helper.showError('Select both academic year and term to proceed', toast)
    }
    loading.value = true
    await fetchStudentResultAction(`${yearValue.value?.code}/${termValue.value?.code}`)
        .then(() => {
            loading.value = false
            resultTableValues.value = getStudentResult.value.map((value) => ({
                subject: value.subject.subject_name,
                marks: value.marks,
                grade: value.score,
                remark: value.remarks
            }))
        })
        .catch(error => {
            resultTableValues.value = []
            console.log("Error fetching", error);
            loading.value = false
            helper.showError('Results Not Found', toast)
        })
}


</script>

<style scoped>
input:disabled {
    background-color: white;
}
</style>