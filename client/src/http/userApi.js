import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const allUsers = async ({ offset, phone, role }) => {
  const params = new URLSearchParams();
  params.append("offset", offset);
  if (phone) {
    params.append("phone", encodeURIComponent(phone));
  }
  if (role) {
    params.append("role", role); //може бути ALL (тоді видаємо усіх юзерів з ролями)
  }
  const { data } = await $authHost.get(`api/user/all?${params.toString()}`);
  return data;
};

export const allCashiers = async ({ offset, shop_id, fop_id }) => {
  const params = new URLSearchParams();
  params.append("offset", offset);
  if (shop_id) {
    params.append("shop_id", shop_id);
  }
  if (fop_id) {
    params.append("fop_id", fop_id);
  }
  const { data } = await $authHost.get(
    `api/user/cashiers?${params.toString()}`
  );
  return data;
};

export const changeCashier = async ({ id, fop_id, shop_id }) => {
  const { data } = await $authHost.put(`api/user/cashiers`, {
    id,
    fop_id,
    shop_id
  });
  return data;
};

export const createCashier = async ({ fop_id, shop_id, userId}) => {
  const { data } = await $authHost.post(`api/user/cashiers`, {
    fop_id, shop_id, userId
  });
  return data;
};

export const deleteCashier = async ({ id }) => {
  const { data } = await $authHost.delete(`api/user/cashiers?id=${id}`);
  return data;
};

export const getUserStats = async ({ phone }) => {
  const { data } = await $authHost.get(
    `api/user/user-stats?phone=${encodeURIComponent(phone)}`
  );
  return data;
};

export const changeUserComment = async ({ id, comment }) => {
  const { data } = await $authHost.put(`api/user/user-stats`, {
    id,
    comment,
  });
  return data;
};

export const getAllUsersStats = async ({ phone, offset }) => {
  const params = new URLSearchParams();
  params.append("offset", offset);
  if (phone) {
    params.append("phone", phone);
  }
  const { data } = await $authHost.get(
    `api/user/all-users-stats?${params.toString()}`
  );
  return data;
};

export const loginGoogle = async (credential) => {
  const { data } = await $host.post("api/user/logingoogle", { credential });
  localStorage.setItem("token", data.token);
  return jwt_decode(data.token);
};

export const changeUserData = async ({
  id,
  email,
  role,
  lastname,
  firstname,
  phone,
  ref,
}) => {
  const { data } = await $authHost.put("api/user/user", {
    id,
    email,
    role,
    lastname,
    firstname,
    phone,
    ref,
  });
  return data;
};

export const createUser = async ({
  email,
  role,
  lastname,
  firstname,
  phone,
  ref,
}) => {
  const { data } = await $authHost.post("api/user/create-user", {
    email,
    role,
    lastname,
    firstname,
    phone,
    ref,
  });
  return data;
};

export const check = async () => {
  try {
    const { data } = await $authHost.get("api/user/auth");
    localStorage.setItem("token", data.token);
    return jwt_decode(data.token);
  } catch (e) {
    localStorage.removeItem("token");
    location.reload();
    throw new Error("token deleted");
  }
};
