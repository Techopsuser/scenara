/**
 * Convert an arbitrary string into a URL-safe kebab-case slug.
 * Handles special characters: C# -> c-sharp, C++ -> c, Go (Golang) -> go-golang,
 * AWS ECS/EKS -> aws-ecs-eks, HTTP/HTTPS -> http-https.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/#/g, ' sharp')
    .replace(/[+/]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
