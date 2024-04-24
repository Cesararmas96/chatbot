const login: Action = async ({ cookies, request }) => {
	const data = await request.formData()
	const username = data.get('email')
	const password = data.get('password')

	if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
		return fail(400, { invalid: true })
	}

	const credentials = `${username}:${password}`
	const encodedCredentials = btoa(credentials) // Codifica las credenciales en Base64

	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${encodedCredentials}`, // Agrega el encabezado de autorización
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({}) // No necesitas enviar datos adicionales en el cuerpo para autenticación básica
	})

	if (response.ok) {
		// Si la autenticación es exitosa, establece las cookies de sesión y redirige al usuario
		const data = await response.json()
		// ...
	} else {
		return fail(400, { credentials: true, message: await response.json() })
	}
	// redirect the user
	throw redirect(302, '/')
}

export const actions: Actions = { login }
