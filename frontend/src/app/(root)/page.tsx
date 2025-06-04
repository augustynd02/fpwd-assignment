import styles from "./root.module.css";
import ExchangeForm from "@/components/ExchangeForm/ExchangeForm";
import getExchangeRate from "@/utils/getExchangeRate";

export default async function Home() {
	const exchangeRate = await getExchangeRate();
	return (
		<div className={styles.homepage}>
			<h1>Exchange EUR to PLN</h1>
			<p>Current exchange rate: {exchangeRate}</p>
			<ExchangeForm />
		</div>
	);
}
