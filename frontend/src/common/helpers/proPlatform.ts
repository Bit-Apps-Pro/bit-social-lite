const freePlatform = new Set(['all', 'facebook', 'linkedin'])

const isProPlatform = (platform: string): boolean => !freePlatform.has(platform)

export { isProPlatform }
