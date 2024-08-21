import { readFileSync } from 'fs'
import { resolve } from 'path'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => {
	const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'))
	return { version: packageJson.version }
}
