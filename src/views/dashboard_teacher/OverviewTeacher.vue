<template>
    <div class="flex flex-col gap-8">

        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-6 xl:col-span-3"
                style="padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">Active Academic Year</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                                {{ getOverview.active_academic_year }}
                            </div>
                        </div>
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                            style="width: 2.5rem; height: 2.5rem">
                            <img src="/img/academic_year.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-3"
                style="padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">Student enrolled in
                                this class</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                                {{ getOverview.total_students_in_class }}
                            </div>
                        </div>
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                            style="width: 2.5rem; height: 2.5rem">
                            <img src="/img/student_class.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-3"
                style="padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">Total Student in the School</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                                {{ getOverview.total_students_in_school }}
                            </div>
                        </div>
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                            style="width: 2.5rem; height: 2.5rem">
                            <img src="/img/school.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-3"
                style="padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">Total Teachers in the School</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                                {{ getOverview.total_teachers }}
                            </div>
                        </div>
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                            style="width: 2.5rem; height: 2.5rem">
                            <img src="/img/teacher_icon.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">Students Enrolled Per Month</div>
            <Chart type="bar" :data="chartData" :options="chartOptions" class="lg:h-[48rem]" />
        </div>

    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import Chart from 'primevue/chart';
import { useOverViewStore } from '@/stores/teacher_store/overview';
import { storeToRefs } from 'pinia';

const { fetchOverViewAction } = useOverViewStore();
const { getOverview } = storeToRefs(useOverViewStore());

const chartData = ref({});
const chartOptions = ref({});

onBeforeMount(async () => {
    await fetchOverViewAction()
        .then(() => {
            // Prepare data for the chart
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const labels = getOverview.value.students_enrolled_per_month.map(item => months[item.month - 1]);
            const data = getOverview.value.students_enrolled_per_month.map(item => item.total);

            chartData.value = {
                labels: labels,
                datasets: [
                    {
                        label: 'Students Enrolled',
                        backgroundColor: '#42A5F5',
                        data: data
                    }
                ]
            };

            chartOptions.value = {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Students'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Months'
                        }
                    }
                }
            };
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
        });
});
</script>

<style scoped></style>
