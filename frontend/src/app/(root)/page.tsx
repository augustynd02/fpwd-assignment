import styles from "./root.module.css";
import ExchangeForm from "@/components/ExchangeForm/ExchangeForm";

export default function Home() {
  return (
    <div className={styles.homepage}>
        <h1>Exchange EUR to PLN</h1>
        <ExchangeForm/>
    </div>
  );
}
