

<script>
import { goto } from "$app/navigation";
import Errormessage from "$lib/errormessage.svelte";

let loading = false;
let errorMessage = '';
let showError = false;
let email = '';
let password = '';

const PerformLogin = async () => {
    loading = true;
    showError = false;
    errorMessage = '';

    try {
        const response = await fetch("https://skfplc.vsensetech.in/login/admin", { 
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            await goto("/users"); 
        } else {
            const jsonResponse = await response.json();
            errorMessage = jsonResponse.message || 'An unexpected error occurred.';
            showError = true; 
            loading = false; 
            setTimeout(() => {
                showError = false; 
            }, 1000); 
        }
    } catch (error) {
        console.log("what",error)
        errorMessage = 'Failed to communicate with the server. Please try again later.';
        console.error(error);
        showError = true;
        loading = false; 

        setTimeout(() => {
            showError = false; 
        }, 3000); 
    }
};
</script>

<div class="min-h-screen flex items-center justify-center bg-white py-8 px-4 sm:px-6 lg:px-8">
<div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col justify-between relative">
    <div class="flex justify-center mb-4">
        <img class="w-32 h-12 md:w-44 md:h-16" src="SKFLOGO.png" alt="SKF Logo" />
    </div>
    <form on:submit|preventDefault={PerformLogin}>
        <div class="mb-6">
            <label class="block text-lg font-semibold mb-2" for="email">Email</label>
            <input
                id="email"
                name="email"
                type="email"
                bind:value={email}
                placeholder="Email"
                class="w-full p-3 border border-gray-300 text-base md:text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl"
                required
            />
        </div>

        <div class="mb-6">
            <label class="block text-lg font-semibold mb-2" for="password">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                bind:value={password}
                placeholder="Password"
                class="w-full p-3 border border-gray-300 text-base md:text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl"
                required
            />
        </div>

        <div class="flex justify-center mt-4">
          <button
              type="submit"
              class="w-full flex justify-center items-center bg-blue-400 hover:bg-blue-500 transition-colors duration-200 text-white font-semibold py-3 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
              {#if loading}
                  <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-white border-solid border-transparent"></div>
              {:else}
                  Login
              {/if}
          </button>
        </div>
    </form>

    {#if showError}
        <Errormessage errorMessage={errorMessage} />
    {/if}
</div>
</div>
