<script>
    import { goto } from "$app/navigation";
    export let isDrawerOpen = false;
    export let toggleDrawer;

    function navigate() {
        goto('/');
    }
</script>

{#if isDrawerOpen}
    <button
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        on:click={toggleDrawer}
    ></button>

    <div
        class="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
        class:is-open={isDrawerOpen}
    >
        <div class="px-4 flex flex-col h-full">
            <div class="flex flex-col items-center mb-4 mt-5">
                <i class="fa-solid fa-user-circle text-8xl text-black"></i>
                <span class="mt-3 text-lg font-semibold text-black">Username</span>
                <hr class="w-full mt-2 border-gray-300" /> 
            </div>

            <ul class="flex flex-col flex-grow space-y-2 py-4">
                <li>
                    <button
                        class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-blue-400 duration-300 py-4 px-5 font-semibold w-full"
                        on:click={()=>goto("/users")}
                    >
                        <i class="fa-solid fa-home mr-3"></i> Home
                    </button>
                </li>
                <li>
                    <button
                        class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-blue-400 duration-300 py-4 px-5 font-semibold w-full"
                        on:click={()=>goto("/giveaccess")}
                    >
                        <i class="fa fa-users mr-3"></i> Access
                    </button>
                </li>
                <li>
                    <button
                        class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-blue-400 duration-300 py-4 px-5 font-semibold w-full"
                        on:click={() => goto("/settings")}
                        >
                        <i class="fa-solid fa-cog mr-3"></i> Settings
                    </button>
                </li>
            </ul>

            <div class="mt-auto pb-4"> 
                <button
                    class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-blue-400 duration-300 py-4 px-5 font-semibold w-full"
                    on:click={()=>goto("/login")}
                >
                    <i class="fa-solid fa-sign-out-alt mr-3"></i> Logout
                </button>
            </div>
        </div>
    </div>
{/if}
