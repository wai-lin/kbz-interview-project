import { useQuery } from "react-query";

function useEmployees({ skip = 0, limit = "", search = "" }) {
  const employeesQuery = useQuery(
    ["employees", skip, limit, search],
    () => {
      let queryStr = "";
      if (skip === 0 || skip) queryStr += `skip=${skip}&`;
      if (limit) queryStr += `limit=${limit}&`;
      if (search) queryStr += `search=${search}&`;
      return fetch(`/api/users?${queryStr}`).then((res) => res.json());
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  return { employeesQuery };
}

function useEmployeesCount() {
  const employeesCountQuery = useQuery(
    ["employees-count"],
    () => fetch("/api/employee/count").then((res) => res.json()),
    {
      refetchOnWindowFocus: false,
    }
  );

  return { employeesCountQuery };
}

export { useEmployees, useEmployeesCount };
