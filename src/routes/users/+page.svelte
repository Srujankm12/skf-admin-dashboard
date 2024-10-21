<script>
    import Drawer from '$lib/Drawer.svelte';

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
        <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div class="bg-white p-8 rounded shadow-2xl w-1/2 max-w-md">
                <h3 class="text-xl font-bold mb-4 flex items-center justify-center">Create New User</h3>
                
                <label for="label" class="block mb-2">Label Name:</label>
                
                <input id="label" 
                       type="text" 
                       bind:value={newlabel} 
                       class="border rounded-lg p-2 mb-4 w-full" />
                
                <label for="email" class="block mb-2">Email-Id:</label>

                <input id="email" 
                        type="email" 
                        bind:value={newemail} 
                        class="border rounded-lg p-2 mb-4 w-full" />
                
                <label for="password" class="block mb-2">Password:</label>
                <input id="password" 
                        type="text" 
                        bind:value={password} 
                        class="border rounded-lg p-2 mb-4 w-full" />

                <div class="flex justify-end">
                    <button on:click={toggleModal} class="bg-gray-300 text-black px-4 py-2 rounded-lg mr-2 flex items-center">
                        <i class="fas fa-times mr-2"></i> Cancel
                    </button>

                    <button on:click={addUser} class="bg-black text-white px-4 py-2 rounded-lg flex items-center">
                        Add
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
