import styles from "./root.module.css";
import ExchangeForm from "@/components/ExchangeForm/ExchangeForm";
import ExchangeTimer from "@/components/ExchangeTimer/ExchangeTimer";
import getExchangeRate from "@/utils/getExchangeRate";

export default async function Home() {
	const exchangeRate = await getExchangeRate();

	console.log(exchangeRate);
	return (
		<div className={styles.homepage}>
			<h1>Exchange EUR to PLN</h1>
			<p>Current exchange rate: {exchangeRate.data.rate}</p>
			<p>{exchangeRate.data.secondsLeft}</p>
			<ExchangeTimer initialSeconds={exchangeRate.data.secondsLeft} />
			<ExchangeForm />
		</div>
	);
}
