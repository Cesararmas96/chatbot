<script lang="ts">
  export let namebot;
  export let name;
	import { page } from '$app/stores'
  let bot = $page.params.bot
	let botName = $page.url.searchParams.get('botName')

</script>

<div
  class="flex animate__animated animate__zoomIn card cursor-pointer p-6 hover:-translate-y-1 hover:scale-100 hover:shadow-lg"
>
  <a href={name}>
    <img
      src="/images/bots/{name}.png"
      alt="img-{name}-logo"
      class="h-auto w-full rounded-md object-cover object-center img-logo"
    />
    
    <div class="mb-2 mt-6">
      <h3 class="tracki text-center text-lg font-semibold uppercase">
        {namebot}
      </h3>
    </div>
  </a>
</div>

<style>
    .card{
        border-radius: 0.375rem;
    border-width: 1px;
    --tw-border-opacity: 1;
    border-color:  #E5EFF8;
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255);
}



.img-logo{
    width: 184.4px !important;
    height: 184.4px !important;
}

</style>
