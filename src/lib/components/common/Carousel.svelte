<script lang="ts">
	import { onMount } from 'svelte'
    import foto from '../../../assets/slider.png'

	let currentImageIndex = 0

	onMount(() => {
		const interval = setInterval(() => {
			currentImageIndex = (currentImageIndex + 1)
		}, 3000) // Cambia la imagen cada 1 segundo

		return () => clearInterval(interval) // Limpia el intervalo al destruir el componente
	})
</script>

<div class="carousel">
		<img src={foto} alt="Image" />
        
</div>

<style>
	.carousel {
		width: 100%;
		height: 100vh;
		/* overflow: hidden; */
		/* position: relative; */
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
		transition: opacity 0.5s;
		opacity: 0;
	}
/* 
	img.active {
		opacity: 1;
	} */
</style>
