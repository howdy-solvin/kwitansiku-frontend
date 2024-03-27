<template>
    <div
        class="bg-[#B8E1FF] shadow-[inset_0_0_20px_2px_rgba(255,255,255,0.5)] rounded-xl flex flex-col items-center w-full px-3">

        <div class="logo mt-4 p-5">
            <slot name="logo"></slot>
        </div>

        <div class="flex flex-col mt-[60px] w-full gap-2">
            <slot name="navside"></slot>
        </div>

    </div>
</template>