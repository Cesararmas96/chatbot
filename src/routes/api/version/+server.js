import { readFileSync } from 'fs'
import { resolve } from 'path'

export function GET() {
	const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'))
	const version = packageJson.version

	return new Response(JSON.stringify({ version }), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
