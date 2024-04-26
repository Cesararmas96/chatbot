<script>
  import { onMount } from 'svelte';

  let query = ''; // Variable para almacenar la consulta del usuario
  let chatResponse = '';
  const apiUrl = 'https://ai-dev.trocdigital.net/api/v1/chat/Edu';
  let token = localStorage.getItem('token');
 

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(token)
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Connection' : 'keep-alive',
          'Origin': 'https://ai-dev.trocdigital.net',
          'Referer': 'https://ai-dev.trocdigital.net'
        },
        body: JSON.stringify({ query }) // Enviar la consulta en el cuerpo de la solicitud POST
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      chatResponse = JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
</script>

<main>
  <h1>Chat Response</h1>
  <form on:submit={handleSubmit}>
    <input type="text" bind:value={query} placeholder="Enter your query" required />
    <button type="submit">Submit</button>
  </form>
  <pre>{chatResponse}</pre>
</main>
