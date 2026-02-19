const PAGBANK_API_URL = process.env.PAGBANK_API_URL || 'https://api.pagseguro.com'
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN || ''

export async function createPagBankOrder(params: {
    referenceId: string
    customerName: string
    customerEmail: string
    customerTaxId: string
    amount: number // in cents (e.g. 9700 = R$97.00)
    notificationUrl?: string
}) {
    const body = {
        reference_id: params.referenceId,
        customer: {
            name: params.customerName,
            email: params.customerEmail,
            tax_id: params.customerTaxId,
        },
        items: [
            {
                name: 'eSocial na Prática — SST',
                quantity: 1,
                unit_amount: params.amount,
            },
        ],
        qr_codes: [
            {
                amount: {
                    value: params.amount,
                },
            },
        ],
        notification_urls: params.notificationUrl ? [params.notificationUrl] : [],
    }

    const res = await fetch(`${PAGBANK_API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PAGBANK_TOKEN}`,
        },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const errorText = await res.text()
        console.error('PagBank error:', res.status, errorText)
        throw new Error(`PagBank API error: ${res.status}`)
    }

    return await res.json()
}

export async function getPagBankOrder(orderId: string) {
    const res = await fetch(`${PAGBANK_API_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${PAGBANK_TOKEN}`,
        },
    })

    if (!res.ok) {
        throw new Error(`PagBank API error: ${res.status}`)
    }

    return await res.json()
}
