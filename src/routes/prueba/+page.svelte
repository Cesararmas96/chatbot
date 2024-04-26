<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  let query = '';
  let chatResponse = '';
  let token = localStorage.getItem('token');
 
const handleSubmit = async (event) => {
  event.preventDefault();
  console.log(token);

  const apiUrl = 'https://ai-dev.trocdigital.net/api/v1/chat/Edu';

  try {
    const response = await axios.post(apiUrl, { query }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      const data = response.data;
      console.log(data);
    } else {
      console.error('Error al obtener la respuesta:', response.statusText);
    }
  } catch (error) {
    console.error('Hubo un problema con la operación de fetch:', error);
  }
};
</script>

<main>
  <h1>Chat Response</h1>
  <form on:submit={handleSubmit}>
    <input type="text" bind:value={query} placeholder="Enter your query" required />
    <button type="submit">Submit</button>
  </form>
  <pre>{chatResponse}</pre>
</main>
