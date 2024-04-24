<script>
  

    let query = '';
    let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTM4MTQ0MTEuMTQwODg3LCJpYXQiOjE3MTM0NTQ0MTEsImlzcyI6Ik1vYmlsZWluc2lnaHQiLCJ1c2VyIjozNSwidXNlcm5hbWUiOiJqbGFyYUB0cm9jZ2xvYmFsLmNvbSIsInVzZXJfaWQiOjM1LCJpZCI6ImpsYXJhQHRyb2NnbG9iYWwuY29tIn0.x2Mp-7MM-eQgZMy7bZY-BDbgvUoariErL6B4Qv3uDhM';
  
    const username = 'jlara@trocglobal.com';
    const password = 'Welc@me3501!';
    const domain = 'https://ai.trocdigital.net';


    async function login() {
      try {
        const response = await fetch(`${domain}/api/v1/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-method': 'BasicAuth'
          },
          body: JSON.stringify({ username, password })
        });
  
        if (response.ok) {
          const data = await response.json();
          token = data.token;
          console.log('Token obtenido:', token);
        } else {
          console.error('Error al obtener el token:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    }
  

    origin 
    async function sendChatRequest() {
      try {
        // await login(); // Autenticarse antes de enviar la solicitud de chat
  
        const response = await fetch(`${domain}/api/v1/chat/Edu`, {
          method: 'POST',
          headers: {
            'Referer': 'https://ai.trocdigital.net',
            'Authorization': `Bearer ${token}`,
            'Origin': 'https://ai.trocdigital.net'
          },
          body: JSON.stringify({ query })
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Respuesta del servidor:', data);
          // Maneja la respuesta como desees en tu aplicación web
        } else {
          console.error('Error en la solicitud de chat:', response.statusText);
          // Maneja errores de solicitud en tu aplicación web
        }
      } catch (error) {
        console.error('Error al enviar la solicitud de chat:', error);
        // Maneja errores de red u otros errores en tu aplicación web
      }
    }
  </script>
  

  
  <h1>Enviar solicitud de chat</h1>
  
  <input type="text" id="query" bind:value={query} placeholder="Pregunta">
  <button on:click={sendChatRequest}>Enviar</button>
  