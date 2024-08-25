<template>
    <div>
        <div class="reportLayout">
            <!-- School Information -->
            <div class="report-header">
                <h1>{{ schoolName }}</h1>
                <img src="/img/school_logo.png" alt="">
                <h2>STUDENT REPORT CARD</h2>
            </div>
            <!-- Student and Teacher Information -->
            <div class="report-info">
                <div>
                    <p><strong>Student Name:</strong> {{ student_value }}</p>
                    <p><strong>Teacher:</strong> {{ teacherName }}</p>
                    <p><strong>Class:</strong> {{ classGrade }}</p>
                </div>
                <div>
                    <p><strong>Exams:</strong> {{ exam }}</p>
                    <p><strong>Term:</strong> {{ termValue }}</p>
                    <p><strong>Year:</strong> {{ yearValue }}</p>
                </div>
            </div>
            <!-- Results Table -->
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Grade</th>
                        <th>Remark</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="result in resultTableValues" :key="result.id">
                        <td>{{ result.subject }}</td>
                        <td>{{ result.marks }}%</td>
                        <td>{{ result.grade }}</td>
                        <td>{{ result.remark }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';




const props = defineProps(['resultTableValues', 'yearValue', 'termValue', 'student_value', 'exam', 'teacherName', 'classGrade'])

const resultTableValues = computed(() => props.resultTableValues)
const termValue = computed(() => props.termValue)
const yearValue = computed(() => props.yearValue)
const student_value = computed(() => props.student_value)
const exam = computed(() => props.exam)
const teacherName = computed(() => props.teacherName)
const classGrade = computed(() => props.classGrade)
const schoolName = "DEKS INSTITUTE";
console.log(yearValue.value);

// Replace this with the actual data
// const resultTableValues = ref([
//     { "subject": "Mathematics", "marks": 90, "grade": 1, "remark": "Excellent", "id": 3 },
//     { "subject": "I. C. T.", "marks": 65, "grade": 4, "remark": "High Average", "id": 4 }
// ]);

</script>

<style scoped></style>
