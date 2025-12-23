export function getDomainFromProfile(headline: string, organization: string): string {
    const text = (headline + ' ' + organization).toLowerCase()

    if (text.includes('consult') || text.includes('strategy') || text.includes('pwc') || text.includes('deloitte')) return 'Consulting'
    if (text.includes('bank') || text.includes('financial') || text.includes('invest') || text.includes('wealth') || text.includes('insurance')) return 'BFSI'
    if (text.includes('software') || text.includes('developer') || text.includes('data') || text.includes('cloud') || text.includes('cyber') || text.includes('tech') || text.includes('microsoft') || text.includes('google') || text.includes('adobe')) return 'Technology'
    if (text.includes('manufactur') || text.includes('plant') || text.includes('production') || text.includes('mechanical') || text.includes('auto') || text.includes('ford') || text.includes('daimler') || text.includes('caterpillar')) return 'Manufacturing'
    if (text.includes('supply chain') || text.includes('logistics') || text.includes('operations')) return 'Operations'
    if (text.includes('health') || text.includes('pharma') || text.includes('medical')) return 'Healthcare'
    if (text.includes('manager') || text.includes('director') || text.includes('ceo') || text.includes('coo') || text.includes('admin')) return 'General Management'

    return 'General Management'
}
