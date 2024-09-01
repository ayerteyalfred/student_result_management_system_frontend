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
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Given Name</InputGroupAddon>
                        <InputText :value="given_name" v-model="given_name" />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Phone Number</InputGroupAddon>
                        <InputMask v-model="phone_number" mask="999-999-9999" required placeholder="024-999-9990" />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Gender</InputGroupAddon>
                        <InputText :value="gender" v-model="gender" />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Email</InputGroupAddon>
                        <InputText :value="email_address" v-model="email_address" />
                    </InputGroup>
                </div>

                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button type="submit" label="Save"></Button>
                </div>
            </form>
        </Dialog>

        <div class="card flex flex-col justify-center items-center">
            <h2>Staff Personal Details</h2>
            <!-- <img src="/img/teacher_icon.png" class="lg:w-[5%] w-[10%] rounded-full bg-slate-500" alt=""> -->
            <i class="pi pi-user" style="font-size: 2.5rem"></i>
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
                        <InputText :value="getStaffDetails?.surname" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Given Name</InputGroupAddon>
                        <InputText :value="getStaffDetails?.given_name" disabled />
                    </InputGroup>
                </div>
            </div>
            <div class="card flex lg:flex-row flex-col gap-8">
                <div class="flex flex-col md:flex-row gap-4 w-full">
                    <InputGroup>
                        <InputGroupAddon>Phone Number</InputGroupAddon>
                        <InputText :value="getStaffDetails?.phone_number" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Gender</InputGroupAddon>
                        <InputText :value="getStaffDetails?.gender" disabled />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupAddon>Username</InputGroupAddon>
                        <InputText :value="getStaffDetails?.user?.username" disabled />
                    </InputGroup>
                </div>
            </div>
            <div class="card flex lg:flex-row flex-col gap-8">
                <div class="flex flex-col md:flex-row gap-4 w-full">

                    <InputGroup>
                        <InputGroupAddon>Email</InputGroupAddon>
                        <InputText :value="getStaffDetails?.user?.email" disabled />
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
import { useStaffDetailsStore } from '@/stores/staff_store/staff_details';
import ProgressSpinner from 'primevue/progressspinner'
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import helper from '@/services/helper';
import InputMask from 'primevue/inputmask';
import { useToast } from 'primevue/usetoast'


const { getStaffDetails } = storeToRefs(useStaffDetailsStore())
const { fetchStaffDetailsAction, updateStaff } = useStaffDetailsStore()

const toast = useToast()
const loading = ref(false)
const visible = ref(false)
const pageNotFound = ref(false)

const phone_number = ref('')
const surname = ref('')
const given_name = ref('')
const gender = ref('')
const email_address = ref('')
const user_type = "staff"

// Fetch data before page mounts
onBeforeMount(async () => {
    loading.value = true
    await fetchStaffDetailsAction()
        .then(() => {
            // Set the form fields after fetching data
            if (getStaffDetails.value) {
                surname.value = getStaffDetails.value.surname || ''
                given_name.value = getStaffDetails.value.given_name || ''
                gender.value = getStaffDetails.value.gender || ''
                email_address.value = getStaffDetails.value.email_address || ''
                phone_number.value = getStaffDetails.value.phone_number || ''
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
    const update_data = {
        user: {
            user_type: user_type,
            first_name: given_name.value,
            last_name: surname.value
        },
        surname: surname.value,
        given_name: given_name.value,
        phone_number: phone_number.value,
        gender: gender.value,
        email_address: email_address.value
    }

    updateStaff(update_data)
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