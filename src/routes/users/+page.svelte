<script>
    import Drawer from '$lib/Drawer.svelte';
    import { fade } from 'svelte/transition';

    let isDrawerOpen = false;
    let isModalOpen = false;

    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    function toggleModal() {
        isModalOpen = !isModalOpen;
    }

    const users = [
        { id: 1, name: "Gowtham Mills" },
        { id: 2, name: "Babu Mills" },
        { id: 3, name: "Kd Ricemill Karkala" },
        { id: 4, name: "Jains Mill" },
        { id: 5, name: "Jaihind Mill" },
    ];

    let newlabel = '';
    let newemail = '';
    let password = '';
    
    function addUser() {
        console.log('Adding user:', newlabel, newemail, password);
        toggleModal();
    }
</script>

<div class="relative h-screen bg-white text-black">
    <button
        class="fixed top-4 left-4 p-4 text-1xl bg-black text-white rounded-xl shadow-2xl transition duration-300"
        on:click={toggleDrawer}
    >
        <i class="fas fa-bars"></i>
    </button>

    <Drawer {isDrawerOpen} {toggleDrawer} />
    
    <div class="p-8">
        <h2 class="text-3xl font-bold mb-6 mx-10">Users</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {#each users as user (user.id)}
                <div class="p-4">
                    <div class="border rounded-2xl p-6 bg-white shadow-2xl flex flex-col h-72 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                        <span class="text-start mt-2 text-2xl font-semibold">{user.name}</span>
                        <div class="flex-grow"></div>
                        <button class="text-xl p-3 rounded-lg bg-black text-white font-medium self-end">
                            Manage
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <button
        class="w-16 h-16 bg-black fixed bottom-12 right-8 text-white text-3xl font-medium rounded-full hover:bg-gray-800 transition duration-300 shadow-xl flex items-center justify-center"
        on:click={toggleModal}
    >
        <i class="fas fa-plus"></i>
    </button>
    {#if isModalOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" transition:fade>
        <div class="max-w-md w-full bg-white rounded-3xl p-6 shadow-lg relative"> <!-- Adjusted max-w-lg to max-w-md -->
            <h3 class="text-center text-2xl py-4 mb-4 font-bold">Create New User</h3>
            
            <form on:submit|preventDefault={addUser}>
                <div class="mb-4">
                    <label class="block text-black text-xl font-semibold mb-2" for="label">Label Name:</label>
                    <input
                        id="label"
                        type="text"
                        bind:value={newlabel}
                        placeholder="Label Name"
                        class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div class="mb-4">
                    <label class="block text-black text-xl font-semibold mb-2" for="email">Email-Id:</label>
                    <input
                        id="email"
                        type="email"
                        bind:value={newemail}
                        placeholder="Email-Id"
                        class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div class="mb-4">
                    <label class="block text-black text-xl font-semibold mb-2" for="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        bind:value={password}
                        placeholder="Password"
                        class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div class="flex items-center justify-center">
                    <button
                        type="submit"
                        class="bg-blue-400 text-white font-bold py-3 px-4 text-lg rounded-lg w-full flex items-center justify-center"
                    >
                        Add
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
