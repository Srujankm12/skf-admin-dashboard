<script>
    import { goto } from "$app/navigation";
    import { getusers } from "$lib/urls";
    import { onMount } from "svelte";

    export let isDrawerOpen = false;
    export let toggleDrawer;

    let isLoading = false;
    let usersList = {}; // Changed to an object to store user details
    let isModalOpen = false;

    // Fetch user data function
   // Inside your script
let username = ''; // Variable to hold the trimmed username

const fetchuser = async () => {
    isLoading = true;
    try {
        const response = await fetch(getusers, {
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
            usersList = data.users.length ? data.users[0] : {};
            console.log(usersList) // Store the first user
            
            // Extract the username portion before '@' in the email
            username = usersList.email ? usersList.email.split('@')[0] : "No Username Available";
            console.log(username);
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


    // Call fetchuser when the component is mounted
    onMount(fetchuser);
</script>

{#if isDrawerOpen}
    <!-- Backdrop for Drawer -->
    <button
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        on:click={toggleDrawer}
    ></button>

    <!-- Drawer Menu -->
    <div
        class="fixed inset-y-0 left-0 w-60 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out rounded-r-2xl"
        class:is-open={isDrawerOpen}
    >
        <div class="px-4 flex flex-col h-full">
            <!-- User Profile Section -->
            <div class="flex flex-col items-center mb-4 mt-5">
                <i class="fa-solid fa-user-circle text-8xl text-blue-400 "></i>
                <span class="mt-3 text-lg font-semibold text-black ">
                    {#if username}
                        {username}
                    {:else}
                        No Email Available
                    {/if}
                </span>
                <hr class="w-full mt-2 border-gray-300" /> 
            </div>

            <!-- Navigation Links -->
            <ul class="flex flex-col flex-grow space-y-2 py-4">
                <li>
                    <button
                        class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-blue-400 duration-300 py-4 px-5 font-semibold w-full"
                        on:click={() => goto("/users")}
                    >
                        <i class="fa-solid fa-home mr-3"></i> Home
                    </button>
                </li>
                <li>
                    <button
                        class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-blue-400 duration-300 py-4 px-5 font-semibold w-full"
                        on:click={() => goto("/giveaccess")}
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

            <!-- Logout Button -->
            <div class="mt-auto pb-4"> 
                <button
                    class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-blue-400 duration-300 py-4 px-5 font-semibold w-full"
                    on:click={() => goto("/login")}
                >
                    <i class="fa-solid fa-sign-out-alt mr-3"></i> Logout
                </button>
            </div>
        </div>
    </div>
{/if}
