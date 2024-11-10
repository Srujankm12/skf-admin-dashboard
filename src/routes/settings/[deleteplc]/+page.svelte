<script>
    import { getplc, deleteplc } from '$lib/urls'; // Ensure correct imports
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import Drawer from '$lib/Drawer.svelte';
    import { fade } from 'svelte/transition';

    let plclist = [];
    let isDrawerOpen = false;
    let isLoading = false; 
    let showDeleteModal = false;
    let plcNameInput = '';
    let plcIdToDelete = '';
    let plcNameToDelete = '';
    let deleteErrorMessage = '';
    let responseMessage = '';
    let isplcdeleteLoading = false;

    export let data;

    // Fetch PLCs
    const fetchplc = async () => {
        isLoading = true;
        try {
            const response = await fetch(getplc + data.deleteplc, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                plclist = data.plcs;
                isLoading = false;
            } else {
                const errorData = await response.json();
                console.error("Error fetching plcs:", errorData['message']);
                isLoading = false;
            }
        } catch (error) {
            console.error("Error fetching plcs:", error);
            isLoading = false;
        }
    };

    // Delete PLC
    const deletePlc = async () => {
        if (plcNameInput !== plcNameToDelete) {
            deleteErrorMessage = 'PLC name does not match. Please enter the correct name.';
            return;
        }
        isLoading = true;
        try {
            const response = await fetch(
                deleteplc + plcIdToDelete,
                {
                    method: 'GET',
                }
            );
            const result = await response.json();
            if (response.ok) {
                showDeleteModal = false;
                plcNameToDelete = '';
                plcNameInput = '';
                deleteErrorMessage = '';
                await fetchplc();
            } else {
                responseMessage = result.message || 'Unexpected error';
            }
        } catch (error) {
            responseMessage = 'Fetch error: ' + error.message;
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        fetchplc();
    });

    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    function openDeleteModal(plc) {
        plcNameToDelete = plc.plc_id;
        showDeleteModal = true;
        plcNameInput = '';
        deleteErrorMessage = '';
        plcIdToDelete = plc.plc_id;
    }

    function closeModal() {
        showDeleteModal = false;
        plcNameToDelete = '';
        deleteErrorMessage = '';
    }

</script>

<div class="relative h-screen bg-white text-black">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="fixed top-4 left-4 p-4 text-1xl bg-blue-400 text-white rounded-xl shadow-2xl transition duration-300"
        on:click={toggleDrawer}
    >
        <i class="fas fa-bars"></i>
    </button>

    <Drawer {isDrawerOpen} {toggleDrawer} />

    <div class="p-8">
        <h2 class="text-3xl font-bold mb-6 mx-10 text-center justify-center">Manage PLCs</h2>

        <div class="relative overflow-y-auto flex flex-col items-center">
            {#if isLoading}
            <div class="fixed inset-0 flex items-center justify-center z-40">
                <div class="w-16 h-16 border-6 border-t-8 border-blue-400 border-solid rounded-full animate-spin"></div>
            </div>
            {:else}
                <div class="w-full max-w-full grid grid-cols-3 gap-10 px-10 py-10">
                    {#each plclist as plc}
                    <div class="border-b-[5px] border-l-[5px] border-blue-400 rounded-2xl px-6 py-6 bg-white flex flex-col h-24 duration-75 hover:border-l-0 hover:border-b-0 shadow-lg">
                        <div class="flex items-center justify-between rounded-lg p-2">
                            <span class="text-gray-800 font-semibold text-lg">
                                {plc.plc_id}
                            </span>
                            <div class="flex items-center space-x-3">
                                <button class="bg-blue-400 text-white font-medium rounded-md px-4 py-2 transition-colors hover:bg-blue-500"
                                    on:click={() => goto("/settings/"+data.deleteplc+"/"+plc.plc_id)}
                                >
                                    Manage
                                </button>
                                <!-- svelte-ignore a11y_consider_explicit_label -->
                                <button class="text-red-600"
                                    on:click={() => openDeleteModal(plc)}
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>

{#if showDeleteModal}
<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-6" transition:fade>
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 class="text-xl font-bold mb-4">Confirm Deletion</h1>
        <p class="text-gray-700 mb-4">Are you sure you want to delete the PLC: <strong>{plcNameToDelete}</strong>?</p>
        <p class="text-gray-600 mb-4">Type the PLC name below to confirm:</p>
        <input
            name="plcNameInput"
            type="text"
            placeholder="Enter PLC Name"
            class="w-full p-3 border border-gray-300 rounded-lg text-lg mb-4"
            bind:value={plcNameInput}
        />
        {#if deleteErrorMessage}
            <p class="text-red-500 mb-4">{deleteErrorMessage}</p>
        {/if}
        {#if responseMessage}
            <p class="text-red-500 mb-4">{responseMessage}</p>
        {/if}
        <div class="flex justify-between">
            <button
                class="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                on:click={deletePlc}
                disabled={isLoading}
            >
            {#if isplcdeleteLoading}
            <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-white border-solid border-transparent"></div>
            {:else}
                Add
            {/if}
            </button>
            <button
                class="bg-white shadow-lg text-gray-800 font-bold py-2 px-4 rounded-lg"
                on:click={closeModal}
            >
                Cancel
            </button>
        </div>
    </div>
</div>
{/if}
