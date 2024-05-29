<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    const handleClick = () => {
      dispatch('click');
    };
  </script>
  
  <style>
    .fab {
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 56px;
      height: 56px;
      background-color: #f50057;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .fab:hover {
      background-color: #c51162;
    }
    .fab-icon {
      font-size: 24px;
    }
  </style>
  
  <div class="fab" on:click={handleClick}>
    <i class="fab-icon fas fa-cog"></i> <!-- Icon for settings -->
  </div>
  