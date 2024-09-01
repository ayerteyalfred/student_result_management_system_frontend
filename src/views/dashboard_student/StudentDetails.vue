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
                        <InputText :value="getStudentDetails?.surname" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Middle Name</InputGroupAddon>
                        <InputText :value="getStudentDetails?.middle_name" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Given Name</InputGroupAddon>
                        <InputText :value="getStudentDetails?.given_name" disabled />
                    </InputGroup>
                </div>
            </div>
            <div class="card flex lg:flex-row flex-col gap-8">
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Date Of Birth</InputGroupAddon>
                        <InputText :value="getStudentDetails?.date_of_birth" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Gender</InputGroupAddon>
                        <InputText :value="getStudentDetails?.gender" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Enrolment Date</InputGroupAddon>
                        <InputText :value="getStudentDetails?.enrolment_date" disabled />
                    </InputGroup>
                </div>
            </div>
            <div class="card flex lg:flex-row flex-col gap-8">
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Username</InputGroupAddon>
                        <InputText :value="getStudentDetails?.user?.username" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Email</InputGroupAddon>
                        <InputText :value="getStudentDetails?.user?.email" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Grade</InputGroupAddon>
                        <InputText :value="getStudentDetails?.grade" disabled />
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
import { useStudentDetailsStore } from '@/stores/student_store/student_details';
import ProgressSpinner from 'primevue/progressspinner'
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import helper from '@/services/helper';
import { useToast } from 'primevue/usetoast'


const { getStudentDetails } = storeToRefs(useStudentDetailsStore())
const { fetchStudentDetailsAction, updateStudent } = useStudentDetailsStore()

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
    await fetchStudentDetailsAction()
        .then(() => {
            // Set the form fields after fetching data
            if (getStudentDetails.value) {
                surname.value = getStudentDetails.value.surname || ''
                given_name.value = getStudentDetails.value.given_name || ''
                middle_name.value = getStudentDetails.value.middle_name || ''
                date_of_birth.value = getStudentDetails.value.date_of_birth || ''
                gender.value = getStudentDetails.value.gender || ''
            }
            loading.value = false
        })
        .catch(error => {
            if (error.response.status == 401) {
                localStorage.removeItem('userInfo')
                localStorage.removeItem('Token')
                localStorage.removeItem('student_id')
                localStorage.removeItem('teacher_id')
                localStorage.removeItem('staff_id')
                window.location.href = "/login";
            }
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
        enrolment_date: getStudentDetails.value?.enrolment_date,
        grade: getStudentDetails.value?.grade
    }

    updateStudent(update_data)
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