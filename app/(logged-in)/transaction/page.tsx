import { ICategory } from "../../../@types/category";
import { API_ENDPOINT } from "../../../constant/api-endpoint.constant";
import { fetchApiInstance } from "../../../utils/api";
import TransactionClientWrapper, { ITransaction } from "./client-wrapper";

const Page = async () => {
  const [transactions, categories] = await Promise.all([
    fetchApiInstance<ITransaction[]>(API_ENDPOINT.transactions),
    fetchApiInstance<ICategory[]>(API_ENDPOINT.categories),
  ]);

  return (
    <TransactionClientWrapper
      transactions={transactions}
      categories={categories}
    />
  );
};

export default Page;
