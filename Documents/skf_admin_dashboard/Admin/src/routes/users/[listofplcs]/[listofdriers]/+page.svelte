<script>
    import { goto } from '$app/navigation';
    import Drawer from '$lib/Drawer.svelte';
    import { fade } from 'svelte/transition';
    import { getdriers , createdrier} from '$lib/urls';
    import { onMount } from 'svelte';
    

    let isLoading =true;
    let drierlist = [];
    let nodrierAvailable = false;
    let isCreating = false;
    let newdrierlabel = '';
    let createdrierID = '';
    let responsemessage = '';
    let isDrawerOpen = false;
    let isModalOpen = false;
    let successmessage = '';
    export let data;


const fetchdrier = async () =>{
    isLoading =true;
    try {
        const response = await fetch(getdriers,{
            method:"GET",
            credentials: "include",
            body:JSON.stringify({user_id:data.listofplcs , plc_id:data.listofdriers})

        });
        if (response.ok) {
            const data = await response.json();
            drierlist = data;
            nodrierAvailable = drierlist.length === 0;
            isModalOpen = false;
        } else {
            const errorData = await response.json();
            console.error("Error fetching driers:", errorData['message']);
        }
    } catch (error) {
        console.error("Error fetching driers:", error);
    } finally {
        isLoading = false;
    }
};

const addDrier = async () => {

    isCreating = true;
    try {
        const response = await fetch(createdrier,{
            method:"POST",
            credentials: "include",
            body:JSON.stringify({ label : newdrierlabel , user_id : data.listofplcs , plc_id : data.listofdriers})
        });
    
    const result = await response.json();
    if(response.ok){
        isModalOpen =false;
        createdrierID = '';
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

onMount(fetchdrier);
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
        <h2 class="text-3xl font-bold mb-6 mx-10">Drier </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {#each drierlist as drier }
                <div class="p-4">
                    <div class="border-l-4 border-b-4 border-l-blue-400 border-b-blue-400 rounded-2xl p-6 bg-white shadow-2xl flex flex-col h-72 transition-transform duration-75 hover:border-l-0 hover:border-b-0 hover:shadow-xl">
                        <span class="text-start mt-2 text-2xl font-semibold">{drier.label}</span>
                        <div class="flex-grow"></div>
                        <button class="text-xl p-3 rounded-lg bg-blue-400 text-white font-medium self-end"
                            on:click={() => goto("/registertables")}
                        >
                            Manage
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <button
     class="w-16 h-16 bg-blue-400 fixed bottom-12 right-8 text-white text-3xl font-medium rounded-full shadow-xl flex items-center justify-center"
     on:click={toggleModal}
    >
    <i class="fas fa-plus"></i>
    </button>

    {#if isModalOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" transition:fade>
        <div class="max-w-md w-full bg-white rounded-3xl p-6 shadow-lg relative">
            <h3 class="text-center text-2xl py-4 mb-4 font-bold">Create New Drier</h3>
            
            <form on:submit={addDrier}>
                <div class="mb-8">
                    <label class="block text-black text-xl font-semibold mb-2" for="driername"></label>
                    <input
                        id="driername"
                        type="text"
                        bind:value={newdrierlabel}
                        placeholder="TAG NAME"
                        class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-blue-400 focus:shadow-outline"
                    />
                </div>
                

                <div class="flex items-center justify-center">
                    <button
                        type="submit"
                        class="bg-blue-400 text-white font-bold py-3 px-4 text-lg rounded-lg w-full flex items-center justify-center"
                    >
                        Create
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
