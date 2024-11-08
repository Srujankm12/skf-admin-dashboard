<script>
    import Drawer from '$lib/Drawer.svelte';
    import { fade } from 'svelte/transition';
    import { getregisters , createregister} from '$lib/urls';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';


    let isLoading = false;
    let registerData ;
    let isregisternotpresent =false;
    let responsemessage = '';
    let isCreating = false;
    let isDrawerOpen = false;
    let isModalOpen = false;
    let newregisteradress = '';
    let newregistertype = '';
    let newregisterlabel = '';
    let createRegisterID = '';
   

    export let data;

    
const fetchRegisterData = async () =>{
    isLoading =true;
    try {
        const response = await fetch(getregisters + $page.params.listofdriers + "/" + $page.params.listofregisters,{
            method:"GET",
        });
        if (response.ok) {
            const data = await response.json();
            registerData = data.registers;
            console.log(data)
            isModalOpen = false;
        } else {
            const errorData = await response.json();
            console.error("Error fetching registers:", errorData['message']);
        }
    } catch (error) {
        console.error("Error fetching registers:", error);
    } finally {
        isLoading = false;
    }
};
    //create register

    const addRegister = async () => {

isCreating = true;
try {
    const response = await fetch(createdrier +data.listofdriers,{
        method:"POST",
        //credentials: "include",
        body:JSON.stringify({ reg_address: newregisteradress, label : newregisterlabel , })
    });

const result = await response.json();
if(response.ok){
    isModalOpen =false;
    createRegisterID = '';
    responsemessage = 'Drier added successfully';
    setTimeout(() => successmessage = '', 2000);
    await fetchdrier();
    
}else{
    responsemessage = result.message || 'unexpected error';
}
    
} catch (error) {
    
    responsemessage = 'Fetch error: ' + error;
} finally {
     isCreating = false;
    }
};

    onMount(fetchRegisterData);
    
    
    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    function toggleModal() {
        isModalOpen = !isModalOpen;
    }

    function toggleDeleteModal() {
       
        showDeleteModal = true;
    }
   function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        
        // Extract hours, minutes, and seconds in UTC
        let hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        // Determine AM or PM
        const period = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle 0 as 12
        
        // Format hours, minutes, and seconds
        const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${period}`;
        return formattedTime;
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
        <h3 class="text-2xl font-bold mb-6 text-center">Registers</h3>
        <table class="w-full text-left border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
                <tr class="bg-blue-400 text-white">
                    <th class="py-4 px-6 text-center font-semibold">Sl No</th>
                    <th class="py-4 px-6 text-center font-semibold">Register Address</th>
                    <th class="py-4 px-6 text-center font-semibold">Tag Name</th>
                    <th class="py-4 px-6 text-center font-semibold">Value</th>
                    <th class="py-4 px-6 text-center font-semibold">Last Updated Time</th>
                    <th class="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each registerData as register, index}
                    <tr class="border-b hover:bg-gray-50">
                        <td class="py-4 px-6 text-center">{index+1}</td>
                        <td class="py-4 px-6 text-center">{register.reg_address}</td>
                        <td class="py-4 px-6 text-center">{register.label}</td>
                        <td class="py-4 px-6 text-center">{register.value}</td>
                        <td class="py-4 px-6 text-center">
                            {formatTimestamp(register.last_update_timestamp)}
                        </td>
                        <td class="py-4 px-6 text-center">
                            <!-- svelte-ignore a11y_consider_explicit_label -->
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

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            class="w-16 h-16 bg-blue-400 fixed bottom-12 right-8 text-white text-3xl font-medium rounded-full shadow-xl flex items-center justify-center"
            on:click={toggleModal}
        >
            <i class="fas fa-plus"></i>
        </button>
    </div>
    
    <!-- {#if showDeleteModal}
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
    {/if} -->


    {#if isModalOpen}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" transition:fade>
            <div class="max-w-md w-full bg-white rounded-3xl p-6 shadow-lg relative">
                <h3 class="text-center text-2xl py-4 mb-4 font-bold">Create New Register</h3>
                <form on:submit|preventDefault={addRegister}>
                    <div class="mb-8">
                        <label class="block text-black text-xl font-semibold mb-2" for="RegisterAdress"></label>
                        <input
                            id="RegisterAdress"
                            type="text"
                            bind:value={newregisteradress}
                            placeholder="Register Address"
                            class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div class="mb-8">
                        <label class="block text-black text-xl font-semibold mb-2" for="TagName"></label>
                        <input
                            id="TagName"
                            type="text"
                            bind:value={newregisterlabel}
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
