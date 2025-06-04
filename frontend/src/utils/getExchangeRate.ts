const getExchangeRate = async (): Promise<number> => {
    const response = await fetch ('http://localhost:8000/exchange', {
        method: "GET",
        cache: 'no-store'
    })

    if (!response.ok) {
        throw new Error('Failed to get exchange rate');
    }

    const data = await response.json();

    return data.rate;
}

export default getExchangeRate;
