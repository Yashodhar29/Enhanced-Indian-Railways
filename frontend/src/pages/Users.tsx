import { useState, useEffect } from "react";
import axios from "axios";
import Label from "../components/form/Label";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../icons";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface User {
    id: number;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    designation: string;
    role: string;
}

export default function Users() {
    const [showPassword, setShowPassword] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserName, setCurrentUserName] = useState();


    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        designation: "",
        role: "",
        email: "",
    });

    const fetchUsers = async () => {
        try {
            const res = await axios.get("https://improved-b-form-backend.onrender.com/api/users");
            console.log(res)
            if (res.data.success) {
                setUsers(res.data.users);
            }
            const res1 = await axios.get("https://improved-b-form-backend.onrender.com/api/get-user-and-role", {
                withCredentials: true
            });
            if (res1.data) {
                setCurrentUserName(res1.data.username);
            }
        } catch (err) {
            console.error("Fetch users error:", err);
            toast.error("Failed to load users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await axios.post("https://improved-b-form-backend.onrender.com/api/add-user", formData);
            if (res.data.success) {
                toast.success("User added successfully!");
                setFormData({
                    firstName: "",
                    lastName: "",
                    username: "",
                    password: "",
                    designation: "",
                    role: "",
                    email: "",
                });
                fetchUsers();
            } else {
                toast.error(res.data.message || "Failed to add user");
            }
        } catch (err) {
            console.error("Add user error:", err);
            toast.error("Error connecting to server");
        }
    };

    const handleDelete = async (id: number) => {

        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await axios.get(`https://improved-b-form-backend.onrender.com/api/users/${id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success("User deleted!");
                setUsers(users.filter((u) => u.id !== id));
            } else {
                toast.error("Failed to delete user");
            }
        } catch (err) {
            console.error("Delete user error:", err);
            toast.error("Error deleting user");
        }
    };


    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-5xl mx-auto">
                <ToastContainer position="top-right" autoClose={3000} style={{marginTop: "64px"}} />

                <div className="mb-10">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                        Add Users
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label>First Name *</Label>
                                    <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Last Name *</Label>
                                    <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <Label>Username *</Label>
                                <Input name="username" value={formData.username} onChange={handleChange} />
                            </div>

                            <div>
                                <Label>Password *</Label>
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                    >
                                        {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <Label>Designation *</Label>
                                <Input name="designation" value={formData.designation} onChange={handleChange} />
                            </div>

                            <div>
                                <Label>Role *</Label>
                                <Input name="role" value={formData.role} onChange={handleChange} />
                            </div>

                            <div>
                                <Label>Email *</Label>
                                <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                            </div>

                            <Button className="w-full" size="sm" type="submit">
                                Add User
                            </Button>
                        </div>
                    </form>
                </div>

                {/* ------------------- Users Table ------------------- */}
                <div>
                    <h2 className="mb-4 font-semibold text-gray-800 text-title-sm dark:text-white/90">
                        Users List
                    </h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:border-gray-300 dark:bg-white/[0.03]">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500 dark:text-white">Username</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500 dark:text-white">Password</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500 dark:text-white">First Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500 dark:text-white">Last Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500 dark:text-white">Email</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500 dark:text-white">Designation</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500 dark:text-white">Role</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500 dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">{user.username}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-white">{user.password}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">{user.firstname}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">{user.lastname}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">{user.email}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">{user.designation}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">{user.role}</td>
                                            <td className="px-4 py-2 text-sm">
                                                {currentUserName === user.username ? (
                                                    <span className="text-gray-500"></span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className={`rounded bg-red-500 text-white hover:bg-red-600"}
                                                        px-3 py-1 text-xs`}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="p-4 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
