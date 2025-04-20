// components/messages/UserSearch.jsx
import { Autocomplete, Avatar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/UserService";
import { useSelector } from "react-redux";

export default function UserSearch({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        const all = res.data;
        setUsers(all.filter((u) => u.id !== currentUser?.id));
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    if (currentUser?.id) fetchUsers();
  }, [currentUser?.id]);

  return (
    <Autocomplete
      options={users}
      getOptionLabel={(option) => option.name}
      onChange={(_, value) => value && onUserSelect(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search users"
          variant="outlined"
          size="small"
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Avatar
            src={option.avatar_url}
            sx={{ mr: 1, width: 24, height: 24 }}
          />
          {option.name}
        </li>
      )}
      sx={{ mx: 2, my: 1 }}
    />
  );
}