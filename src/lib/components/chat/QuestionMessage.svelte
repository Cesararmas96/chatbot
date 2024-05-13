<script>
  import Avatar from "../common/Avatar.svelte";
  export let message;
</script>

<div class="col-start-6 col-end-13 p-3 rounded-lg">
  <div class="flex items-center justify-start flex-row-reverse">
    <div
      class="uppercase flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 flex-shrink-0 text-white"
    >
      <Avatar showFullName={false} />
    </div>
    <div class="relative mr-3 text-sm  dark:bg-gray-600 dark:text-white bg-white py-2 px-4 shadow rounded-xl">
      <div>
        {message.query}
      </div>
    </div>
  </div>
</div>
