import { useQuery } from "react-query";

function useEmployee({ userId }) {
  const employeeQuery = useQuery(
    ["employees", userId],
    () => {
      return fetch(`/api/users/${userId}`).then((res) => res.json());
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  return { employeeQuery };
}

function useEmployeeLeaves({ employeeId, year }) {
  const employeeLeavesQuery = useQuery(
    ["leave-forms", employeeId, year],
    () =>
      fetch(`/api/employee/${employeeId}/leave?year=${year}`).then((res) =>
        res.json()
      ),
    {
      refetchOnWindowFocus: false,
    }
  );
  return { employeeLeavesQuery };
}

export { useEmployee, useEmployeeLeaves };
