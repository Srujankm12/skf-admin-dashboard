<script>
    let labels = ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5",];
</script>

<div class="relative h-screen bg-white text-black">
    <div class="relative pt-28 px-6 overflow-y-auto flex flex-col items-center">
        <div class="w-full max-w-full grid grid-cols-1 gap-10">
            {#each labels as label}
                <div class="shadow-xl rounded-lg w-full p-6 transition-all hover:shadow-xl">
                    <div class="flex items-center justify-between rounded-lg p-2">
                        <span class="text-gray-800 font-semibold text-lg">{label}</span>
                        <div class="flex items-center space-x-3">
                            <button class="bg-blue-400 text-white font-medium rounded-md px-6 py-2 transition-colors hover:bg-blue-500">
                                Manage
                            </button>
                            <!-- svelte-ignore a11y_consider_explicit_label -->
                            <button class="text-red-600">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>

</div>
