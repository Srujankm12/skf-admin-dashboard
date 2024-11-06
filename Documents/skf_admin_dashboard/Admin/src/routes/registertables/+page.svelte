<script>
    import { onMount } from 'svelte';
    import Drawer from '$lib/Drawer.svelte';
    import { fade } from 'svelte/transition';
    
    let isDrawerOpen = false;
    let isModalOpen = false;
    let showDeleteModal = false;
    let unitId = '';
   
    let deleteErrorMessage = '';
    let isLoading = false;
    
    let registers = [
        { id: 1, address: '001', name: 'Real Time Temperature', value: '10.00' },
        { id: 2, address: '002', name: 'Real Time Temperature', value: '20.00' },
    ];

    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    function toggleModal() {
        isModalOpen = !isModalOpen;
    }

    function toggleDeleteModal() {
       
        showDeleteModal = true;
    }

    function deleteMachine() {
      
        
        isLoading = true;
        
    //     // Simulate deletion (e.g., API call)
    //     setTimeout(() => {
    //         registers = registers.filter(register => register.id !== unitIdToDelete);
    //         isLoading = false;
    //         showDeleteModal = false;
    //     }, 1000);
    }

    function Registermachies() {
        console.log('registering:', );
        toggleModal();
    }
</script>

<div class="relative h-screen bg-white text-black">
    <button
        class="fixed top-4 left-4 p-4 text-1xl bg-blue-400 text-white rounded-xl shadow-2xl transition duration-300"
        on:click={toggleDrawer}
    >
        <i class="fas fa-bars"></i>
    </button>

    <Drawer {isDrawerOpen} {toggleDrawer} />

    <div class="p-8">
        <h3 class="text-2xl font-bold mb-6 text-center">Registers</h3>
        <table class="w-full text-left border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
                <tr class="bg-blue-400 text-white">
                    <th class="py-4 px-6 text-center font-semibold">Sl No</th>
                    <th class="py-4 px-6 text-center font-semibold">Register Address</th>
                    <th class="py-4 px-6 text-center font-semibold">Tag Name</th>
                    <th class="py-4 px-6 text-center font-semibold">Value</th>
                    <th class="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each registers as register}
                    <tr class="border-b hover:bg-gray-50">
                        <td class="py-4 px-6 text-center">{register.id}</td>
                        <td class="py-4 px-6 text-center">{register.address}</td>
                        <td class="py-4 px-6 text-center">{register.name}</td>
                        <td class="py-4 px-6 text-center">{register.value}</td>
                        <td class="py-4 px-6 text-center">
                            <button
                                class="text-red-500 hover:text-red-700"
                                title="Delete"
                                on:click={() => toggleDeleteModal()}
                            >
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <button
            class="w-16 h-16 bg-blue-400 fixed bottom-12 right-8 text-white text-3xl font-medium rounded-full shadow-xl flex items-center justify-center"
            on:click={toggleModal}
        >
            <i class="fas fa-plus"></i>
        </button>
    </div>
    
    {#if showDeleteModal}
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-6" transition:fade>
            <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 class="text-xl font-bold mb-4">Confirm Deletion</h1>
                <p class="text-gray-700 mb-4">Are you sure you want to delete : <strong></strong>?</p>
                <p class="text-gray-600 mb-4">Type the " " below to confirm:</p>
                <input
                    bind:value={unitId}
                    name="unitIdInput"
                    type="text"
                    placeholder="Enter "
                    class="w-full p-3 border border-gray-300 rounded-lg text-lg mb-4 focus:outline-blue-400"
                    
                />
                {#if deleteErrorMessage}
                    <p class="text-red-500 mb-4">{deleteErrorMessage}</p>
                {/if}
                <div class="flex justify-between">
                    <button
                        class="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                        on:click={deleteMachine}
                        disabled={isLoading}
                    >
                        {#if isLoading}
                            <div class="spinner-delete"></div>
                        {:else}
                            <i class="fas fa-trash-alt mr-2"></i> Delete
                        {/if}
                    </button>
                    <button
                        class="bg-blue-400 shadow-lg text-white font-bold py-2 px-4 rounded-lg"
                        on:click={() => showDeleteModal = false}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    {/if}


    {#if isModalOpen}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" transition:fade>
            <div class="max-w-md w-full bg-white rounded-3xl p-6 shadow-lg relative">
                <h3 class="text-center text-2xl py-4 mb-4 font-bold">Create New Register</h3>
                <form on:submit|preventDefault={Registermachies}>
                    <div class="mb-8">
                        <label class="block text-black text-xl font-semibold mb-2" for="RegisterAdress"></label>
                        <input
                            id="RegisterAdress"
                            type="text"
                          
                            placeholder="Register Address"
                            class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div class="mb-8">
                        <label class="block text-black text-xl font-semibold mb-2" for="TagName"></label>
                        <input
                            id="TagName"
                            type="text"
                           
                            placeholder="Tag Name"
                            class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div class="flex items-center justify-center">
                        <button
                            type="submit"
                            class="bg-blue-400 text-white font-bold py-3 px-4 text-lg rounded-lg w-full flex items-center justify-center"
                        >
                            REGISTER
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
