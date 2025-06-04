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
			<div className={styles.rateInfo}>
				<p className={styles.rate}>Current exchange rate: <span>{exchangeRate.data.rate}</span></p>
				<ExchangeTimer initialSeconds={exchangeRate.data.secondsLeft} />
			</div>
			<ExchangeForm />
		</div>
	);
}
