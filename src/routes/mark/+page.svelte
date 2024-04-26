<script>
   let messages = []; // Lista de mensajes
   let newMessage = ''; // Nuevo mensaje a enviar
 
   // Función para enviar un mensaje
   function sendMessage() {
     if (newMessage.trim() !== '') {
       messages = [...messages, { text: newMessage, sender: 'user' }];
       // Aquí normalmente enviarías el mensaje al servidor
       console.log(messages)
       newMessage = ''; // Limpiar el campo de entrada después de enviar el mensaje
     }
   }

 </script>
 
 <style>
   .chat {
     max-width: 400px;
     margin: 20px auto;
     padding: 10px;
     background-color: #f9f9f9;
   }
 
   .message {
     margin: 5px;
   }
 
   .user-message {
     text-align: right;
   }
 
   .message-container {
     display: flex;
     flex-direction: column;
     gap: 10px;
   }
 
   .bubble {
     display: flex;
     flex-direction: row-reverse;
     align-items: center;
     justify-content: flex-start;
   }
 
   .bubble .avatar {
     margin-left: 10px;
     margin-right: 0;
   }
 
   .bubble .text-bubble {
     background-color: #ffffff;
     padding: 10px;
     border-radius: 10px;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }
 </style>
 
 <div class="chat">
   <div class="message-container">
     {#each messages as message}
       <div class="message bubble" >
         <div class="text-bubble">
           {message.text}
         </div>
         <div class="avatar h-10 w-10 rounded-full bg-pink-600 flex-shrink-0 text-white">
           A
         </div>
       </div>
     {/each}
   </div>
   <input type="text" bind:value={newMessage} on:keydown={e => e.key === 'Enter' && sendMessage()} />
   <input type="hidden" id="user">
   <button type="button" on:click={sendMessage}>Enviar</button>
 </div>
 