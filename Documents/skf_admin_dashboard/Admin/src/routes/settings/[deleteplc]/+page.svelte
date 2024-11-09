<script>
 
    import { getplc } from '$lib/urls';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import Drawer from '$lib/Drawer.svelte';
   
       let plclist = [];
       let isDrawerOpen = false;
       let isModalOpen = false;
       let isLoading = false; 
       export let data;
   
      
    const fetchplc = async () =>{
        isLoading =true;
        try {
            const response = await fetch(getplc + data.deleteplc,{
                method:"GET",
               //credentials: "include",
               //body:JSON.stringify({user_id:data.listofplcs})

            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                plclist = data.plcs;
               // noplcAvailable = plclist.length === 0;
                isModalOpen = false;
            } else {
                const errorData = await response.json();
                console.error("Error fetching plcs:", errorData['message']);
            }
        } catch (error) {
            console.error("Error fetching plcs:", error);
        } finally {
            isLoading = false;
        }
    };

       onMount(() => {
           fetchplc();
       });
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
           <h2 class="text-3xl font-bold mb-6 mx-10 text-center justify-center">Manage Plc's</h2>
   
       <div class="relative overflow-y-auto flex flex-col items-center">
           {#if isLoading}
               <div class="text-center">Loading Plcs...</div>
           {:else}
               <div class="w-full max-w-full grid grid-cols-1 gap-10 px-10 py-10">
                   {#each plclist as plc}
                   <div class="border-b-[5px] border-l-[5px] border-blue-400 rounded-2xl px-6 py-6 bg-white flex flex-col h-24 duration-75 hover:border-l-0 hover:border-b-0 shadow-lg">
                       <div class="flex items-center justify-between rounded-lg p-2">
                               <span class="text-gray-800 font-semibold text-lg">{plc.plc_id}</span>
                               <div class="flex items-center space-x-3">
                                   <button class="bg-blue-400 text-white font-medium rounded-md px-4 py-2 transition-colors hover:bg-blue-500"
                                    on:click={ goto ("/settings/"+data.deleteplc+"/"+plc.plc_id)}
                                   >
                                       Manage
                                   </button>
                                   <!-- svelte-ignore a11y_consider_explicit_label -->
                                   <button class="text-red-600">
                                    <i class="fas fa-trash"></i>
                                   </button>
                               </div>
                           </div>
                       </div>
                   {/each}
               </div>
           {/if}
       </div>
   </div>
   </div>