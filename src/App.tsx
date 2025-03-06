import { TransactionsList } from "./components/ui";
import CreateTransaction from "./components/forms/CreateTransaction";

export default function App() {
  return (
    <>
      <TransactionsList />
      <CreateTransaction />
    </>
  );
}
