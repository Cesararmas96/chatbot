<script>
    import { marked } from "marked";
    export let message;
</script>
<div class="col-start-1 col-end-8 p-3 rounded-lg">
    <div class="flex flex-row">
      <div
        class="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0"
      >
        <img src="/troc.png" alt="sd">
      </div>
      <div
        class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
      >
        <div>{@html marked(message.text)}</div>
      </div>
    </div>
  </div>