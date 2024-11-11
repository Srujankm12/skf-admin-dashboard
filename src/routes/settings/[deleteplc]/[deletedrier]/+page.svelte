<script>
    import { getdriers, deletedrier } from '$lib/urls';
    import { onMount } from 'svelte';
    import Drawer from '$lib/Drawer.svelte';
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';

    let drierList ;
    let isDrawerOpen = false;
    let isLoading = false;
    let showDeleteModal = false;
    let deleteErrorMessage = '';
    let drierNameToDelete = '';
    let drierIdToDelete='';
    let drierNameInput = '';
    let responseMessage = '';
    let loading =false;
    export let data;

    const fetchdrier = async () => {
        isLoading = true;
        try {
            const response = await fetch(getdriers + data.deletedrier, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                drierList = data.driers;
                drierList = data.driers.map(drier => ({
                ...drier,
                label: `${drier.label[0].toUpperCase()}${drier.label.slice(1).toLowerCase()}`
            }));

                console.log(data); // You can remove this line for production
                isLoading = false;
            } else {
                const errorData = await response.json();
                console.error('Error fetching driers:', errorData.message);
                isLoading = false;
            }
        } catch (error) {
            console.error('Error fetching driers:', error);
            isLoading = false;
        }
    };

    const deleteDrier = async () => {
        if (drierNameInput !== drierNameToDelete) {
            deleteErrorMessage = 'Drier name does not match. Please enter the correct name.';
            return;
        }
        isLoading = true;
        try {
            const response = await fetch(
                deletedrier+$page.params.deletedrier+'/'+drierIdToDelete,
                {
                    method: 'GET',  
                }
            );
            const result = await response.json();
            if (response.ok) {
                showDeleteModal = false;
                drierNameToDelete = '';
                drierNameInput = '';
                deleteErrorMessage = '';
                await fetchdrier();
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
        fetchdrier();
    });

    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    function openDeleteModal(drier) {
        drierNameToDelete = drier.label;
        showDeleteModal = true;
        drierNameInput = '';
        deleteErrorMessage = '';
        drierIdToDelete=drier.drier_id;
    }

    function closeModal() {
        showDeleteModal = false;
        drierNameToDelete = '';
        deleteErrorMessage = '';
    }
</script>

<div class="relative h-screen bg-white text-black">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="fixed top-1 left-4 p-4 text-2xl  text-white   transition duration-300 z-50"
        on:click={toggleDrawer}
    >
        <i class="fas fa-bars"></i>
    </button>

    <Drawer {isDrawerOpen} {toggleDrawer} />

    <div class="p-8">
        <h2 class="text-3xl font-bold mb-6 mx-10 text-center justify-center">Manage Driers</h2>

        <div class="relative overflow-y-auto flex flex-col items-center">
            {#if isLoading}
            <div class="fixed inset-0 flex items-center justify-center z-40">
                <div class="w-16 h-16 border-6 border-t-8 border-blue-400 border-solid rounded-full animate-spin"></div>
            </div>
            {:else}
                <div class="w-full max-w-full grid grid-cols-3 gap-10 px-10 py-10">
                    {#each drierList as drier}
                    <div class="border-b-[5px] border-l-[5px] border-blue-400 rounded-2xl px-6 py-6 bg-white flex flex-col h-24 duration-75 hover:border-l-0 hover:border-b-0 shadow-lg">
                        <div class="flex items-center justify-between rounded-lg p-2">
                            <span class="text-gray-800 font-semibold text-lg">
                                {drier.label.length > 20 ? drier.label.slice(0, 20) + '...' : drier.label}
                            </span>
                            <div class="flex items-center space-x-3">
                                <!-- svelte-ignore a11y_consider_explicit_label -->
                                <button class="text-red-600" on:click={() => openDeleteModal(drier)}>
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
            <p class="text-gray-700 mb-4">Are you sure you want to delete the drier: <strong>{drierNameToDelete}</strong>?</p>
            <p class="text-gray-600 mb-4">Type the drier name below to confirm:</p>
            <input
                name="drierNameInput"
                type="text"
                placeholder="Enter Drier Name"
                class="w-full p-3 border border-gray-300 rounded-lg text-lg mb-4"
                bind:value={drierNameInput}
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
                    on:click={deleteDrier}
                    disabled={loading}
                >
                {#if loading}
                <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-white border-solid border-transparent"></div>
            {:else}
                Delete
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
