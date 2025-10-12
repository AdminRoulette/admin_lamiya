import React from "react";
import {toast} from "react-toastify";
import {
    deleteCategory,
} from "@/http/Product/categoryAPI";
import {CustomModal} from "@/components/CustomElements/CustomModal";

const DeleteCategoriesModal = ({
                                   onHide,
                                   setCategoryList,
                                   category_id
                               }) => {

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

    const handleDelete = async () => {
        await deleteCategory({id: category_id})
            .then(() => {
                setCategoryList((prev) => deleteHelper(prev, category_id));
            })
            .catch((error) => {
                toast(error.response.data.message);
            }).finally(() => {
                closeModal()
            })
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
            title={"Видалення категорії"}
            onSubmit={handleDelete}
            buttonName={"Видалити"}
        ><div>Ви впевнені, що хочете видалити категорію?</div>
        </CustomModal>
    );
};

export default DeleteCategoriesModal;
