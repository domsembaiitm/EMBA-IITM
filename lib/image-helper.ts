export function resolveAvatarUrl(url: string | null | undefined): string {
    if (!url) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback' // Reliable fallback
    if (url.startsWith('http')) return url
    if (url.startsWith('/')) return url
    return `/${url}`
}
