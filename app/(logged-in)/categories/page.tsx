import { ICategory } from "../../../@types/category";
import { API_ENDPOINT } from "../../../constant/api-endpoint.constant";
import { fetchApiInstance } from "../../../utils/api";
import CategoryClientWrapper from "./client-wrapper";

const Page = async () => {
  const [categories] = await Promise.all([
    fetchApiInstance<ICategory[]>(API_ENDPOINT.categories),
  ]);
  
  return <CategoryClientWrapper categories={categories} />;
};

export default Page;
