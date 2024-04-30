<script>
  import { page } from "$app/stores";

  export let user;

  const bot = $page.params.bot.toString();

  const firstname = user.first_name;
  const lastname = user.last_name;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("session");
    window.location.href = "/";
  };
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
    <!-- <button class="flex flex-row items-center buttonnavar rounded-xl p-2">
          <div class="flex items-center justify-center h-6 w-6">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.2188 12.1094C24.2188 18.7987 18.7967 24.2188 12.1094 24.2188C5.42202 24.2188 0 18.7987 0 12.1094C0 5.42397 5.42202 0 12.1094 0C18.7967 0 24.2188 5.42397 24.2188 12.1094ZM12.4343 4.00391C9.77334 4.00391 8.07617 5.12485 6.74346 7.11709C6.5708 7.3752 6.62856 7.72329 6.87603 7.91094L8.57031 9.19561C8.82446 9.38833 9.18657 9.34248 9.38403 9.09199C10.2563 7.98564 10.8544 7.34409 12.182 7.34409C13.1795 7.34409 14.4134 7.98608 14.4134 8.95337C14.4134 9.68462 13.8097 10.0602 12.8248 10.6124C11.6762 11.2563 10.1562 12.0577 10.1562 14.0625V14.2578C10.1562 14.5814 10.4186 14.8438 10.7422 14.8438H13.4766C13.8001 14.8438 14.0625 14.5814 14.0625 14.2578V14.1927C14.0625 12.803 18.1243 12.7451 18.1243 8.98438C18.1243 6.15225 15.1866 4.00391 12.4343 4.00391ZM12.1094 16.1133C10.8708 16.1133 9.86328 17.1208 9.86328 18.3594C9.86328 19.5979 10.8708 20.6055 12.1094 20.6055C13.3479 20.6055 14.3555 19.5979 14.3555 18.3594C14.3555 17.1208 13.3479 16.1133 12.1094 16.1133Z"
                fill="white"
              />
            </svg>
          </div>
          <div class="ml-2 text-sm font-semibold">FAQ</div>
        </button> -->
    <!-- <button class="flex flex-row items-center buttonnavar rounded-xl p-2">
          <div class="flex items-center justify-center h-6 w-6">
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.8885 15.0196L20.8084 13.8184C21.0184 12.6856 21.0184 11.5235 20.8084 10.3907L22.8885 9.1895C23.1277 9.05278 23.2352 8.76958 23.157 8.50591C22.615 6.76762 21.6922 5.19536 20.4861 3.88676C20.3006 3.68657 19.9979 3.63774 19.7635 3.77446L17.6834 4.97563C16.8094 4.22368 15.8035 3.64262 14.7147 3.26176V0.864303C14.7147 0.590866 14.5242 0.351608 14.2557 0.293014C12.4637 -0.107376 10.6277 -0.0878449 8.92364 0.293014C8.65508 0.351608 8.46465 0.590866 8.46465 0.864303V3.26665C7.38067 3.65239 6.37481 4.23344 5.4959 4.98051L3.42071 3.77934C3.18145 3.64262 2.8836 3.68657 2.69805 3.89165C1.492 5.19536 0.569146 6.76762 0.0271543 8.51079C-0.0558535 8.77446 0.0564511 9.05766 0.295709 9.19438L2.37579 10.3956C2.16583 11.5284 2.16583 12.6905 2.37579 13.8233L0.295709 15.0245C0.0564511 15.1612 -0.0509707 15.4444 0.0271543 15.7081C0.569146 17.4463 1.492 19.0186 2.69805 20.3272C2.8836 20.5274 3.18633 20.5762 3.42071 20.4395L5.50079 19.2383C6.37481 19.9903 7.38067 20.5713 8.46954 20.9522V23.3545C8.46954 23.628 8.65997 23.8672 8.92852 23.9258C10.7205 24.3262 12.5565 24.3067 14.2606 23.9258C14.5291 23.8672 14.7195 23.628 14.7195 23.3545V20.9522C15.8035 20.5665 16.8094 19.9854 17.6883 19.2383L19.7684 20.4395C20.0076 20.5762 20.3055 20.5323 20.491 20.3272C21.6971 19.0235 22.6199 17.4512 23.1619 15.7081C23.2352 15.4395 23.1277 15.1563 22.8885 15.0196ZM11.5897 16.0108C9.43633 16.0108 7.6834 14.2579 7.6834 12.1045C7.6834 9.95122 9.43633 8.19829 11.5897 8.19829C13.743 8.19829 15.4959 9.95122 15.4959 12.1045C15.4959 14.2579 13.743 16.0108 11.5897 16.0108Z"
                fill="white"
              />
            </svg>
          </div>
          <div class="ml-2 text-sm font-semibold">Setting</div>
        </button> -->

    <dIi class="flex flex-row items-center rounded-xl p-2">
      <div
        class="uppercase flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 flex-shrink-0 text-white"
      >
        {firstname.charAt(0)}{lastname.charAt(0)}
      </div>

      <div class="ml-2 text-sm font-semibold">{firstname} {lastname}</div>
    </dIi>
    <button class="flex flex-row items-center buttonnavar rounded-xl p-2">
      <div class="flex items-center justify-center h-6 w-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
            d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
          /></svg
        >
      </div>
      <button on:click={handleLogout}>
        <div class="ml-2 text-sm font-semibold">Logout</div>
      </button>
    </button>
  </div>
</div>
