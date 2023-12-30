const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getAudits = async () => {
    return await fetch(`${HOST}/api/audit`, { cache: 'no-store' })
}

