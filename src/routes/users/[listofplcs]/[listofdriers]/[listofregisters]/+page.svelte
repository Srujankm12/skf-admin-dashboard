<script>
    import Drawer from '$lib/Drawer.svelte';
    import { fade } from 'svelte/transition';
    import { getregisters , getregistertypesforform , createregister } from '$lib/urls';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let isLoading = false;
    let registerData;
    let isCreating = false;
    let isDrawerOpen = false;
    let isModalOpen = false;
    let newregisteradress = '';
    let newregistertype = '';
    let newregisterlabel = '';
    let registertypes = [];
    let registerTypeError;
    let additionalFieldVisible = false;
    let newrecipestepcount ='';
    let newtimeortempdropdown = '';
    let newrecipelabel = '';
    



    export let data;

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const fetchRegisterData = async () => {
        isLoading = true;
        try {
            const response = await fetch(getregisters + $page.params.listofdriers + "/" + $page.params.listofregisters, {
                method: "GET",
            });
            if (response.ok) {
                const data = await response.json();
                registerData = data.registers.map(register => {
                    return {
                        ...register,
                        label: capitalizeFirstLetter(register.label)
                    };
                });
                console.log(data);
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

    let getRegisterTypes = async () => {
        try {
            const response = await fetch(getregistertypesforform+$page.params.listofdriers+'/'+$page.params.listofregisters , {
                method: "GET"
            });
            if(response.ok) {
                const data = await response.json();
                console.log(data['reg_types']);
                registertypes = data['reg_types'];
            }else{
                registerTypeError = await response.json();
            }
        } catch (error) {
            registerTypeError = error;
        }
    }
    let createRegister = async () => {
    isCreating = true; 
    try {
        let response;
        if (newregistertype == "rcp_stp") {
            response = await fetch(createregister + '/' + $page.params.listofdriers + '/' + $page.params.listofregisters, {
                method: "POST",
                body: JSON.stringify({
                    "reg_address": newregisteradress,
                    "reg_type": newregistertype + "_" + newrecipestepcount + "_" + newtimeortempdropdown,
                    "label": newregisterlabel,
                })
            });
        } else {
            response = await fetch(createregister + '/' + $page.params.listofdriers + '/' + $page.params.listofregisters, {
                method: "POST",
                body: JSON.stringify({
                    "reg_address": newregisteradress,
                    "reg_type": newregistertype,
                    "label": newregisterlabel,
                })
            });
        }

        if (response.ok) {
            isModalOpen = false;
            console.log("Register created successfully");
            window.location.reload();  // Reloads the page
        } else {
            console.error("Failed to create register:", await response.json());
        }
    } catch (error) {
        console.error("Error creating register:", error);
    } finally {
        isCreating = false; 
    }
};

onMount(fetchRegisterData);

    
    
    function handleTypeChange() {
        additionalFieldVisible = newregistertype === 'rcp_stp';
    }


   

    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    function toggleModal() {
        isModalOpen = !isModalOpen;
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        let hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${period}`;

        return { date: formattedDate, time: formattedTime };
    }
</script>

<div class="relative h-screen bg-white text-black">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="fixed top-1 left-4 p-4 text-2xl text-white rounded-xl transition duration-300 z-50" on:click={toggleDrawer}>
        <i class="fas fa-bars"></i>
    </button>

    <Drawer {isDrawerOpen} {toggleDrawer} />

    <div class="p-8">
        <h3 class="text-2xl font-bold mb-6 text-center">.  </h3>
        {#if isLoading}
            <div class="fixed inset-0 flex items-center justify-center z-50">
                <div class="w-16 h-16 border-6 border-t-8 border-blue-400 border-solid rounded-full animate-spin"></div>
            </div>
        {:else}
            <table class="w-full text-left border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                    <tr class="bg-blue-400 text-white">
                        <th class="py-4 px-6 text-center font-semibold">Sl No</th>
                        <th class="py-4 px-6 text-center font-semibold">Register Address</th>
                        <th class="py-4 px-6 text-center font-semibold">Tag Name</th>
                        <th class="py-4 px-6 text-center font-semibold">Value</th>
                        <th class="py-4 px-6 text-center font-semibold">Last Updated Date</th>
                        <th class="py-4 px-6 text-center font-semibold">Last Updated Time</th>
                        <th class="py-4 px-6 text-center font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each registerData as register, index}
                        <tr class="border-b hover:bg-gray-50">
                            <td class="py-4 px-6 text-center">{index + 1}</td>
                            <td class="py-4 px-6 text-center">{register.reg_address}</td>
                            <td class="py-4 px-6 text-center">{register.label}</td>
                            <td class="py-4 px-6 text-center">{register.value}</td>

                            <td class="py-4 px-6 text-center">
                                {#if register.last_update_timestamp}
                                    {formatTimestamp(register.last_update_timestamp).date}
                                {/if}
                            </td>

                            <td class="py-4 px-6 text-center">
                                {#if register.last_update_timestamp}
                                    {formatTimestamp(register.last_update_timestamp).time}
                                {/if}
                            </td>

                            <td class="py-4 px-6 text-center">
                                <!-- svelte-ignore a11y_consider_explicit_label -->
                                <button class="text-red-500 hover:text-red-700" title="Delete" on:click={() => toggleModal()}>
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="w-16 h-16 bg-blue-400 fixed bottom-12 right-8 text-white text-3xl font-medium rounded-full shadow-xl flex items-center justify-center z-20" on:click={() => {toggleModal();getRegisterTypes()}}>
            <i class="fas fa-plus"></i>
        </button>
    </div>

    {#if isModalOpen}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" transition:fade>
            <div class="max-w-md w-full bg-white rounded-3xl p-6 shadow-lg relative">
                <h3 class="text-center text-2xl py-4 mb-4 font-bold">Create New Register</h3>
                <form on:submit|preventDefault={createRegister}>
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
                        <label class="block text-black text-xl font-semibold mb-2" for="RegisterType"></label>
                        <select
                            id="RegisterType"
                            bind:value={newregistertype}
                            on:change={handleTypeChange}
                            class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        > 
                            <option value="" disabled>Select a reg_type</option>
                            {#each registertypes as rt}
                                <option value={rt.type}>{rt.label}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="mb-8">
                        <label class="block text-black text-xl font-semibold mb-2" for="label"></label>
                        <input
                            id="label"
                            type="text"
                            bind:value={newregisterlabel}
                            placeholder="Lable name"
                            class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {#if additionalFieldVisible}
                        <div class="mb-8">
                            <label class="block text-black text-xl font-semibold mb-2" for="recipe step count"></label>
                            <input
                                id="Newrecipestepcount"
                                type="text"
                                bind:value={newrecipestepcount}
                                placeholder=" Recepie Step count"
                                class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div class="mb-8">
                            <label class="block text-black text-xl font-semibold mb-2" for="NewDropdownField"></label>
                            <select
                                id="NewDropdownField"
                                bind:value={newtimeortempdropdown}
                                class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="" >Select </option>
                                <option value="tm">time</option>
                                <option value="tp">temperature</option>
                            </select>
                        </div>
                       
                    {/if}

                    <div class="flex items-center justify-between mb-8">
                        <button
                        type="submit"
                        class="w-full bg-blue-400 text-white text-xl py-2 px-4 rounded-lg shadow-md flex items-center justify-center"
                    >
                        {#if isCreating}
                            <!-- Center the spinner by using flex and setting it to `animate-spin` -->
                            <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-white border-solid border-transparent"></div>
                        {:else}
                            <!-- Show Submit text when isCreating is false -->
                            Submit
                        {/if}
                    </button>
                    </div>
                </form>

                <button
                    class="absolute top-2 right-2 text-xl text-gray-700"
                    on:click={toggleModal}
                    aria-label="Close Modal"
                >
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    {/if}
</div>

