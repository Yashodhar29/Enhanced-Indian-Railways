import { useState } from "react";
import Label from "../components/form/Label";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../icons";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AddUsers() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        designation: "",
        role: "",
        email: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3002/api/add-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("User added successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setFormData({
                    firstName: "",
                    lastName: "",
                    username: "",
                    password: "",
                    designation: "",
                    role: "",
                    email: "",
                });
            } else {
                toast.error(data.message || "Failed to add user", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error connecting to server", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-2xl mx-auto">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    style={{marginTop: "4rem"}}
                />
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Add Users
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fill out the form to create a new user account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* First & Last Name in two columns */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label>First Name <span className="text-error-500">*</span></Label>
                                    <Input
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label>Last Name <span className="text-error-500">*</span></Label>
                                    <Input
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <Label>Username <span className="text-error-500">*</span></Label>
                                <Input
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <Label>Password <span className="text-error-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Designation */}
                            <div>
                                <Label>Designation <span className="text-error-500">*</span></Label>
                                <Input
                                    name="designation"
                                    placeholder="Designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <Label>Role <span className="text-error-500">*</span></Label>
                                <Input
                                    name="role"
                                    placeholder="Role (e.g. admin, user)"
                                    value={formData.role}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <Label>Email <span className="text-error-500">*</span></Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <Button className="w-full" size="sm" type="submit">
                                    Add User
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}