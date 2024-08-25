<template>
    <div class="relative w-full h-dvh pt-24">
        <!-- Background Container -->
        <div class="absolute inset-0 bg-[url('/img/school_area.jpg')] bg-no-repeat bg-cover bg-center filter blur-lg">
        </div>

        <!-- Content Section -->
        <section class="relative z-10 bg-white w-full">
            <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div class="mx-auto max-w-screen-sm text-center">
                    <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-[#1997FF]">
                        404</h1>
                    <p class="mb-4 text-3xl tracking-tight font-bold text-[#1997FF] md:text-4xl">
                        Something's missing.</p>
                    <p class="mb-4 text-lg font-light text-gray-500">Sorry, we can't find that page.
                        You can try logging in to your portal. </p>
                    <router-link :to="{ name: 'login' }"
                        class="inline-flex text-white bg-[#1997FF] border-[3px] hover:border-[#abc6db] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Back
                        to Login</router-link>
                    <img src="/img/not-found.png" class="w-[30%] m-auto" alt="">
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>

</script>

<style scoped></style>
