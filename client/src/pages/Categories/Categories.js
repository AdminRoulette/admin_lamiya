import React, { useState, useEffect, useContext } from "react";
import Loader from "../../components/Loader/Loader";
import CategoriesModal from "./components/CategoriesModal";
import classes from "./moderation.module.scss";
import { toast } from "react-toastify";
import { getAllLinkedCategories } from "@/http/Product/categoryAPI";
import CategoryTree from "@/pages/Categories/components/CategoryTree";
import { getCategoryFilters } from "@/http/Product/filtersAPI";
import FilterBlock from "@/pages/Categories/components/Filters/FilterBlock";
import { Context } from "@/index";

const Categories = () => {
  const { user } = useContext(Context).user;

  const [categoryVisible, setCategoryVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllLinkedCategories()
      .then((categories) => setCategoryList(categories))
      .catch((error) => {
        toast(error.message);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 1000);
      });
    document.title = "Категорії";
  }, []);

  useEffect(() => {
    if (selectCategory) {
      getCategoryFilters(selectCategory.id)
        .then((filterRes) => setFilters(filterRes))
        .catch((error) => {
          toast(error.message);
        });
    }
  }, [selectCategory]);

  const showCategoryModal = (value = null) => {
    setCategoryToEdit(value);
    setCategoryVisible(true);
  };
  return !loading ? (
    <div>
      <div className={classes.type_body_container}>
        <div className={classes.categories_container}>
          {user.role.includes("ADMIN") && (
            <div className={classes.type_btns}>
              <button className="custom_btn" onClick={showCategoryModal}>
                Додати нову категорію
              </button>
            </div>
          )}
          <h2>Категорії</h2>
          {categoryList.map((category) => (
            <CategoryTree
              isSelect={selectCategory?.id === category.id}
              selectCategory={selectCategory}
              setSelectCategory={setSelectCategory}
              key={category.id}
              setFilters={setFilters}
              category={category}
              depth={0}
              setCategoryList={setCategoryList}
              showCategoryModal={showCategoryModal}
            />
          ))}
        </div>
        <FilterBlock
          filters={filters}
          selectCategoryId={selectCategory?.id}
          setFilters={setFilters}
        />
      </div>
      {categoryVisible ? (
        <CategoriesModal
          categoryList={categoryList}
          setCategoryList={setCategoryList}
          onHide={() => setCategoryVisible(false)}
          categoryToEdit={categoryToEdit}
        />
      ) : (
        <></>
      )}
    </div>
  ) : (
    <Loader />
  );
};

export default Categories;
