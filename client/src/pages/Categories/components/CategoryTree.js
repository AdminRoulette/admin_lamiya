import React, { useState } from "react";
import classes from "../moderation.module.scss";
import { deleteCategory, editCategory } from "@/http/Product/categoryAPI";
import { toast } from "react-toastify";
import DeleteCategoriesModal from "@/pages/Categories/components/DeleteCategoriesModal";

const CategoryTree = ({
  category,
  depth = 0,
  setSelectCategory,
  isSelect,
  selectCategory,
  setCategoryList,
  showCategoryModal,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  function deleteHelper(oldCategoryList, id) {
    if (!Array.isArray(oldCategoryList)) {
      return oldCategoryList;
    }
    return oldCategoryList
      .filter((category) => category.id !== id)
      .map((category) => ({
        ...category,
        child: deleteHelper(category.child, id),
      }));
  }

  return (
    <div className={classes.category} style={{ marginLeft: depth * 16 }}>
      {isOpenDeleteModal && <DeleteCategoriesModal
          onHide={()=>setIsOpenDeleteModal(false)}
          setCategoryList={setCategoryList}
          category_id={category.id}
      />}
      <div className={classes.node}>
        {category.child?.length > 0 && (
          <span onClick={toggleExpand} className={classes.toggle}>
            {expanded ? "▼" : "▶"}
          </span>
        )}
        <span
          onClick={() => setSelectCategory(category)}
          className={`${classes.name} ${isSelect ? classes.active : ""}`}
        >
          {category.id} - {category.name} {!category.vision && " (Прихована)"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-pencil-icon lucide-pencil"
          onClick={() => showCategoryModal(category)}
        >
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          <path d="m15 5 4 4" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-trash2-icon lucide-trash-2"
          onClick={()=>setIsOpenDeleteModal(true)}
        >
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </div>

      {expanded && category.child?.length > 0 && (
        <div className={classes.children}>
          {category.child.map((child) => (
            <CategoryTree
              selectCategory={selectCategory}
              isSelect={selectCategory?.id === child.id}
              key={child.id}
              category={child}
              depth={depth + 1}
              setSelectCategory={setSelectCategory}
              showCategoryModal={showCategoryModal}
              setCategoryList={setCategoryList}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTree;
