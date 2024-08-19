<template>
    <Dialog v-model:visible="confirmDeleteVisible" modal header="Confirm Deletion" :style="{ width: '30rem' }">
        <div class="confirmation-content flex items-center gap-4">
            <span class="pi pi-exclamation-triangle" style="font-size: 2rem;"></span>
            <span>Are you sure you want to delete {{ selectedTeacherId.surname }} {{ selectedTeacherId.given_name }}
                ?</span>
        </div>

        <template #footer>
            <Button label="No" icon="pi pi-times" @click="confirmDeleteVisible = false" class="p-button-text" />
            <Button label="Yes" icon="pi pi-check" @click="handleDelete" class="p-button-danger" />
        </template>

    </Dialog>
    <div>
        <h1>Create Teacher</h1>
        <div class="flex justify-between items-center my-5">
            <InputText v-model="searchTerm" placeholder="Search..." class="mb-4" />
            <Button @click="create_showDialog = true">Create Teacher</Button>
        </div>
        <div v-if="isLoading" class="flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8"
                class="fill-surface-0 dark:fill-surface-800" aria-label="loading" />
        </div>
        <DataTable :value="filteredTeachers" dataKey="id" paginator :rows="10" stripedRows>
            <Column field="given_name" header="Given Name" />
            <Column field="surname" header="Surname" />
            <Column field="email_address" header="Email" />
            <Column field="phone_number" header="Phone Number" />
            <Column field="date_of_birth" header="Date of Birth" />
            <Column field="gender" header="Gender" />
            <Column field="grade.name" header="Grade" />
            <Column header="Actions">
                <template #body="slotProps">
                    <div class="flex item-center">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-mr-2"
                            @click="openDialog(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            class="p-button-rounded p-button-info mx-3" @click="confirmDelete(slotProps.data)" />
                        <!-- Add more actions here if needed -->
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Dialog for editing teacher -->
        <Dialog header="Edit Teacher" v-model:visible="showDialog" :modal="true" :closable="true"
            :style="{ width: '44rem' }">
            <form @submit.prevent="saveEditTeacher" class="p-fluid flex flex-col gap-5">
                <div class="flex flex-col md:flex-row gap-4 w-[49%]">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Username</InputGroupAddon>
                        <InputText v-model="selectedTeacher.user.username" disabled />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Surname</InputGroupAddon>
                        <InputText v-model="selectedTeacher.surname" />
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Given Name</InputGroupAddon>
                        <InputText v-model="selectedTeacher.given_name" />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Middle Name</InputGroupAddon>
                        <InputText id="phone_number" v-model="selectedTeacher.middle_name" />
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Email</InputGroupAddon>
                        <InputText v-model="selectedTeacher.email_address" type="email" required />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Date of Birth</InputGroupAddon>
                        <DatePicker v-model="selectedTeacher.date_of_birth" dateFormat="yy-mm-dd"
                            inputId="birth_date" />
                        <!-- <InputText id="date_of_birth" v-model="selectedTeacher.date_of_birth" /> -->
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Gender</InputGroupAddon>
                        <Select v-model="selectedTeacher.gender" :options="genderValue" optionLabel="name" />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup class="p-field">
                        <InputGroupAddon>Phone Number</InputGroupAddon>
                        <InputMask v-model="selectedTeacher.phone_number" mask="999-999-9999" required
                            placeholder="024-999-9990" />
                    </InputGroup>
                    <InputGroup class="p-field">
                        <InputGroupAddon>Grade</InputGroupAddon>
                        <Select v-model="selectedTeacher.grade" :options="getGrades" optionLabel="name" araia-required
                            class="w-full md:w-56" />
                        <!-- <InputText id="grade" v-model="selectedTeacher.grade" /> -->
                    </InputGroup>
                </div>
                <div class="flex justify-end items-center gap-5">
                    <Button type="submit" label="Save" icon="pi pi-check" />
                    <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="showDialog = false" />
                </div>
            </form>
        </Dialog>

        <!-- Dialog For Creating User -->
        <Dialog header="Create Teacher" v-model:visible="create_showDialog" :modal="true" :closable="true"
            :style="{ width: '44rem' }">
            <div v-if="create_spinner"
                class="absolute inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-10">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8"
                    class="fill-surface-0 dark:fill-surface-800" aria-label="loading" />
            </div>
            <form @submit.prevent="handleCreateTeacher" class="p-fluid flex flex-col gap-5">

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
                        <InputGroupAddon>Phone Number</InputGroupAddon>
                        <InputMask id="basic" v-model="create_phone_number" mask="999-999-9999" required
                            placeholder="024-999-9990" />
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
import { useGetTeachersStore } from "@/stores/staff_store/teachers_crud";
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
import InputMask from 'primevue/inputmask';
import { useToast } from 'primevue/usetoast'
import helper from '@/services/helper';

const toast = useToast()
const { fetchTeachersAction, updateTeacherInfo, createTeacher, deleteTeacher } = useGetTeachersStore();
const { fetchGradeAction } = useGetGradeStore()
const { getGrades } = storeToRefs(useGetGradeStore())
const { getTeachers } = storeToRefs(useGetTeachersStore());
const searchTerm = ref('');
const confirmDeleteVisible = ref(false)  // Ref for delete confirmation dialog visibility
const isLoading = ref(false);
const create_spinner = ref(false)
const showDialog = ref(false);
const selectedTeacher = ref(null);
const create_showDialog = ref()
const selectedTeacherId = ref(null)

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
    await fetchTeachersAction()
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

const filteredTeachers = computed(() => {
    const term = searchTerm.value.toLowerCase();
    return getTeachers.value.filter(teacher => {
        getGrades.value.forEach((jjk) => {
            if (jjk.id == teacher.grade) {
                teacher.grade = jjk
            }
        })
        return (
            teacher?.user?.username?.toLowerCase().includes(term) ||
            teacher?.given_name?.toLowerCase().includes(term) ||
            teacher?.surname?.toLowerCase().includes(term) ||
            teacher?.email_address?.toLowerCase().includes(term) ||
            teacher?.phone_number?.toLowerCase().includes(term)
        );
    });
});


const create_given_name = ref()
const create_surname = ref()
const create_middle_name = ref()
const create_date_of_birth = ref()
const create_gender = ref()
const create_grade = ref()
const create_phone_number = ref()


const resetForm = () => {
    create_given_name.value = '';
    create_surname.value = '';
    create_middle_name.value = '';
    create_date_of_birth.value = '';
    create_gender.value = null;
    create_grade.value = null;
    create_phone_number.value = '';
}

const handleCreateTeacher = () => {

    if (!create_date_of_birth.value || !create_phone_number.value || !create_gender.value || !create_grade.value) {
        return helper.showError(`All Fields Are Required Except Middle Name`, toast)
    }

    // Convert Created Date  
    let formattedDateOfBirth = '';
    if (create_date_of_birth.value) {
        const parsedDate = new Date(create_date_of_birth.value);
        if (!isNaN(parsedDate)) {
            formattedDateOfBirth = parsedDate.toISOString().slice(0, 10);
        }
    }

    const createTeacherData = {
        user: {
            username: create_surname.value.toLowerCase() + create_given_name.value.toLowerCase(),
            email: create_surname.value.toLowerCase() + create_given_name.value.toLowerCase() + '@deks.com',
            first_name: create_given_name.value,
            last_name: create_surname.value,
            password: create_surname.value.toLowerCase() + create_given_name.value.toLowerCase() + new Date().getFullYear(),
            user_type: "teacher"
        },
        given_name: create_given_name.value,
        surname: create_surname.value,
        gender: create_gender.value?.name,
        email_address: create_surname.value.toLowerCase() + create_given_name.value.toLowerCase() + '@deks.com',
        phone_number: create_phone_number.value,
        middle_name: create_middle_name.value,
        date_of_birth: formattedDateOfBirth,
        grade: create_grade?.value?.id
    }

    // console.log(createTeacherData);

    create_spinner.value = true
    createTeacher(createTeacherData)
        .then(() => {
            create_spinner.value = false
            create_showDialog.value = false
            helper.showSuccess('Teacher Created successfully', toast)
            resetForm()
        }).catch((err) => {
            create_spinner.value = false
            helper.showError('Error Creating teacher', toast)
            console.log("Error Creating teacher:", err);
        })
}



const openDialog = (teacher) => {
    selectedTeacher.value = { ...teacher }; // Create a copy of the teacher data

    showDialog.value = true;
    genderValue.value.forEach((gender) => {
        if (gender.name == selectedTeacher.value?.gender) {
            selectedTeacher.value.gender = gender
        }
    })
    console.log(selectedTeacher.value);

};

const saveEditTeacher = () => {
    // Convert Update Date  
    let formattedDateOfBirth = '';
    if (selectedTeacher.value.date_of_birth) {
        const parsedDate = new Date(selectedTeacher.value.date_of_birth);
        if (!isNaN(parsedDate)) {
            formattedDateOfBirth = parsedDate.toISOString().slice(0, 10);
        }
    }
    const teacher_data = {
        user: {
            email: selectedTeacher.value.email_address,
            first_name: selectedTeacher.value.given_name,
            last_name: selectedTeacher.value.surname
        },
        email_address: selectedTeacher.value.email_address,
        surname: selectedTeacher.value.surname,
        given_name: selectedTeacher.value.given_name,
        middle_name: selectedTeacher.value.middle_name,
        date_of_birth: formattedDateOfBirth,
        gender: selectedTeacher.value.gender?.name,
        phone_number: selectedTeacher.value?.phone_number,
        grade: selectedTeacher.value.grade?.id
    }

    const teacher_id = selectedTeacher.value.id

    console.log(teacher_id, teacher_data);


    updateTeacherInfo(teacher_id, teacher_data)
        .then(() => {
            showDialog.value = false
            helper.showSuccess('Updated successfully', toast)
        }).catch((err) => {
            helper.showError('Error Updating', toast)
            console.log("Error updating teacher:", err);
        })
}

const confirmDelete = (teacher) => {
    confirmDeleteVisible.value = true;  // Show the confirmation dialog
    selectedTeacherId.value = teacher

    console.log(teacher);


};

// Function to handle deletion of the teacher
const handleDelete = () => {
    deleteTeacher(selectedTeacherId.value?.user?.id, selectedTeacherId.value?.id)
        .then(() => {
            confirmDeleteVisible.value = false;
            // console.log('Result deleted:', res);
            helper.showSuccess('Teacher deleted successfully', toast)
        })
        .catch((err) => {
            console.log(err);
            confirmDeleteVisible.value = false;
            helper.showError('Error deleting teacher', toast)
        });
};
</script>

<style scoped></style>
