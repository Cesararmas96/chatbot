<script>
  import Avatar from "../common/Avatar.svelte";
</script>

<div class="col-start-6 col-end-13 p-3 rounded-lg">
  <div class="flex items-center justify-start flex-row-reverse">
    <div
      class="uppercase flex items-center justify-center h-11 w-10 rounded-full bg-pink-600 flex-shrink-0 text-white"
    >
      <Avatar showFullName={false} />
    </div>
  

    <div
        class="relative mr-3 text-sm  dark:bg-gray-600 dark:text-white bg-white py-2 px-4 shadow rounded-xl p-4 max-w-sm w-full mx-auto"
      >
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-4 py-1">
            <div class="h-2 bg-slate-300 rounded"></div>
            <div class="space-y-2">
              <div class="grid grid-cols-3 gap-4">
              
                <div
                  class="h-2 bg-slate-300 rounded col-span-1"
                ></div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
  </div>
</div>

