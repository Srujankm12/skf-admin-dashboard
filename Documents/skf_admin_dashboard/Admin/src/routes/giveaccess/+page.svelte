<script>
    let password = '';
    let selectedUser = '';
    let users = [];

    import { onMount } from 'svelte';

</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl">
        <div class="flex justify-center mb-4">
            <img class="w-32 h-12 md:w-44 md:h-16" src="SKFLOGO.png" alt="SKF Logo" />
        </div>
        
        <h1 class="text-center text-2xl font-bold mb-8">Give Access to User</h1>


        <div class="mb-6">
            <label class="block text-black text-xl font-medium mb-2" for="user">Select users</label>
            <select 
                bind:value={selectedUser}
                name="user"
                id="user"
                class="w-full border rounded-lg py-3 px-4 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                <option value="" disabled>Select user</option>
                {#each users as { user_name }}
                    <option value={user_name}>{user_name}</option>
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
                type="submit"
                class="bg-blue-400 text-white font-bold py-3 px-4 text-lg rounded-lg w-full flex items-center justify-center"
            >
               Give Access
            </button>
        </div>
    </div>
</div>
