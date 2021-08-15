import { useMutation, useQuery } from "react-query";

function useLeaveCount() {
  const leaveFormCountQuery = useQuery(
    ["unapproved-leave-forms-count"],
    () => fetch(`/api/leave/count`).then((res) => res.json()),
    {
      refetchOnWindowFocus: false,
    }
  );
  return { leaveFormCountQuery };
}

function useLeaves() {
  const leaveFormsQuery = useQuery(
    ["unapproved-leave-forms"],
    () => fetch(`/api/leave`).then((res) => res.json()),
    {
      refetchOnWindowFocus: false,
    }
  );
  return { leaveFormsQuery };
}

function useLeave({ id }) {
  const leaveFormQuery = useQuery(
    ["leave-forms", id],
    () => fetch(`/api/leave/${id}`).then((res) => res.json()),
    {
      refetchOnWindowFocus: false,
    }
  );
  return { leaveFormQuery };
}

function useCreateLeave() {
  const leaveFormCreateMutation = useMutation((leaveForm) =>
    fetch(`/api/leave`, {
      method: "POST",
      body: JSON.stringify(leaveForm),
    }).then((res) => res.json())
  );
  return { leaveFormCreateMutation };
}

function useUpdateLeave() {
  const leaveFormUpdateMutation = useMutation(
    ({ id, leaveStartDate, leaveEndDate, isApproved }) =>
      fetch(`/api/leave/${id}`, {
        method: "PUT",
        body: JSON.stringify({ leaveStartDate, leaveEndDate, isApproved }),
      }).then((res) => res.json())
  );
  return { leaveFormUpdateMutation };
}

function useDeleteLeave() {
  const leaveFormDeleteMutation = useMutation((id) =>
    fetch(`/api/leave/${id}`, {
      method: "DELETE",
    }).then((res) => res.json())
  );
  return { leaveFormDeleteMutation };
}

export {
  useLeaveCount,
  useLeaves,
  useLeave,
  useCreateLeave,
  useUpdateLeave,
  useDeleteLeave,
};
