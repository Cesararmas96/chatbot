<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  let query = ''; // Variable para almacenar la consulta del usuario
  let chatResponse = '';
  // const apiUrl = 'https://ai-dev.trocdigital.net/api/v1/chat/Edu';
  let token = localStorage.getItem('token');
 

  // const  handleSubmit = async (event) => {
  //   event.preventDefault();
  //   console.log(token)
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Access-Control-Allow-Methods' : 'POST',
  //         'Access-Control-Allow-Credentials' : 'true',
  //         'Access-Control-Allow-Origin': '*',
  //         'Access-Control-Allow-Headers': '*',
  //         'Authorization': `Bearer ${token}`,
  //         'Connection' : 'keep-alive',
  //         'Origin': 'https://ai-dev.trocdigital.net',
  //         'Referer': 'https://ai-dev.trocdigital.net',
  //         'Server': 'nginx/1.18.0',
  //         'X-Frame-Options' : 'ALLOWALL',
  //         'Content-Encoding' : 'gzip'


  //       },
  //       body: JSON.stringify({ query }) // Enviar la consulta en el cuerpo de la solicitud POST
  //     });

      
  //      if (response.ok) {
  //           const data = await response.json();
  //           console.log(data);
  //         } else {
  //           console.error('Error al obtener el token:', response.statusText);
  //         }

  //     // const data = await response.json();
  //     // chatResponse = JSON.stringify(data, null, 2);
  //   } catch (error) {
  //     console.error('There was a problem with the fetch operation:', error);
  //   }
  // }

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
      // Realiza operaciones con los datos recibidos
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
