type ExchangeRateResponse = {
    fromCache: boolean,
    data: {
        rate: number,
        secondsLeft: number
    }
}

const getExchangeRate = async (): Promise<ExchangeRateResponse> => {
    const response = await fetch ('http://localhost:8000/exchange', {
        method: "GET",
        cache: 'no-store'
    })

    if (!response.ok) {
        throw new Error('Failed to get exchange rate');
    }

    const data = await response.json();

    return data;
}

export default getExchangeRate;
