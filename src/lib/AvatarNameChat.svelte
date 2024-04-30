<script>
  const firstname = localStorage.getItem("first_name").charAt(0);
  const lastname = localStorage.getItem("last_name").charAt(0);

</script>

<div
  class="uppercase flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 flex-shrink-0 text-white"
>
  {firstname}{lastname}
</div>
