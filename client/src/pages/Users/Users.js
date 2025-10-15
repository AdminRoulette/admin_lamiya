import React from "react";
import { useParams } from "react-router-dom";
import UsersPage from "./components/UsersPage";
import CashiersPage from "./components/CachiersPage";
import StatsPage from "./components/StatsPage";
// import NotFoundPage from "../NotFoundPage";
const Users = () => {
  const { userParam } = useParams();

  return (
    <>
      {userParam === "list" ? (
        <UsersPage />
      ) : userParam === "cashiers" ? (
        <CashiersPage />
      ) : userParam === "stats" ? (
       <StatsPage /> 
      ) : (
        <></>
      )}
    </>
  );
};

export default Users;
