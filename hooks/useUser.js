import { useMutation } from "react-query";

function useDeleteUser() {
  const deleteUserMutation = useMutation((userId) =>
    fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
  );
  return { deleteUserMutation };
}

export { useDeleteUser };
