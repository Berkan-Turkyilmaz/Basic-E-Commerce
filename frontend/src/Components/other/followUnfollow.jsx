export default async function followUnfollow(id) {
    try {
      const res = await fetch(
        `/api/users/follow/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
  
    } catch (error) {
      console.log(error.message, "Server side error during follow/unfollow");
      return { error: error.message };
    }
  };
  