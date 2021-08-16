import { useQuery, useMutation } from "react-query";

function useHolidays({ year, month }) {
  const holidaysQuery = useQuery(["public-holidays", year, month], () =>
    fetch(`/api/holidays?year=${year}&month=${month}`).then((res) => res.json())
  );
  return { holidaysQuery };
}

function useHoliday({ id }) {
  const holidayQuery = useQuery(["public-holidays", id], () =>
    fetch(`/api/holidays/${id}`).then((res) => res.json())
  );
  return { holidayQuery };
}

function useCreateHoliday() {
  const createHolidayMutation = useMutation((holiday) =>
    fetch(`/api/holidays`, {
      method: "POST",
      body: JSON.stringify(holiday),
    }).then((res) => res.json())
  );
  return { createHolidayMutation };
}

function useUpdateHoliday() {
  const updateHolidayMutation = useMutation((holiday) =>
    fetch(`/api/holidays`, {
      method: "PUT",
      body: JSON.stringify(holiday),
    }).then((res) => res.json())
  );
  return { updateHolidayMutation };
}

function useDeleteHoliday() {
  const deleteHolidayMutation = useMutation((id) =>
    fetch(`/api/holidays?id=${id}`, {
      method: "DELETE",
    }).then((res) => res.json())
  );
  return { deleteHolidayMutation };
}

export {
  useHolidays,
  useHoliday,
  useCreateHoliday,
  useUpdateHoliday,
  useDeleteHoliday,
};
