"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronsUpDown, LayoutGrid, Search, Trash2, Users, CreditCard, ChevronLeft, ChevronRight, Edit, X, MessageCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Employee = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Admin" | "Staff";
};

type EmployeeFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Admin" | "Staff";
};

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Staff",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>("Users"); // Track selected icon

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Fetch employees
  useEffect(() => {
    if (status === "authenticated") {
      fetchEmployees();
    }
  }, [status]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/employees");

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
      setTotalPages(Math.ceil(data.length / 10));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add employee");
      }

      await fetchEmployees();
      setShowAddModal(false);
      resetForm();
      toast.success("Employee added successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to add employee");
      } else {
        toast.error("Failed to add employee");
      }
    }
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentEmployee) return;

    try {
      const response = await fetch(`/api/employees/${currentEmployee._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update employee");
      }

      await fetchEmployees();
      setShowEditModal(false);
      resetForm();
      toast.success("Employee updated successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update employee");
      } else {
        toast.error("Failed to update employee");
      }
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete employee");
      }

      await fetchEmployees();
      toast.success("Employee deleted successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to delete employee");
      } else {
        toast.error("Failed to delete employee");
      }
    }
  };

  const openEditModal = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Staff",
    });
    setCurrentEmployee(null);
  };

  const toggleRowSelection = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * 10, currentPage * 10);

  if (isLoading || status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8f8]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#d8d8d8] border-t-[#2bda53] mx-auto"></div>
          <p className="text-[#6a7e8a]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f6f8f8]">
      {/* Sidebar - Fixed, Starting Below Header with Spaced Icons */}
      <div className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-white border-r border-[#6A7E8A1A] flex flex-col items-center justify-center gap-9 z-100">
        {[
          { id: "LayoutGrid", icon: LayoutGrid, path: "/dashboard" },
          { id: "Users", icon: Users, path: "/employees" },
          { id: "CreditCard", icon: CreditCard, path: "/payments" },
        ].map(({ id, icon: Icon, path }) => (
          <div
            key={id}
            className={`p-2 w-full flex justify-center items-center rounded-md cursor-pointer transition-all duration-200 ${
              selectedIcon === id
                ? "border-l-4 border-[#2bda53]"
                : "hover:bg-[#f6f8f8] hover:border-l-4 hover:border-[#2bda53]"
            }`}
            onClick={() => {
              setSelectedIcon(id);
              router.push(path);
            }}
          >
            {/* Special rendering for Users icon to include a speech bubble */}
            {id === "Users" ? (
              <div className="relative">
                <Icon
                  className={`${
                    selectedIcon === id ? "text-[#2bda53]" : "text-[#6a7e8a]"
                  } transition-colors`}
                  size={22}
                />
                {/* Add a small speech bubble when selected */}
                {selectedIcon === id && (
                  <MessageCircle
                    className="absolute -top-1 -right-1 text-[#2bda53] transform scale-50"
                    size={12}
                  />
                )}
              </div>
            ) : (
              <Icon
                className={`${
                  selectedIcon === id ? "text-[#2bda53]" : "text-[#6a7e8a]"
                } transition-colors`}
                size={22}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Wrapper */}
      <div className="flex-1 ml-16">
        {/* Header - Fixed with Shadow */}
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-[#6A7E8A1A] z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center">
              <span className="text-[#013c61] font-semibold text-lg">Get</span>
              <span className="text-[#2bda53] font-semibold text-lg">change</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#6a7e8a] flex items-center justify-center text-white">
                {session?.user?.name?.[0] || "U"}
              </div>
              <div className="relative">
                <div className="flex items-center gap-1">
                  <span className="text-[#3c4340]">
                    Hi, {session?.user?.name?.split(" ")[0] || "User"}
                  </span>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="focus:outline-none"
                    aria-expanded={isDropdownOpen}
                    aria-controls="dropdown-menu"
                  >
                    <ChevronDown
                      size={16}
                      className={`text-[#6a7e8a] transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                </div>
                <div
                  id="dropdown-menu"
                  className={`absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-20 transform transition-all duration-200 ease-in-out ${
                    isDropdownOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/signin" });
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#2bda53] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="pt-20 px-6 pb-6 h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-[#013c61]">Employees</h1>
            <button
              className="bg-[#2bda53] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              Add New
            </button>
          </div>

          <div className="bg-white rounded-md shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#013c61]">Josh Bakery Ventures</h2>
              <p className="text-[#6a7e8a]">62, Bode Thomas, Surulere, Lagos</p>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              {/* Left Section: Change Role and Change Button */}
              <div className="flex items-center gap-4">
                <div className="relative w-48">
                  <div className="flex items-center justify-between border border-[#d8d8d8] bg-[#f6f8f8] rounded-md px-3 py-2 text-[#6a7e8a]">
                    <span>Change role</span>
                    <ChevronsUpDown size={16} className="text-[#6a7e8a]" />
                  </div>
                </div>
                <button className="bg-[#2bda53] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors">
                  Change
                </button>
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter staff name here..."
                    className="w-64 border border-[#d8d8d8] bg-[#f6f8f8] rounded-md px-3 py-2 pl-10 text-[#6a7e8a] focus:outline-none focus:ring-2 focus:ring-[#2bda53]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6a7e8a]" />
                </div>
              </div>

              {/* Right Section: Pagination */}
              <div className="flex items-center gap-4">
                {/* Pagination */}
                <span className="text-[#6a7e8a] text-sm">{currentPage} of {totalPages || 1}</span>
                <div className="flex gap-1">
                  <button
                    className={`w-6 h-6 rounded-full bg-[#2bda53] flex items-center justify-center text-white hover:bg-opacity-90 transition-colors ${
                      currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className={`w-6 h-6 rounded-full bg-[#2bda53] flex items-center justify-center text-white hover:bg-opacity-90 transition-colors ${
                      currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-[#d8d8d8]">
                  <th className="py-3 px-4 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 border-[#d8d8d8] bg-white checked:bg-[#2bda53] checked:border-[#2bda53] focus:ring-0 focus:outline-none"
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-[#6a7e8a] font-medium">FIRST NAME</th>
                  <th className="py-3 px-4 text-left text-[#6a7e8a] font-medium">LAST NAME</th>
                  <th className="py-3 px-4 text-left text-[#6a7e8a] font-medium">EMAIL</th>
                  <th className="py-3 px-4 text-left text-[#6a7e8a] font-medium">PHONE</th>
                  <th className="py-3 px-4 text-left text-[#6a7e8a] font-medium">ROLE</th>
                  <th className="py-3 px-4 text-left text-[#6a7e8a] font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((employee) => (
                    <tr key={employee._id} className="border-b border-[#d8d8d8]">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          className={`h-4 w-4 border-[#d8d8d8] bg-white checked:bg-[#2bda53] checked:border-[#2bda53] focus:ring-0 focus:outline-none ${
                            selectedRows.includes(employee._id) ? "bg-[#2bda53] border-[#2bda53]" : ""
                          }`}
                          checked={selectedRows.includes(employee._id)}
                          onChange={() => toggleRowSelection(employee._id)}
                        />
                      </td>
                      <td className="py-4 px-4 text-[#6a7e8a]">{employee.firstName}</td>
                      <td className="py-4 px-4 text-[#6a7e8a]">{employee.lastName}</td>
                      <td className="py-4 px-4 text-[#6a7e8a]">{employee.email}</td>
                      <td className="py-4 px-4 text-[#6a7e8a]">{employee.phone}</td>
                      <td className="py-4 px-4 text-[#6a7e8a]">{employee.role}</td>
                      <td className="py-4 px-4 flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700" onClick={() => openEditModal(employee)}>
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-[#979797] hover:text-[#3c4340]"
                          onClick={() => handleDeleteEmployee(employee._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 px-4 text-center text-[#6a7e8a]">
                      {searchTerm
                        ? "No employees found matching your search"
                        : "No employees found. Add one to get started!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#013c61]">Add New Employee</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#6a7e8a]">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#6a7e8a]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#6a7e8a]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#6a7e8a]">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-[#6a7e8a]">
                    Role
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as "Admin" | "Staff" })}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2"
                    required
                  >
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-[#6a7e8a]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#2bda53] text-white rounded-md hover:bg-opacity-90">
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && currentEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#013c61]">Edit Employee</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditEmployee}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="editFirstName" className="block text-sm font-medium text-[#6a7e8a]">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="editFirstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editLastName" className="block text-sm font-medium text-[#6a7e8a]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="editLastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editEmail" className="block text-sm font-medium text-[#6a7e8a]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="editEmail"
                    value={formData.email}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2 bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label htmlFor="editPhone" className="block text-sm font-medium text-[#6a7e8a]">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="editPhone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editRole" className="block text-sm font-medium text-[#6a7e8a]">
                    Role
                  </label>
                  <input
                    type="text"
                    id="editRole"
                    value={formData.role}
                    className="mt-1 block w-full border border-[#d8d8d8] rounded-md px-3 py-2 bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-[#6a7e8a]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#2bda53] text-white rounded-md hover:bg-opacity-90">
                  Update Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}