import { API_ENDPOINT } from "../../../constant/api-endpoint.constant";
import { fetchApiInstance } from "../../../utils/api";
import { IBudget } from "../budget/client-wrapper";
import { ITransaction } from "../transaction/client-wrapper";
import InsightClientWrapper from "./client-wrapper";

const Page = async () => {
  const [transactions, budgets] = await Promise.all([
    fetchApiInstance<ITransaction[]>(API_ENDPOINT.transactions),
    fetchApiInstance<IBudget[]>(API_ENDPOINT.budget),
  ]);

  const response = await fetchApiInstance<any>(API_ENDPOINT.aiInsights, {
    method: "POST",
    body: { transactions, budgets },
  });

  return (
    <InsightClientWrapper
      budgets={budgets}
      transactions={transactions}
      aiInsights={response}
    />
  );
};

export default Page;
