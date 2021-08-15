import { useQuery } from "react-query";

function useEmployees({ cursor = "", limit = "", search = "" }) {
  const employeesQuery = useQuery(
    ["employees"],
    () => {
      let queryStr = "";
      if (cursor) queryStr += `cursor=${cursor}&`;
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
