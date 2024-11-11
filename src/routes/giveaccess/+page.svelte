<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Drawer from "../../lib/Drawer.svelte"; // Importing Drawer component
    import { giveaccesstouser, getusers } from "../../lib/urls";
    
    let password = '';
    let selectedUser = '';
    let users;
    let isLoading = true;
    let isSubmitting = false;
    let message = '';
    let notification = '';
    let isNotificationVisible = false;
    let isDrawerOpen = false;

    const fetchUsers = async () => {
        isLoading = true;
        try {
            const response = await fetch(getusers, { method: "GET" });
            if (response.ok) {
                const data = await response.json();
                users = data['users'];
                message = '';
            } else {
                const errorData = await response.json();
                message = errorData.message;
            }
        } catch (error) {
            message = "An error occurred. Please try again.";
        } finally {
            isLoading = false;
        }
    };

    const requestAccess = async () => {
        isSubmitting = true;
        try {
            const response = await fetch(giveaccesstouser, {
                method: "POST",
                body: JSON.stringify({ "user_id": selectedUser, "password": password }),
            });
            if (response.ok) {
                notification = 'Access has been granted!';
                isNotificationVisible = true;
                resetForm();
                await fetchUsers();
                setTimeout(() => isNotificationVisible = false, 2000);
            } else {
                const errorData = await response.json();
                message = errorData.message;
            }
        } catch (error) {
            message = "An error occurred. Please try again.";
        } finally {
            isSubmitting = false;
        }
    };

    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    const resetForm = () => {
        password = '';
        selectedUser = '';
    };

    onMount(() => {
        fetchUsers();
    });
</script>


{#if isLoading}
<div class="fixed inset-0 flex items-center justify-center z-40">
    <div class="w-16 h-16 border-6 border-t-8 border-blue-400 border-solid rounded-full animate-spin"></div>
</div>
{:else}
    <!-- Drawer Toggle Button -->
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="fixed top-1 left-4 p-4 text-2xl text-white rounded-xl transition duration-300 z-50"
        on:click={toggleDrawer}
    >
        <i class="fas fa-bars"></i>
    </button>

    <!-- Drawer Component -->
    <Drawer {isDrawerOpen} {toggleDrawer} />

    <!-- Main Content -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div class="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl">
            <div class="flex justify-center mb-4">
                <img class="w-32 h-12 md:w-44 md:h-16" src="SKFLOGO.png" alt="SKF Logo" />
            </div>
            <h1 class="text-center text-2xl font-bold mb-8">Give Access to User</h1>

            <!-- Form Section -->
            <div class="mb-6">
                <label class="block text-black text-xl font-medium mb-2" for="user">Select User</label>
                <select 
                    bind:value={selectedUser}
                    name="user"
                    id="user"
                    class="w-full border rounded-lg py-3 px-4 text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="" disabled>Select a user</option>
                    {#each users as user}
                        <option value={user.user_id}>{user.label}</option>
                    {/each}
                </select>
            </div>
            
            <div class="mb-6">
                <label class="block text-black text-xl font-medium mb-2" for="password">Password</label>
                <input 
                    bind:value={password}
                    autocomplete="current-password"
                    type="password"
                    name="password"
                    placeholder="PASSWORD"
                    class="w-full border rounded-lg py-3 px-4 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div class="flex items-center justify-center">
                <button
                    on:click={requestAccess}
                    class="bg-blue-400 text-white font-bold py-3 px-4 text-lg rounded-lg w-full flex items-center justify-center"
                >
                {#if isSubmitting}
                <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-white border-solid border-transparent"></div>
            {:else}
               Give access
            {/if}
                </button>
            </div>

            <!-- Error Message -->
            {#if message}
                <div class="mt-4 text-center text-red-600">{message}</div>
            {/if}
        </div>
    </div>

    <!-- Notification Message -->
    {#if isNotificationVisible}
        <div class="fixed bottom-5 right-5 bg-blue-400 text-white py-2 px-4 rounded-lg shadow-lg z-50 transition-opacity duration-500" transition:fade>
            {notification}
        </div>
    {/if}
{/if}
