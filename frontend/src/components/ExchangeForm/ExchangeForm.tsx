'use client'

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import styles from './ExchangeForm.module.css';

type TransactionResponse = {
    amountEUR: number;
    amountPLN: number;
    exchangeRate: number;
    timestamp: Date;
}

const submitTransaction = async (amount: number) => {
    try {
        const urlBase = process.env.NEXT_PUBLIC_API_URL;
        if (!urlBase) throw new Error(".env has no API URL");
        const response = await fetch(`${urlBase}/transaction`, {
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
        <form onSubmit={handleSubmit} className={styles.exchangeForm}>
            <div className={styles.mainContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="amount" className={styles.label}>Amount in EUR</label>
                    <div className={styles.amountContainer}>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Type the amount here..."
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <p className={styles.label}>Amount in PLN</p>
                    <div className={styles.amountContainer}>
                        {result
                            ? <p className={styles.result}>{result.toFixed(2)}</p>
                            : <p className={styles.placeholder}>Submit the transaction...</p>
                        }
                    </div>
                </div>
            </div>

            <div className={styles.actionsContainer}>
                {mutation.isError && <p className={styles.error}>Error: {mutation.error.message}</p>}
                <button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Converting..." : "Submit"}
                </button>

            </div>
        </form>
    )
}
