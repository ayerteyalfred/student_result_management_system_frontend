<template>
    <Dialog v-model:visible="confirmDeleteVisible" modal header="Confirm Deletion" :style="{ width: '30rem' }">
        <div class="confirmation-content flex items-center gap-4">
            <span class="pi pi-exclamation-triangle" style="font-size: 2rem;"></span>
            <span>Are you sure you want to delete {{ selectedStudentId?.surname }} {{ selectedStudentId?.given_name }}
                ?</span>
        </div>

        <template #footer>
            <Button label="No" icon="pi pi-times" @click="confirmDeleteVisible = false" class="p-button-text" />
            <Button label="Yes" icon="pi pi-check" @click="handleDelete" class="p-button-danger" />
        </template>

    </Dialog>
    <div>
        <h1>Create Student</h1>
        <div class="flex justify-between items-center my-5">
            <InputText v-model="searchTerm" placeholder="Search..." class="mb-4" />
            <Button @click="create_showDialog = true">Create Student</Button>
        </div>
        <div v-if="isLoading" class="flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8"
                class="fill-surface-0 dark:fill-surface-800" aria-label="loading" />
        </div>
        <DataTable :value="filteredStudents" dataKey="id" paginator :rows="10" stripedRows>
            <Column field="given_name" header="Given Name" />
            <Column field="surname" header="Surname" />
            <Column field="user.email" header="Email" />
            <Column field="enrolment_date" header="Enrolment Date" />
            <Column field="date_of_birth" header="Date of Birth" />
            <Column field="gender" header="Gender" />
            <Column field="grade.name" header="Grade" />
            <Column header="Actions">
                <template #body="slotProps">
                    <div class="flex items-center">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-mr-2"
                            @click="openDialog(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            class="p-button-rounded p-button-info mx-3" @click="confirmDelete(slotProps.data)" />
                        <!-- Add more actions here if needed -->
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Dialog for editing student -->
        <Dialog header="Edit Student" v-model:visible="showDialog" :modal="true" :closable="true"
            :style="{ width: '44rem' }">
            <form @submit.prevent="saveEditStudent" class="p-fluid flex flex-col gap-5">
                <div class="flex flex-col md:flex-row gap-4 w-[49%]">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Username</InputGroupAddon>
                        <InputText v-model="selectedStudent.user.username" disabled />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Surname</InputGroupAddon>
                        <InputText v-model="selectedStudent.surname" />
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Given Name</InputGroupAddon>
                        <InputText v-model="selectedStudent.given_name" />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Middle Name</InputGroupAddon>
                        <InputText id="phone_number" v-model="selectedStudent.middle_name" />
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Email</InputGroupAddon>
                        <InputText v-model="selectedStudent.user.email" type="email" required />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Date of Birth</InputGroupAddon>
                        <DatePicker v-model="selectedStudent.date_of_birth" dateFormat="yy-mm-dd"
                            inputId="birth_date" />
                        <!-- <InputText id="date_of_birth" v-model="selectedStudent.date_of_birth" /> -->
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Gender</InputGroupAddon>
                        <Select v-model="selectedStudent.gender" :options="genderValue" optionLabel="name" />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Enrolment Date</InputGroupAddon>
                        <DatePicker v-model="selectedStudent.enrolment_date" dateFormat="yy-mm-dd" />
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Grade</InputGroupAddon>
                        <Select v-model="selectedStudent.grade" :options="getGrades" optionLabel="name" araia-required
                            class="w-full md:w-56" />
                        <!-- <InputText id="grade" v-model="selectedStudent.grade" /> -->
                    </InputGroup>
                </div>
                <div class="flex justify-end items-center gap-5">
                    <Button type="submit" label="Save" icon="pi pi-check" />
                    <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="showDialog = false" />
                </div>
            </form>
        </Dialog>

        <!-- Dialog For Creating User -->
        <Dialog header="Create Student" v-model:visible="create_showDialog" :modal="true" :closable="true"
            :style="{ width: '44rem' }">
            <div v-if="create_spinner"
                class="absolute inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-10">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8"
                    class="fill-surface-0 dark:fill-surface-800" aria-label="loading" />
            </div>
            <form @submit.prevent="handleCreateStudent" class="p-fluid flex flex-col gap-5">

                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Surname</InputGroupAddon>
                        <InputText v-model="create_surname" required />
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Given Name</InputGroupAddon>
                        <InputText v-model="create_given_name" required />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Middle Name</InputGroupAddon>
                        <InputText id="phone_number" v-model="create_middle_name" />
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Date of Birth</InputGroupAddon>
                        <DatePicker v-model="create_date_of_birth" dateFormat="yy-mm-dd" required />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Gender</InputGroupAddon>
                        <Select v-model="create_gender" :options="genderValue" optionLabel="name"
                            placeholder="Select gender" />
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Enrolment Date</InputGroupAddon>
                        <DatePicker v-model="create_enrolment_date" dateFormat="yy-mm-dd" />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Grade</InputGroupAddon>
                        <Select v-model="create_grade" :options="getGrades" optionLabel="name" class="w-full md:w-56" />
                    </InputGroup>
                </div>
                <div class="flex justify-end items-center gap-5">
                    <Button type="submit" label="Save" icon="pi pi-check" />
                    <Button label="Cancel" icon="pi pi-times" class="p-button-secondary"
                        @click="create_showDialog = false" />
                </div>
            </form>
        </Dialog>

    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useGetStudentsStore } from "@/stores/staff_store/students_crud";
import { useGetGradeStore } from '@/stores/grades';
import { storeToRefs } from "pinia";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast'
import helper from '@/services/helper';

const toast = useToast()
const { fetchStudentsAction, updateStudentsInfo, createStudents, deleteStudents } = useGetStudentsStore();
const { fetchGradeAction } = useGetGradeStore()
const { getGrades } = storeToRefs(useGetGradeStore())
const { getStudents } = storeToRefs(useGetStudentsStore());
const searchTerm = ref('');
const confirmDeleteVisible = ref(false)  // Ref for delete confirmation dialog visibility
const isLoading = ref(false);
const create_spinner = ref(false)
const showDialog = ref(false);
const selectedStudent = ref(null);
const create_showDialog = ref()
const selectedStudentId = ref(null)

const genderValue = ref([
    {
        name: "Male"
    },
    {
        name: "Female"
    }
])

onBeforeMount(async () => {
    isLoading.value = true
    await fetchStudentsAction()
    await fetchGradeAction()
        .then(() => {
            isLoading.value = false
        })
        .catch((err) => {
            isLoading.value = false
            helper.showError('Error getting data, Please check your network', toast)
            console.log("Error fetching:", err);
        })
});

const filteredStudents = computed(() => {
    const term = searchTerm.value.toLowerCase();
    return getStudents.value.filter(student => {
        getGrades.value.forEach((jjk) => {
            if (jjk.id == student.grade) {
                student.grade = jjk
            }
        })
        return (
            student?.user?.username?.toLowerCase().includes(term) ||
            student?.user?.email?.toLowerCase().includes(term) ||
            student?.given_name?.toLowerCase().includes(term) ||
            student?.surname?.toLowerCase().includes(term) ||
            student?.phone_number?.toLowerCase().includes(term)
        );
    });
});


const create_given_name = ref()
const create_surname = ref()
const create_middle_name = ref()
const create_date_of_birth = ref()
const create_gender = ref()
const create_grade = ref()
const create_enrolment_date = ref()


const resetForm = () => {
    create_given_name.value = '';
    create_surname.value = '';
    create_middle_name.value = '';
    create_date_of_birth.value = '';
    create_gender.value = null;
    create_grade.value = null;
    create_enrolment_date.value = '';
}

const handleCreateStudent = () => {

    if (!create_date_of_birth.value || !create_enrolment_date.value || !create_gender.value || !create_grade.value) {
        return helper.showError(`All Fields Are Required Except Middle Name`, toast)
    }

    // Convert Created Date  
    let formattedDateOfBirth = '';
    let formattedEnrolmentDate = '';
    if (create_date_of_birth.value) {
        const parsedDate = new Date(create_date_of_birth.value);
        if (!isNaN(parsedDate)) {
            formattedDateOfBirth = parsedDate.toISOString().slice(0, 10);
        }
    }
    if (create_enrolment_date.value) {
        const parsedEnrolmentDate = new Date(create_enrolment_date.value);
        if (!isNaN(parsedEnrolmentDate)) {
            formattedEnrolmentDate = parsedEnrolmentDate.toISOString().slice(0, 10);
        }
    }

    const createStudentData = {
        user: {
            username: create_surname.value.toLowerCase() + create_given_name.value.toLowerCase(),
            email: create_surname.value.toLowerCase() + create_given_name.value.toLowerCase() + '@deks.com',
            first_name: create_given_name.value,
            last_name: create_surname.value,
            password: create_surname.value.toLowerCase() + create_given_name.value.toLowerCase() + new Date().getFullYear(),
            user_type: "student"
        },
        given_name: create_given_name.value,
        surname: create_surname.value,
        gender: create_gender.value?.name,
        enrolment_date: formattedEnrolmentDate,
        middle_name: create_middle_name.value,
        date_of_birth: formattedDateOfBirth,
        grade: create_grade?.value?.id
    }

    // console.log(createStudentData);

    create_spinner.value = true
    createStudents(createStudentData)
        .then(() => {
            create_spinner.value = false
            create_showDialog.value = false
            helper.showSuccess('Student Created successfully', toast)
            resetForm()
        }).catch((err) => {
            create_spinner.value = false
            helper.showError('Error Creating student', toast)
            console.log("Error Creating student:", err);
        })
}



const openDialog = (student) => {
    selectedStudent.value = { ...student }; // Create a copy of the student data

    showDialog.value = true;
    genderValue.value.forEach((gender) => {
        if (gender.name == selectedStudent.value?.gender) {
            selectedStudent.value.gender = gender
        }
    })
    console.log(selectedStudent.value);

};

const saveEditStudent = () => {
    // Convert Update Date  
    let formattedDateOfBirth = '';
    let formattedEnrolmentDate = '';
    if (selectedStudent.value.date_of_birth) {
        const parsedDate = new Date(selectedStudent.value.date_of_birth);
        if (!isNaN(parsedDate)) {
            formattedDateOfBirth = parsedDate.toISOString().slice(0, 10);
        }
    }
    if (selectedStudent.value.enrolment_date) {
        const parsedEnrolmentDate = new Date(selectedStudent.value.enrolment_date);
        if (!isNaN(parsedEnrolmentDate)) {
            formattedEnrolmentDate = parsedEnrolmentDate.toISOString().slice(0, 10);
        }
    }
    const student_data = {
        user: {
            email: selectedStudent.value.email_address,
            first_name: selectedStudent.value.given_name,
            last_name: selectedStudent.value.surname
        },
        surname: selectedStudent.value.surname,
        given_name: selectedStudent.value.given_name,
        middle_name: selectedStudent.value.middle_name,
        date_of_birth: formattedDateOfBirth,
        gender: selectedStudent.value.gender?.name,
        enrolment_date: formattedEnrolmentDate,
        grade: selectedStudent.value.grade?.id
    }

    const student_id = selectedStudent.value.id

    console.log(student_id, student_data);


    updateStudentsInfo(student_id, student_data)
        .then(() => {
            showDialog.value = false
            helper.showSuccess('Updated successfully', toast)
        }).catch((err) => {
            helper.showError('Error Updating', toast)
            console.log("Error updating student:", err);
        })
}

const confirmDelete = (student) => {
    confirmDeleteVisible.value = true;  // Show the confirmation dialog
    selectedStudentId.value = student

    // console.log(selectedStudentId);


};

// Function to handle deletion of the student
const handleDelete = () => {
    deleteStudents(selectedStudentId.value?.user?.id, selectedStudentId.value?.id)
        .then(() => {
            confirmDeleteVisible.value = false;
            // console.log('Result deleted:', res);
            helper.showSuccess('Student deleted successfully', toast)
        })
        .catch((err) => {
            console.log(err);
            confirmDeleteVisible.value = false;
            helper.showError('Error deleting student', toast)
        });
};
</script>

<style scoped></style>
