import React, {useState, useEffect} from "react";
import axios from "axios";
import CardComponent from '../components/CardComponent';

interface User{
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const apiUrl = process.env.API_URL || "http://localhost:4000";
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: ''});
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: ''});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  //create user
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/users`, newUser);
      setUsers([response.data, ...users]);
      setNewUser({ name: '', email: ''});
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  //update user
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.put(`${apiUrl}/users/${updateUser.id}`, {name: updateUser.name, email: updateUser.email});
      setUpdateUser({ id: '', name: '', email: ''});
      setUsers(
        users.map(user => {
          if (user.id === parseInt(updateUser.id)) {
            return {...user, name: updateUser.name, email: updateUser.email };
          }
          return user;
        })
      );
      
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  // delete user
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">User Management App</h1>
      
        {/* Create user */}
        <form onSubmit={createUser} className="p-4 bg-blue-100 rounded shadow">
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            className="mb-2 p-2 w-full border border-gray-300 rounded"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            className="mb-2 p-2 w-full border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300 ease-in-out">
            Add User
          </button>
        </form>

        {/* Update user */}
        <form onSubmit={handleUpdateUser} className="p-4 bg-green-100 rounded shadow">
          <input
            placeholder="User ID"
            value={updateUser.id}
            onChange={(e) => setUpdateUser({...updateUser, id: e.target.value})}
            className="mb-2 p-2 w-full border border-gray-300 rounded"
          />
          <input
            placeholder="New Name"
            value={updateUser.name}
            onChange={(e) => setUpdateUser({...updateUser, name: e.target.value})}
            className="mb-2 p-2 w-full border border-gray-300 rounded"
          />
          <input
            placeholder="New Email"
            value={updateUser.email}
            onChange={(e) => setUpdateUser({...updateUser, email: e.target.value})}
            className="mb-2 p-2 w-full border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600 transition duration-300 ease-in-out">
            Update User
          </button>
        </form>

        {/* Display users */}
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <CardComponent card={user} />
              <button onClick={()=> deleteUser(user.id)} className="bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out text-white py-2 px-4 rounded">
                Delete User
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}