"use client";

import { useState, useMemo } from "react";
import { addCustomer, updateCustomer, deleteCustomer } from "./actions";
import type { Customer } from "@/lib/database.types";

type Fields = { company: string; contact: string; email: string; phone: string };

const EMPTY: Fields = { company: "", contact: "", email: "", phone: "" };

export default function CustomersClient({ initial }: { initial: Customer[] }) {
  const [customers, setCustomers] = useState<Customer[]>(initial);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.company.toLowerCase().includes(q) ||
        c.contact.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [customers, search]);

  function openAdd() {
    setFields(EMPTY);
    setEditing(null);
    setError(null);
    setModal("add");
  }

  function openEdit(c: Customer) {
    setFields({ company: c.company, contact: c.contact, email: c.email, phone: c.phone });
    setEditing(c);
    setError(null);
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
    setError(null);
  }

  function set(k: keyof Fields, v: string) {
    setFields((f) => ({ ...f, [k]: v }));
  }

  async function handleSave() {
    if (!fields.company.trim() || !fields.contact.trim() || !fields.email.trim()) {
      setError("Company, contact, and email are required.");
      return;
    }
    setSaving(true);
    setError(null);

    if (modal === "add") {
      const result = await addCustomer(fields);
      if (result.error) { setError(result.error); setSaving(false); return; }
      const fake: Customer = { id: crypto.randomUUID(), ...fields, created_at: new Date().toISOString() };
      setCustomers((prev) => [fake, ...prev]);
    } else if (editing) {
      const result = await updateCustomer(editing.id, fields);
      if (result.error) { setError(result.error); setSaving(false); return; }
      setCustomers((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...fields } : c)));
    }

    setSaving(false);
    closeModal();
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const result = await deleteCustomer(confirmDelete.id);
    if (result.error) {
      setDeleting(false);
      return;
    }
    setCustomers((prev) => prev.filter((c) => c.id !== confirmDelete.id));
    setDeleting(false);
    setConfirmDelete(null);
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Customers</h1>
          <p className="text-gray-400 text-sm mt-1">
            {filtered.length} of {customers.length} companies
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers…"
              className="pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 w-60"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {!filtered.length ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              {search ? `No customers match "${search}"` : "No customers yet."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/40">
                {["Company", "Contact Person", "Email", "Phone", "Since", ""].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider last:w-20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-800/40 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                        {c.company.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-100">{c.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{c.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{c.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.created_at.slice(0, 10)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(c)}
                        className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-gray-700 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(c)}
                        className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <h2 className="text-base font-semibold text-white">
                {modal === "add" ? "Add Customer" : "Edit Customer"}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <p className="text-xs text-red-400 bg-red-900/20 border border-red-900 rounded-lg px-3 py-2">{error}</p>}
              {(["company", "contact", "email", "phone"] as (keyof Fields)[]).map((k) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 capitalize">
                    {k === "company" ? "Company Name" : k === "contact" ? "Contact Person" : k.charAt(0).toUpperCase() + k.slice(1)}
                    {k !== "phone" && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  <input
                    type={k === "email" ? "email" : "text"}
                    value={fields[k]}
                    onChange={(e) => set(k, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    placeholder={
                      k === "company" ? "e.g. Bright Spark Electrical Sdn Bhd"
                      : k === "contact" ? "e.g. Ahmad Firdaus"
                      : k === "email" ? "e.g. contact@company.com"
                      : "e.g. +60 12-345 6789"
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 text-sm font-semibold rounded-lg transition-colors"
              >
                {saving ? "Saving…" : modal === "add" ? "Add Customer" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <div className="w-10 h-10 rounded-full bg-red-900/40 border border-red-800 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Delete customer?</h3>
            <p className="text-sm text-gray-400 mb-6">
              <span className="text-gray-200 font-medium">{confirmDelete.company}</span> will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
