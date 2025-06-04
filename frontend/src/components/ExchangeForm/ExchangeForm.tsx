'use client'

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

type TransactionResponse = {
    amountEUR: number;
    amountPLN: number;
    exchangeRate: number;
    timestamp: Date;
}

const submitTransaction = async (amount: number) => {
    try {
        const response = await fetch('http://localhost:8000/transaction', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ amount })
        })

        if (!response.ok) {
            throw new Error('Failed to submit transaction');
        }

        const data: TransactionResponse = await response.json();
        return data.amountPLN;
    } catch (err) {
        throw err;
    }
}

export default function ExchangeForm() {
    const [amount, setAmount] = useState('');
    const [result, setResult] = useState<number | null>(null);

    const mutation = useMutation({
        mutationFn: submitTransaction,
        onSuccess: (amountPLN) => {
            setResult(amountPLN)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountEUR = parseFloat(amount);
        if (!isNaN(amountEUR)) {
            mutation.mutate(amountEUR)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Amount in EUR:
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                />
            </label>
            <button type="submit" disabled={mutation.isPending}>
                Convert
            </button>

            {mutation.isPending && <p>Converting...</p>}
            {result !== null && <p>{amount} EUR is {result.toFixed(2)} PLN</p>}
            {mutation.isError && <p>Error: {mutation.error.message}</p>}
        </form>
    )
}
