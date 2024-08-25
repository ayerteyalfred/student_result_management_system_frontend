<template>
    <div>
        <div class="card flex flex-col justify-center items-center">
            <h2>List student in teacher's class</h2>
            <img src="/img/student_icon.png" class="lg:w-[5%] w-[10%] rounded-full bg-slate-500" alt="">
        </div>
        <div class="flex justify-between items-center my-5">
            <InputText v-model="searchTerm" placeholder="Search..." class="mb-4" />
        </div>
        <div class="card">
            <DataTable :value="filteredStudents" dataKey="id" paginator :rows="10" stripedRows>
                <Column field="surname" header="Surname" />
                <Column field="given_name" header="Given Name" />
                <Column field="middle_name" header="Middle Name" />
                <Column field="user.email" header="Email" />
                <Column field="enrolment_date" header="Enrolment Date" />
                <Column field="date_of_birth" header="Date of Birth" />
                <Column field="gender" header="Gender" />
                <Column field="grade.name" header="Grade" />
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, computed, ref } from 'vue';
import { useGetGradeStore } from '@/stores/grades';
import { useManageStudentStore } from '@/stores/teacher_store/manage-students';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import Column from 'primevue/column';


const { fetchStudentListAction } = useManageStudentStore()
const { getStudentList } = storeToRefs(useManageStudentStore())
const { fetchGradeAction } = useGetGradeStore()
const { getGrades } = storeToRefs(useGetGradeStore())

const searchTerm = ref('');

onBeforeMount(async () => {
    await fetchStudentListAction()
    await fetchGradeAction()
        .then((res) => {
            console.log(res);
            console.log(getStudentList.value);

        })
        .catch(error => {
            console.log("Error fetching:", error);
        })
})

const filteredStudents = computed(() => {
    const term = searchTerm.value.toLowerCase();
    if (!Array.isArray(getStudentList.value)) {
        return []; // Return an empty array if getStudentList.value is not an array
    }
    return getStudentList.value.filter(student => {
        getGrades.value.forEach((jjk) => {
            if (jjk.id == student.grade) {
                student.grade = jjk
            }
        });
        return (
            student?.user?.username?.toLowerCase().includes(term) ||
            student?.user?.email?.toLowerCase().includes(term) ||
            student?.given_name?.toLowerCase().includes(term) ||
            student?.surname?.toLowerCase().includes(term) ||
            student?.phone_number?.toLowerCase().includes(term)
        );
    });
});

</script>

<style scoped>
.bold-header {
    font-weight: bolder;
}
</style>
