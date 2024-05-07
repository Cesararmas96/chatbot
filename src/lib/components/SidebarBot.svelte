<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import Avatar from "./common/Avatar.svelte";
  const bot = $page.params.bot.toString();
</script>

<div class="flex flex-col py-8 pl-6 pr-2 w-64 flex-shrink-0 sidebar {bot}">
  <div class="flex flex-row items-center justify-start h-12 w-full">
    <div
      class="flex items-center justify-center rounded-2xltext-indigo-700 h-10 w-10"
    >
      <img src="/troc.png" alt="sd" />
    </div>
    <div class="ml-2 font-bold text-2xl text-white">T-ROC Chatbot</div>
  </div>

  <div class="flex flex-col h-full justify-end text-white">
    <a
      href="{bot}/setting"
      class="flex flex-row items-center buttonnavar rounded-xl p-2 hover:bg-slate-600"
    >
      <div class="flex items-center justify-center h-6 w-6">
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.8885 15.0196L20.8084 13.8184C21.0184 12.6856 21.0184 11.5235 20.8084 10.3907L22.8885 9.1895C23.1277 9.05278 23.2352 8.76958 23.157 8.50591C22.615 6.76762 21.6922 5.19536 20.4861 3.88676C20.3006 3.68657 19.9979 3.63774 19.7635 3.77446L17.6834 4.97563C16.8094 4.22368 15.8035 3.64262 14.7147 3.26176V0.864303C14.7147 0.590866 14.5242 0.351608 14.2557 0.293014C12.4637 -0.107376 10.6277 -0.0878449 8.92364 0.293014C8.65508 0.351608 8.46465 0.590866 8.46465 0.864303V3.26665C7.38067 3.65239 6.37481 4.23344 5.4959 4.98051L3.42071 3.77934C3.18145 3.64262 2.8836 3.68657 2.69805 3.89165C1.492 5.19536 0.569146 6.76762 0.0271543 8.51079C-0.0558535 8.77446 0.0564511 9.05766 0.295709 9.19438L2.37579 10.3956C2.16583 11.5284 2.16583 12.6905 2.37579 13.8233L0.295709 15.0245C0.0564511 15.1612 -0.0509707 15.4444 0.0271543 15.7081C0.569146 17.4463 1.492 19.0186 2.69805 20.3272C2.8836 20.5274 3.18633 20.5762 3.42071 20.4395L5.50079 19.2383C6.37481 19.9903 7.38067 20.5713 8.46954 20.9522V23.3545C8.46954 23.628 8.65997 23.8672 8.92852 23.9258C10.7205 24.3262 12.5565 24.3067 14.2606 23.9258C14.5291 23.8672 14.7195 23.628 14.7195 23.3545V20.9522C15.8035 20.5665 16.8094 19.9854 17.6883 19.2383L19.7684 20.4395C20.0076 20.5762 20.3055 20.5323 20.491 20.3272C21.6971 19.0235 22.6199 17.4512 23.1619 15.7081C23.2352 15.4395 23.1277 15.1563 22.8885 15.0196ZM11.5897 16.0108C9.43633 16.0108 7.6834 14.2579 7.6834 12.1045C7.6834 9.95122 9.43633 8.19829 11.5897 8.19829C13.743 8.19829 15.4959 9.95122 15.4959 12.1045C15.4959 14.2579 13.743 16.0108 11.5897 16.0108Z" fill='white'
          />
        </svg>
      </div>
      <div class="ml-2 text-sm font-semibold">Setting</div>
    </a>
    
    <a
      href="/home"
      class="flex flex-row items-center buttonnavar rounded-xl p-2 hover:bg-slate-600"
    >
      <div class="flex items-center justify-center h-6 w-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" fill='white'/></svg>
      </div>
      <div class="ml-2 text-sm font-semibold">Home</div>
    </a>

    <!-- <Avatar showFullName={true} /> -->
    <button class="flex flex-row items-center buttonnavar rounded-xl p-2 hover:bg-slate-600" >
      <div class="flex items-center justify-center h-6 w-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          ><path
            d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" fill='white'
          /></svg
        >
      </div>
      <form action="/logout" method="POST" use:enhance>
        <button type="submit">
          <div class="ml-2 text-sm font-semibold">Logout</div>
        </button>
      </form>
    </button>
  </div>
</div>

