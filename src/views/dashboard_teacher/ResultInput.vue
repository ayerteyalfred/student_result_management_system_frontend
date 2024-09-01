<template>
    <Dialog v-model:visible="confirmDeleteVisible" modal header="Confirm Deletion" :style="{ width: '30rem' }">
        <div class="confirmation-content flex items-center gap-4">
            <span class="pi pi-exclamation-triangle" style="font-size: 2rem;"></span>
            <span>Are you sure you want to delete this subject result ?</span>
        </div>

        <template #footer>
            <Button label="No" icon="pi pi-times" @click="confirmDeleteVisible = false" class="p-button-text" />
            <Button label="Yes" icon="pi pi-check" @click="handleDeleteResult" class="p-button-danger" />
        </template>

    </Dialog>

    <Dialog v-model:visible="input_result_visible" modal header="Input Results" :style="{ width: '44rem' }">

        <div v-if="create_spinner"
            class="absolute inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-10">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8"
                class="fill-surface-0 dark:fill-surface-800" aria-label="loading" />
        </div>
        <form @submit.prevent="handleCreateResult" class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-4 w-full">
                <InputGroup>
                    <InputGroupAddon>Student</InputGroupAddon>
                    <Select :options="student_list" optionLabel="student_name" placeholder="Select Student"
                        v-model="createResultStudentValue" required class="w-full md:w-56" />
                </InputGroup>

                <InputGroup>
                    <InputGroupAddon>Exam</InputGroupAddon>
                    <Select :options="getExams" optionLabel="name" placeholder="Select Exam"
                        v-model="createResultExamValue" required class="w-full md:w-56" />
                </InputGroup>
            </div>
            <div class="flex flex-col md:flex-row gap-4 w-full">
                <InputGroup>
                    <InputGroupAddon>Subject</InputGroupAddon>
                    <Select :options="getSubjects" optionLabel="subject_name" placeholder="Select Subject"
                        v-model="createResultSubjectValue" required class="w-full md:w-56" />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>Mark</InputGroupAddon>
                    <InputNumber inputId="minmax" prefix="%" :min="0" :max="100" required
                        v-model="createResultMarkValue" fluid />
                </InputGroup>
            </div>


            <div class="flex flex-col md:flex-row gap-4 w-full">
                <InputGroup>
                    <InputGroupAddon>Academic Year</InputGroupAddon>
                    <InputText :value="createResultExamValue?.school_year?.academic_year" disabled />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>Term</InputGroupAddon>
                    <InputText :value="createResultExamValue?.term?.term_number" disabled />
                </InputGroup>
            </div>


            <div class="flex justify-end items-end">
                <Button type="submit" label="Submit" />
            </div>

            <!-- {{ getExams }} -->
            <!-- {{ createResultExamValue }} -->
        </form>
    </Dialog>


    <div class="card flex flex-col justify-center items-center">
        <h2>Student Results</h2>
        <img src="/img/teacher_icon.png" class="lg:w-[5%] w-[10%] rounded-full bg-slate-500" alt="">
    </div>
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
                tableStyle="min-width: 50rem" size="large" @row-edit-save="onRowEditSave" stripedRows>
                <Column v-for="col of tableColumns" :key="col.field" :field="col.field" :header="col.header">
                </Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
                <Column :exportable="false" style="width: 10%; min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteResult(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <div class="reportLayout hidden" id="modal-content">
            <ResultsPDF :resultTableValues="resultTableValues" :yearValue="yearValue?.name || 'N/A'"
                :termValue="termValue?.name || 'N/A'" :student_value="student_value?.student_name || 'N/A'"
                :exam="getStudentResultTeacher[0]?.exam"
                :teacherName="`${getTeacherDetails?.surname} ${getTeacherDetails?.given_name}`"
                :classGrade="getTeacherDetails.grade?.name" />
        </div>

        <div v-if="resultTableValues" class="flex justify-end items-start">
            <Button label="print" @click="myPDF">
                Print Result
                <i class="pi pi-download"></i>
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useManageStudentStore } from '@/stores/teacher_store/manage-students';
import { useSchoolYearStore } from '@/stores/school_years';
import { useTeacherDetailsStore } from '@/stores/teacher_store/teacher_details';
import { useGetGradeStore } from '@/stores/grades';

import printJS from 'print-js'
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
import ResultsPDF from '@/components/ResultsPDF.vue'

const toast = useToast()

const { fetchSchoolYearsAction } = useSchoolYearStore()
const { getSchoolYears } = storeToRefs(useSchoolYearStore())

const { fetchStudentResultTeacherAction, fetchStudentListAction, fetchSubjectsAction, fetchExamsAction, updateStudentResult, deleteStudentResult, inputStudentResult } = useManageStudentStore()
const { getStudentList, getStudentResultTeacher, getSubjects, getExams } = storeToRefs(useManageStudentStore())

const { fetchTeacherDetailsAction } = useTeacherDetailsStore()
const { getTeacherDetails } = storeToRefs(useTeacherDetailsStore())
const { fetchGradeAction } = useGetGradeStore()
const { getGrades } = storeToRefs(useGetGradeStore())

const input_result_visible = ref(false)
const confirmDeleteVisible = ref(false)  // Ref for delete confirmation dialog visibility
const academic_year = ref([])
const student_list = ref([])
const loading = ref(false)
const create_spinner = ref(false)
const student_value = ref()
const termValue = ref();
const yearValue = ref()
const resultTableValues = ref()
const selectedResultId = ref(null)  // Ref to store the ID of the selected result

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
    await fetchSubjectsAction()
    await fetchExamsAction()
    await fetchTeacherDetailsAction()
    await fetchGradeAction()
        .then(() => {
            academic_year.value = getSchoolYears.value.map((value) => ({
                name: value.academic_year,
                code: value.id
            }))
            student_list.value = getStudentList.value.map((value) => ({
                student_id: value.id,
                student_name: `${value.given_name} ${value.surname}`
            }))
            if (getTeacherDetails.value) {
                getGrades.value.forEach((jjk) => {
                    if (jjk.id == getTeacherDetails.value.grade) {
                        getTeacherDetails.value.grade = jjk
                    }
                });
            }
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
                grade: value.grade,
                remark: value.remarks,
                id: value.result_id,
                exam: value.exam
            }))
        })
        .catch(error => {
            loading.value = false
            resultTableValues.value = []
            console.log("Error fetching", error);
            helper.showError('Results Not Found', toast)
        })
}

// Confirm delete result
const confirmDeleteResult = (id) => {
    selectedResultId.value = id;  // Store the selected result ID
    confirmDeleteVisible.value = true;  // Show the confirmation dialog
}

// Handle the deletion of the result
const handleDeleteResult = () => {
    loading.value = true
    deleteStudentResult(selectedResultId.value)
        .then(() => {
            loading.value = false
            confirmDeleteVisible.value = false;
            // console.log('Result deleted:', res);
            resultTableValues.value = resultTableValues.value.filter(result => result.id !== selectedResultId.value);
            helper.showSuccess('Result deleted successfully', toast)
        })
        .catch((err) => {
            console.log(err);
            loading.value = false
            confirmDeleteVisible.value = false;
            helper.showError('Error deleting result', toast)
        });
}

// Edit Result Mark
const editingRows = ref([]);

const onRowEditSave = (event) => {
    let { newData, index } = event;
    const result = newData
    const result_mark = {
        marks: result.marks
    }
    console.log(result);
    loading.value = true
    updateStudentResult(result.id, result_mark)
        .then((res) => {
            console.log(res);
            loading.value = false
            resultTableValues.value[index] = newData;
            helper.showSuccess('Result Updated successfully', toast)
        })
        .catch((err) => {
            loading.value = false
            console.log(err);
            helper.showError('Error updating result', toast)
        })
};


const createResultStudentValue = ref()
const createResultExamValue = ref()
const createResultSubjectValue = ref()
const createResultMarkValue = ref()

const handleCreateResult = () => {
    if (createResultStudentValue.value == undefined || createResultExamValue.value == undefined || createResultSubjectValue.value == undefined || createResultMarkValue.value == undefined) {
        return helper.showError('All fields are required to proceed', toast)
    }
    const data = {
        student: createResultStudentValue.value?.student_id,
        exam: createResultExamValue.value?.id,
        subject: createResultSubjectValue.value?.id,
        marks: createResultMarkValue?.value,
    }

    console.log(data);
    create_spinner.value = true
    inputStudentResult(data)
        .then((res) => {
            console.log(res);
            create_spinner.value = false
            createResultStudentValue.value = ref()
            createResultExamValue.value = ref()
            createResultSubjectValue.value = ref()
            createResultMarkValue.value = ref()
            helper.showSuccess(res.message, toast);
        })
        .catch((err) => {
            console.log(err);
            create_spinner.value = false
            createResultStudentValue.value = ref()
            createResultExamValue.value = ref()
            createResultSubjectValue.value = ref()
            createResultMarkValue.value = ref()
            helper.showError(err.response.data.message, toast);
        })
}

const myPDF = () => {
    printJS({
        printable: 'modal-content',
        type: 'html',
        style: `
            /* General Layout */
            .reportLayout {
                padding: 30px;
                background-color: #ffffff;
                border-radius: 12px;
                font-family: Arial, sans-serif;
                color: #333;
            }
            
            /* Header Section */
            .report-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .report-header h1 {
                font-size: 40px;
                margin: 0;
                color: #4a90e2;
            }
            .report-header p {
                font-size: 1.2rem;
                margin: 5px 0 0;
                color: #777;
            }

            /* Information Section */
            .report-info {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin-bottom: 30px;
                font-size: 1.1rem;
                line-height: 1.6;
            }
            .report-info strong {
                color: #4a90e2;
            }

            /* Table Section */
            .report-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                font-size: 1rem;
            }
            .report-table th,
            .report-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            .report-table th {
                background-color: #f5f5f5;
                font-weight: bold;
                color: #333;
            }
            .report-table tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .report-table tr:hover {
                background-color: #f1f1f1;
            }

            /* Footer Section */
            .report-footer {
                text-align: center;
                margin-top: 30px;
                font-size: 0.9rem;
                color: #777;
            }
            .report-footer p {
                margin: 0;
            }
        `,
        targetStyle: ['*'],
    })
}

</script>

<style scoped>
input:disabled {
    background-color: white;
}

.reportLayout {
    margin-left: 2cm;
    margin-right: 2cm;
}
</style>