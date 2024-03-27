<template>
    <div class="flex font-poppins justify-evenly h-screen items-center rounded-xl">

        <!-- //!SECTION main content -->
        <main class="login-container w-[20%] flex flex-col gap-4">

            <div>
                <slot name="icon"></slot>
            </div>
            <div class=" flex flex-col">
                <slot name="login"></slot>
            </div>
            <div class="flex items-center justify-center gap-2 mt-1">
                <slot name="regis"></slot>
            </div>
        </main>

        <!-- //!SECTION side content -->
        <aside class=" side-content h-[40%] w-[20%] bg-slate-400 text-center flex items-center justify-center">
            <slot name="side"></slot>
        </aside>
    </div>
    <main></main>
</template>
