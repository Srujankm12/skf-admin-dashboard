<script>
    import { goto } from '$app/navigation';
    import Drawer from '$lib/Drawer.svelte';
    import { createplc, getplc } from '$lib/urls';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    let isLoading = true;
    let plclist = [];
    let noplcAvailable = true;
    let isCreating = false;
    let newplclabel = '';
    let newplcid = '';
    let createPlcID = '';
    let responsemessage = '';
    let isDrawerOpen = false;
    let isModalOpen = false;
    let successmessage = '';
    export let data;

    const fetchplc = async () => {
        isLoading = true;
        try {
            const response = await fetch(getplc + data.listofplcs, {
                method: "GET",
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched PLCs:", data);
                plclist = data.plcs;
                noplcAvailable = plclist.length === 0; // Ensure this is being set correctly
                console.log("No PLCs Available:", noplcAvailable); // Debugging line
                isModalOpen = false;
            } else {
                const errorData = await response.json();
                console.error("Error fetching plcs:", errorData['message']);
            }
        } catch (error) {
            console.error("Error fetching plcs:", error);
        } finally {
            isLoading = false;
        }
    };

    const addPlc = async () => {
        isCreating = true;
        try {
            const response = await fetch(createplc + data.listofplcs, {
                method: "POST",
                body: JSON.stringify({ plc_id: newplcid, label: newplclabel, user_id: data.listofplcs }),
            });

            const result = await response.json();
            if (response.ok) {
                isModalOpen = false;
                createPlcID = '';
                newplcid = '';
                newplclabel = '';
                responsemessage = 'Plc added successfully';
                setTimeout(() => successmessage = '', 2000);
                await fetchplc();
            } else {
                responsemessage = result.message || 'Unexpected error';
            }
        } catch (error) {
            responsemessage = 'Fetch error: ' + error;
        } finally {
            isCreating = false;
        }
    };

    onMount(fetchplc);

    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    function toggleModal() {
        isModalOpen = !isModalOpen;
    }
</script>

<div class="relative h-screen bg-white text-black">
  
   <!-- svelte-ignore a11y_consider_explicit_label -->
   <button
        class="fixed top-4 left-4 p-4 text-1xl bg-blue-400 text-white rounded-xl shadow-2xl transition duration-300 z-50"
        on:click={toggleDrawer}
    >
        <i class="fas fa-bars"></i>
    </button> 

   <Drawer {isDrawerOpen} {toggleDrawer} /> 
    
   <div class="p-8">
    <h2 class="text-3xl font-bold mb-6 mx-10">PLC</h2>
    
    {#if isLoading}
        <div class="fixed inset-0 flex items-center justify-center z-40">
            <div class="w-16 h-16 border-6 border-t-8 border-blue-400 border-solid rounded-full animate-spin"></div>
        </div>
    {:else if noplcAvailable}
        <!-- No PLCs Available Message -->
        <div class="center flex-col text-center justify-center z-30">
            <i class="fa-solid fa-user-slash text-8xl mb-4"></i>
            <h1 class="text-4xl font-bold">No PLCs available</h1>
        </div>
    {:else}
        <!-- PLC List Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 z-0">
            {#each plclist as plc}
                <div class="p-4">
                    <div class="border-b-[5px] border-l-[5px] border-blue-400 rounded-2xl p-6 bg-white flex flex-col h-72 duration-75 hover:border-l-0 hover:border-b-0 shadow-lg">
                        <span class="text-start mt-2 text-2xl font-semibold">{plc.plc_id}</span>
                        <div class="flex-grow"></div>
                        <button class="text-xl p-3 rounded-lg bg-blue-400 text-white font-bold self-end"
                            on:click={() => goto("/users/" + data.listofplcs + "/" + plc.plc_id)}>
                            Manage
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
    class="w-16 h-16 bg-blue-400 fixed bottom-12 right-8 text-white text-3xl font-medium rounded-full shadow-xl flex items-center justify-center z-50"
    on:click={toggleModal}
>
    <i class="fas fa-plus"></i>
</button>

{#if isModalOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade>
        <div class="max-w-md w-full bg-white rounded-3xl p-6 shadow-lg relative">
            <h3 class="text-center text-2xl py-4 mb-4 font-bold">Create New PLC</h3>
            
            <form on:submit|preventDefault={addPlc}>
                <div class="mb-8">
                    <label class="block text-black text-xl font-semibold mb-2" for="label"></label>
                    <input
                        id="label"
                        type="text"
                        bind:value={newplclabel}
                        placeholder="Label"
                        class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-blue-400 focus:shadow-outline"
                    />
                </div>
                <div class="mb-8">
                    <label class="block text-black text-xl font-semibold mb-2" for="label"></label>
                    <input
                        id="label"
                        type="text"
                        bind:value={newplcid}
                        placeholder="PLC ID"
                        class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-blue-400 focus:shadow-outline"
                    />
                </div>

                <div class="flex items-center justify-center">
                    <button
                        type="submit"
                        class="bg-blue-400 text-white font-bold py-3 px-4 text-lg rounded-lg w-full flex items-center justify-center"
                    >
                        
                        {#if isCreating}
                        <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-white border-solid border-transparent"></div>
                        {:else}
                            ADD
                        {/if}
                    </button>
                </div>
            </form>
            <button
                class="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-red-500 duration-300"
                on:click={toggleModal}
            >
                &times;
            </button>
        </div>
    </div>
{/if}
</div>

<style>
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
    }
</style>
