<script>

    import { goto } from '$app/navigation';
    import Drawer from '$lib/Drawer.svelte';
    import Successmessage from '$lib/successmessage.svelte';
    import { createuser, getusers } from '$lib/urls';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    
    let usersList = [];
    let newuserlabel = '';
    let newuseremail = '';
    let newuserpassword = '';
    let sucessmessage = '';
    let isLoading = false;
    let isUserAddedLoading = false;
    let noUsersAvailable = false;
    let isDrawerOpen = false;
    let isModalOpen = false;

    const fetchUsers = async () => {
        isLoading = true;
        try {
            const response = await fetch(getusers, {
                method: "GET",  
            });
            if (response.ok) {
                
                const data = await response.json();
                console.log(data.users)
                usersList = data.users;

                //noUsersAvailable = usersList.length === 0;
                isModalOpen = false;
            } else {
                const errorData = await response.json();
                console.error("Error fetching users:", errorData['message']);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            isLoading = false;
        }
    };

    const CreateUser = async () => {

        isUserAddedLoading = true;
        try {
            const response = await fetch(createuser, {
                method: "POST",
                body: JSON.stringify({ label: newuserlabel, email: newuseremail, password: newuserpassword }),
            });

            if (response.ok) {
                newuserlabel = '';
                newuseremail = '';
                newuserpassword = '';
                isModalOpen = false;
                sucessmessage = 'User created successfully!';
                setTimeout(() => sucessmessage = '', 2000);
                await fetchUsers();
            } else {
                const errorData = await response.json();
                console.error("Error creating user:", errorData["message"]);
            }
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            isUserAddedLoading = false;
        }
    };

    onMount(fetchUsers);

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
        class="fixed top-4 left-4 p-4 text-1xl bg-blue-400 text-white rounded-xl shadow-2xl transition duration-300"
        on:click={toggleDrawer}
    >
        <i class="fas fa-bars"></i>
    </button>

    <Drawer {isDrawerOpen} {toggleDrawer} />

    <div class="p-8">
        <h2 class="text-3xl font-bold mb-6 mx-10">Users</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {#each usersList as  user}
                <div class="p-4">
                    <div class="border-b-[5px] border-l-[5px] border-blue-400 rounded-2xl p-6 bg-white flex flex-col h-72 duration-75 hover:border-l-0 hover:border-b-0 shadow-lg">
                        <span class="text-start mt-2 text-2xl font-semibold">{user.label}</span>
                        <div class="flex-grow"></div>
                        <button class="text-xl p-3 rounded-lg bg-blue-400 text-white font-bold self-end"
                            on:click={() => goto("/users/"+user.user_id)}
                        >
                            Manage
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="w-16 h-16 bg-blue-400 fixed bottom-12 right-8 text-white text-3xl font-medium rounded-full shadow-xl flex items-center justify-center"
        on:click={toggleModal}
    >
        <i class="fas fa-plus"></i>
    </button>

    {#if isModalOpen}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" transition:fade>
            <div class="max-w-md w-full bg-white rounded-3xl p-6 shadow-lg relative">
                <h3 class="text-center text-2xl py-4 mb-4 font-bold">Create New User</h3>
                
                <form on:submit={CreateUser}>
                    <div class="mb-8">
                        <label class="block text-black text-xl font-semibold mb-2" for="label"></label>
                        <input
                            id="label"
                            type="text"
                            bind:value={newuserlabel}
                            placeholder="Label Name"
                            class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-blue-400 focus:shadow-outline"
                        />
                    </div>
                    <div class="mb-8">
                        <label class="block text-black text-xl font-semibold mb-2" for="email"></label>
                        <input
                            id="email"
                            type="email"
                            bind:value={newuseremail}
                            placeholder="Email-Id"
                            class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-blue-400 focus:shadow-outline"
                        />
                    </div>
                    <div class="mb-8">
                        <label class="block text-black text-xl font-semibold mb-2" for="password"></label>
                        <input
                            id="password"
                            type="password"
                            bind:value={newuserpassword}
                            placeholder="Password"
                            class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-blue-400 focus:shadow-outline"
                        />
                    </div>
                    <div class="flex items-center justify-center">
                        <button
                            type="submit"
                            class="bg-blue-400 text-white font-bold py-3 px-4 text-lg rounded-lg w-full flex items-center justify-center"
                            
                        >
                        {#if isUserAddedLoading}
                        <div class="button-spinner"></div>
                    {:else}
                        Add
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

    {#if sucessmessage}
        <Successmessage successMessage={sucessmessage} />
    {/if}
</div>
<style>
    .spinner, .button-spinner {
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .spinner {
        border: 8px solid rgba(0, 0, 0, 0);
        border-top: 8px solid black;
        width: 64px;
        height: 64px;
    }
    
    .button-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top: 4px solid #ffffff;
        width: 24px;
        height: 24px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
