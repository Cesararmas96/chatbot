<script>
    import { createEventDispatcher } from 'svelte';
    import SelectLlm from "./SelectLlm.svelte";
  
    const dispatch = createEventDispatcher();
  
    const closeModal = () => {
      dispatch('close');
    };
  </script>
  
  
  <div class="modal" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
        <button on:click={closeModal}>x</button>
      <h2>Settings</h2>
      <p>Select LLM</p>
      <SelectLlm/>
    </div>
  </div>
  
  <style>
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 300px;
      max-width: 80%;
    }
  </style>