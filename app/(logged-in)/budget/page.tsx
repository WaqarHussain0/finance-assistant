import { API_ENDPOINT } from "../../../constant/api-endpoint.constant";
import { fetchApiInstance } from "../../../utils/api";
import BudgetClientWrapper, { IBudget } from "./client-wrapper";

const Page = async () => {
  const [budgetAllocations] = await Promise.all([
    fetchApiInstance<IBudget[]>(API_ENDPOINT.budget),
  ]);

  return <BudgetClientWrapper budgetAllocations={budgetAllocations || []} />;
};

export default Page;
