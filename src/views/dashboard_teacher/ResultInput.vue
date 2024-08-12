<template>
    <Dialog v-model:visible="input_result_visible" modal header="Input Results" :style="{ width: '44rem' }">
        <form class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-4 w-full">
                <InputGroup>
                    <InputGroupAddon>Student</InputGroupAddon>
                    <Select optionLabel="name" placeholder="Select Student" required class="w-full md:w-56" />
                </InputGroup>

                <InputGroup>
                    <InputGroupAddon>Exam</InputGroupAddon>
                    <Select optionLabel="name" placeholder="Select Exam" required class="w-full md:w-56" />
                </InputGroup>
            </div>
            <div class="flex flex-col md:flex-row gap-4 w-full">
                <InputGroup>
                    <InputGroupAddon>Subject</InputGroupAddon>
                    <Select optionLabel="name" placeholder="Select Subject" required class="w-full md:w-56" />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>Mark</InputGroupAddon>
                    <InputNumber inputId="minmax" prefix="%" min="0" max="100" fluid />
                </InputGroup>
            </div>
            <div class="flex justify-end items-end">
                <Button type="submit" label="Submit" />
            </div>
        </form>
    </Dialog>


    <div class="flex flex-col gap-4">
        <div class="flex justify-end items-end">
            <Button type="button" label="Input Result" @click="input_result_visible = true">
                Input Result
                <i class="pi pi-plus"></i>
            </Button>
        </div>
        <form @submit.prevent="handleGetResultsTeacher" class="card flex flex-col md:flex-row gap-4">

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-user"></i>
                </InputGroupAddon>
                <Select v-model="student_value" :options="student_list" optionLabel="student_name"
                    placeholder="Select Student" required class="w-full md:w-56" />
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
            <DataTable v-model:editingRows="editingRows" editMode="row" :value="resultTableValues"
                tableStyle="min-width: 50rem" size="large" @row-edit-save="onRowEditSave">
                <Column v-for="col of tableColumns" :key="col.field" :field="col.field" :header="col.header">
                    <template #editor="{ data, field }">
                        <InputNumber v-if="field === 'marks'" v-model="data[field]" suffix="%" min="0" max="100" />
                        <InputText v-else v-model="data[field]" />
                    </template>
                </Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
            </DataTable>
        </div>
    </div>



</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useManageStudentStore } from '@/stores/teacher_store/manage-students';
import { useSchoolYearStore } from '@/stores/school_years';

import ProgressSpinner from 'primevue/progressspinner'
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import helper from '@/services/helper';
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia';


import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const toast = useToast()

const { fetchSchoolYearsAction } = useSchoolYearStore()
const { getSchoolYears } = storeToRefs(useSchoolYearStore())

const { fetchStudentResultTeacherAction, fetchStudentListAction } = useManageStudentStore()
const { getStudentList, getStudentResultTeacher } = storeToRefs(useManageStudentStore())

const input_result_visible = ref(false)
const academic_year = ref([])
const student_list = ref([])
const loading = ref(false)
const student_value = ref()
const termValue = ref();
const yearValue = ref()
const resultTableValues = ref()

const terms = ref([
    { name: 'First Term', code: 1 },
    { name: 'Second Term', code: 2 },
    { name: 'Third Term', code: 3 },
]);

const tableColumns = [
    { field: 'subject', header: 'Subject' },
    { field: 'marks', header: 'Marks' },
    { field: 'grade', header: 'Grade' },
    { field: 'remark', header: 'Remark' }
];

onBeforeMount(async () => {
    await fetchSchoolYearsAction()
    await fetchStudentListAction()
        .then(() => {
            academic_year.value = getSchoolYears.value.map((value) => ({
                name: value.academic_year,
                code: value.id
            }))
            student_list.value = getStudentList.value.map((value) => ({
                student_id: value.id,
                student_name: `${value.given_name} ${value.surname}`
            }))
        })
        .catch(error => {
            console.log("Error fetching:", error);
        });
})

const handleGetResultsTeacher = async () => {
    // console.log(yearValue.value, termValue.value);
    if (yearValue.value == undefined || termValue.value == undefined || student_value.value == undefined) {
        return helper.showError('Select student, academic year and term to proceed', toast)
    }
    loading.value = true
    await fetchStudentResultTeacherAction(`${student_value.value.student_id}/results/${yearValue.value?.code}/${termValue.value?.code}`)
        .then(() => {
            loading.value = false
            resultTableValues.value = getStudentResultTeacher.value.map((value) => ({
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

const editingRows = ref([]);
const result_row = ref([])

const onRowEditSave = (event) => {
    let { newData, index } = event;

    result_row.value[index] = newData;

    console.log(result_row);

};

</script>

<style scoped></style>