<script>
    import { fade } from "svelte/transition";
    export let errorMessage;
</script>

<div class="fixed bottom-12 right-4 bg-blue-400 text-white font-semibold p-4 rounded-md shadow-2xl duration-100" transition:fade>
    <i class="fa-solid fa-circle-exclamation pr-2"></i>
    {errorMessage}
</div>
