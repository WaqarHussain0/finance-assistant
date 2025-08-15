import { API_ENDPOINT } from "../../../constant/api-endpoint.constant";
import { fetchApiInstance } from "../../../utils/api";
import { IBudget } from "../budget/client-wrapper";
import { ITransaction } from "../transaction/client-wrapper";
import DashboardClientWrapper from "./client-wrapper";

const Page = async () => {
  const [transactions, budgets] = await Promise.all([
    fetchApiInstance<ITransaction[]>(API_ENDPOINT.transactions),
    fetchApiInstance<IBudget[]>(API_ENDPOINT.budget),
  ]);

  return (
    <DashboardClientWrapper budgets={budgets} transactions={transactions} />
  );
};

export default Page;
