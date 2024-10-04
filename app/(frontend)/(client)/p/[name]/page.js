import RecommendedProducts from "@/app/ui/recommended-products";
import CategoryPage from "./CategoryPage";
import { Suspense } from "react";
import { Spin } from "antd";
import { oswald } from "@/style/font";
import { LoadingOutlined } from "@ant-design/icons";
import { BigSpinner } from "@/app/ui/spinner";

export default function CategoryPageCy({ params: { name } }) {
  console.log(name, "name 🎈🎈🎈🎈");
  return (
    <>
      <Suspense fallback={<BigSpinner />}>
        <CategoryPage name={name} />
      </Suspense>

      <div className="mb-10 mt-20 px-10">
        <h3 className={`${oswald.className} p-6 pt-9 text-3xl`}>
          You May Also Like
        </h3>

        <RecommendedProducts category="men" />
      </div>
    </>
  );
}
