<template>
    <div class="text-lg font-medium">
        <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '44rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
            <form @submit.prevent="handleStudentupdate" class="flex flex-col gap-4">
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Surname</InputGroupAddon>
                        <InputText :value="surname" v-model="surname" />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Middle Name</InputGroupAddon>
                        <InputText :value="middle_name" v-model="middle_name" />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Given Name</InputGroupAddon>
                        <InputText :value="given_name" v-model="given_name" />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Date of Birth</InputGroupAddon>
                        <DatePicker v-model="date_of_birth" dateFormat="yy-mm-dd" inputId="birth_date"
                            :placeholder="date_of_birth" />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Gender</InputGroupAddon>
                        <InputText :value="gender" v-model="gender" />
                    </InputGroup>
                </div>

                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button type="submit" label="Save"></Button>
                </div>
            </form>
        </Dialog>

        <div class="card flex flex-col justify-center items-center">
            <h2>Student Personal Details</h2>
            <img src="/img/student_icon.png" class="lg:w-[5%] w-[10%] rounded-full bg-slate-500" alt="">
        </div>

        <div v-if="loading" class="flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8"
                class="fill-surface-0 dark:fill-surface-800" aria-label="loading" />
        </div>

        <div v-if="!pageNotFound">

            <div class="flex justify-end items-end">
                <button label="Show" @click="visible = true" class="hover:bg-white rounded-full p-2 mb-4">
                    <i class="pi pi-user-edit" style="font-size: 2rem;"></i>
                </button>
            </div>
            <div class="card flex lg:flex-row flex-col gap-8">
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Surname</InputGroupAddon>
                        <InputText :value="getTeacherDetails?.surname" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Middle Name</InputGroupAddon>
                        <InputText :value="getTeacherDetails?.middle_name" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Given Name</InputGroupAddon>
                        <InputText :value="getTeacherDetails?.given_name" disabled />
                    </InputGroup>
                </div>
            </div>
            <div class="card flex lg:flex-row flex-col gap-8">
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Date Of Birth</InputGroupAddon>
                        <InputText :value="getTeacherDetails?.date_of_birth" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Gender</InputGroupAddon>
                        <InputText :value="getTeacherDetails?.gender" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Username</InputGroupAddon>
                        <InputText :value="getTeacherDetails?.user?.username" disabled />
                    </InputGroup>
                </div>
            </div>
            <div class="card flex lg:flex-row flex-col gap-8">
                <div class="flex flex-col md:flex-row gap-4 w-full">

                    <InputGroup>
                        <InputGroupAddon>Email</InputGroupAddon>
                        <InputText :value="getTeacherDetails?.user?.email" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Grade</InputGroupAddon>
                        <InputText :value="getTeacherDetails?.grade" disabled />
                    </InputGroup>
                </div>
            </div>
        </div>
        <div v-else-if="pageNotFound" class="flex items-center justify-center">
            <img src="/img/not-found.png" alt="">
        </div>


    </div>

</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTeacherDetailsStore } from '@/stores/teacher_store/teacher_details';
import ProgressSpinner from 'primevue/progressspinner'
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import helper from '@/services/helper';
import { useToast } from 'primevue/usetoast'


const { getTeacherDetails } = storeToRefs(useTeacherDetailsStore())
const { fetchTeacherDetailsAction, updateTeacher } = useTeacherDetailsStore()

const toast = useToast()
const loading = ref(false)
const visible = ref(false)
const pageNotFound = ref(false)

const date_of_birth = ref('')
const surname = ref('')
const given_name = ref('')
const middle_name = ref('')
const gender = ref('')
const user_type = "student"

// Fetch data before page mounts
onBeforeMount(async () => {
    loading.value = true
    await fetchTeacherDetailsAction()
        .then(() => {
            // Set the form fields after fetching data
            if (getTeacherDetails.value) {
                surname.value = getTeacherDetails.value.surname || ''
                given_name.value = getTeacherDetails.value.given_name || ''
                middle_name.value = getTeacherDetails.value.middle_name || ''
                date_of_birth.value = getTeacherDetails.value.date_of_birth || ''
                gender.value = getTeacherDetails.value.gender || ''
            }
            loading.value = false
        })
        .catch(error => {
            console.log("Error fetching:", error);
            loading.value = false
            pageNotFound.value = true
            helper.showError('Unable to get personal details. Please check your network.', toast)
        });
})

const handleStudentupdate = () => {
    // Convert date_of_birth to a Date object if it's not already
    let formattedDateOfBirth = '';
    if (date_of_birth.value) {
        const parsedDate = new Date(date_of_birth.value);
        if (!isNaN(parsedDate)) {
            formattedDateOfBirth = parsedDate.toISOString().slice(0, 10);
        }
    }

    const update_data = {
        user: {
            user_type: user_type,
            first_name: given_name.value,
            last_name: surname.value
        },
        surname: surname.value,
        given_name: given_name.value,
        middle_name: middle_name.value,
        date_of_birth: formattedDateOfBirth,
        gender: gender.value,
        enrolment_date: getTeacherDetails.value?.enrolment_date,
        grade: getTeacherDetails.value?.grade
    }

    updateTeacher(update_data)
        .then(() => {
            // console.log(res);
            helper.showSuccess('Update Successful', toast)
        })
        .catch((err) => {
            helper.showError('An error occurred during update.', toast)
            console.log(err);
        })

    // console.log(update_data);
    visible.value = false
}


</script>

<style scoped>
input:disabled {
    background-color: white;
}
</style>