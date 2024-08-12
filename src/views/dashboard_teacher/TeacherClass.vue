<template>
    <div>
        <div class="card flex flex-col justify-center items-center">
            <h2>List student in teacher's class</h2>
            <img src="/img/student_icon.png" class="lg:w-[5%] w-[10%] rounded-full bg-slate-500" alt="">
        </div>
        <div class="card">
            <DataTable :value="getStudentList" tableStyle="min-width: 50rem" stripedRows size="large">
                <Column v-for="col in tableColumns" :key="col.field" :field="col.field" :header="col.header"
                    :filter="true" :headerClass="'bold-header'" sortable />
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useManageStudentStore } from '@/stores/teacher_store/manage-students';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const { fetchStudentListAction } = useManageStudentStore()
const { getStudentList } = storeToRefs(useManageStudentStore())

const tableColumns = [
    { field: 'user.username', header: 'Username' },
    { field: 'user.email', header: 'Email' },
    { field: 'given_name', header: 'Given Name' },
    { field: 'middle_name', header: 'Middle Name' },
    { field: 'surname', header: 'Surname' },
    { field: 'date_of_birth', header: 'Date of Birth' },
    { field: 'gender', header: 'Gender' },
    { field: 'enrolment_date', header: 'Enrolment Date' },
    { field: 'grade', header: 'Grade' }
];

onBeforeMount(async () => {
    await fetchStudentListAction()
        .then((res) => {
            console.log(res);
        })
        .catch(error => {
            console.log("Error fetching:", error);
        })
})

</script>

<style scoped>
.bold-header {
    font-weight: bolder;
}
</style>
