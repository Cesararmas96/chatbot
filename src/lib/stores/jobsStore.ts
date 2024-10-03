import { writable } from 'svelte/store';
import { getApiData } from '$lib/services/getData';

// Crear un store writable para almacenar la lista de trabajos
export const jobsStore = writable([]);

// Función para hacer fetch de los trabajos desde la API
export const fetchJobs = async (token: string) => {
  const apiUrl = `${import.meta.env.VITE_API_AI_URL}/api/v1/upload_videos`;

  try {
    // Establecer el estado de carga
    const fetchedJobs = await getApiData(
      apiUrl,
      'GET',
      {},
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      null,
      true
    );

    // Verificar que se recibieron trabajos y actualizar el store
    if (fetchedJobs && fetchedJobs.jobs) {
      jobsStore.set(fetchedJobs.jobs); // Actualizar el store con los trabajos obtenidos
      console.log(jobsStore)
    } else {
      console.error('No jobs found or response format is incorrect');
    }
  } catch (error) {
    // Manejo de errores
    console.error('Error fetching jobs:', error);
  }
};
