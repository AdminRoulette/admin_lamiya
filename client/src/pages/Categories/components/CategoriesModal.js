import React, {useEffect, useState} from "react";
import classes from "../moderation.module.scss";
import { toast } from "react-toastify";
import {
  addCategory,
  deleteCategory,
  editCategory, getAllCategory,
} from "@/http/Product/categoryAPI";
import Transliterations from "../../../../../server/functions/SearchComponents/Transliterations";
import { CustomModal } from "@/components/CustomElements/CustomModal";
import { CustomInput } from "@/components/CustomElements/CustomInput";
import { CustomDropdown } from "@/components/CustomElements/CustomDropdown";

const CategoriesModal = ({
  onHide, setCategoryList,
  categoryToEdit,
}) => {
  const [name, setName] = useState(categoryToEdit?.name || "");
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [nameRu, setNameRu] = useState(categoryToEdit?.name_ru || "");
  const [parentId, setParentId] = useState(categoryToEdit?.parentId || null);
  const [code, setCode] = useState(categoryToEdit?.code || "");
  const [vision, setVision] = useState(categoryToEdit?.vision !== false);

  useEffect(() => {
    getAllCategory().then(data => {
      setCategoriesArray(data)
    }).catch(error => {
      toast.error(error.response.data.message);
    })
  },[])


  function addNewCategory(oldCategoryList, newCategory) {
    if (!Array.isArray(oldCategoryList)) {
      return oldCategoryList;
    }

    if (newCategory.parentId === null) {
      const fixedCategory = newCategory.child
        ? newCategory
        : { ...newCategory, child: [] };
      return [fixedCategory, ...oldCategoryList];
    }

    return oldCategoryList.map((category) => {
      if (category.id === newCategory.parentId) {
        return {
          ...category,
          child: [newCategory, ...category.child],
        };
      } else {
        return {
          ...category,
          child: addNewCategory(category.child, newCategory),
        };
      }
    });
  }

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
  function editCategoryHelper(oldCategoryList, updatedCategory) {
    return addNewCategory(deleteHelper(oldCategoryList, updatedCategory.id), {
      ...updatedCategory,
      child: categoryToEdit.child,
    });
  }

  const handleEdit = async () => {
    await editCategory({
      id: categoryToEdit.id,
      name,
      nameRu,
      parentId,
      code,
      vision,
    })
      .then((res) => {
        setCategoryList((prev) => editCategoryHelper(prev, res));
        closeModal();
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const CreateCategory = async () => {
    await addCategory({ name, nameRu, parentId, code, vision })
      .then((CategoryElem) => {
        setCategoryList((prev) => addNewCategory(prev, CategoryElem));
        closeModal();
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  const handleName = async (value) => {
    setName(value);
    setCode(await Transliterations(value));
  };

  const closeModal = () => {
    const modal = document.getElementById("modalId");
    if (modal) {
      modal.classList.add("closingModal");
      window.setTimeout(() => {
        onHide();
      }, 500);
    } else {
      onHide();
    }
    document.body.style.overflow = "";
  };

  return (
    <CustomModal
      onClose={closeModal}
      title={categoryToEdit ? "Редагувати категорію" : "Додати категорію"}
      onSubmit={categoryToEdit ? handleEdit : CreateCategory}
      buttonName={categoryToEdit ? "Редагувати" : "Створити"}
    >
      <CustomDropdown
        array={categoriesArray}
        placeholder={"Батьківська категорія"}
        dropdownAction={setParentId}
        externalValue={
          categoriesArray.find((item) => item.id === categoryToEdit?.parentId)?.name
        }
      />
      <CustomInput
        value={name}
        onChange={handleName}
        placeholder={"Назва категорії"}
      />
      <CustomInput
        value={nameRu}
        onChange={setNameRu}
        placeholder={"Назва російською"}
      />
      <CustomInput
        value={code}
        onChange={setCode}
        placeholder={"Код категорії"}
      />
      <div className={"vision_block"}>
        <span>Відобразити категорію:</span>
        <input
          type="checkbox"
          checked={vision}
          onClick={() => {
            setVision((prev) => !prev);
          }}
        />
      </div>
    </CustomModal>
  );
};

export default CategoriesModal;
