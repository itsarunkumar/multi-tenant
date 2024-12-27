"use client";

import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import sleep from "@/utils/sleep";
import debounce from "@/utils/debounce";

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Tenant Name is required"),
  subdomain: Yup.string()
    .required("Subdomain is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Subdomain must be lowercase letters, numbers, or hyphens"
    ),
});

export default function TenantCreator() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subdomainError, setSubdomainError] = useState("");
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
  const [subdomain, setSubdomain] = useState("");

  // Debounced Subdomain Checker
  const checkSubdomainAvailability = debounce(async (subdomain: string) => {
    if (!subdomain) return;

    setIsCheckingSubdomain(true);
    setSubdomainError("");

    try {
      await sleep(500); // Simulating delay

      const response = await fetch(
        `/api/check-subdomain?subdomain=${subdomain}`
      );
      const data = await response.json();

      if (!response.ok || !data.available) {
        setSubdomainError("This subdomain is already taken");
      }
    } catch (err) {
      setSubdomainError("Failed to check subdomain availability");
      console.error("Error checking subdomain availability:", err);
    } finally {
      setIsCheckingSubdomain(false);
    }
  }, 500);

  useEffect(() => {
    if (subdomain) {
      checkSubdomainAvailability(subdomain);
    }
  }, [subdomain]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Welcome to Multitenant App
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Create a new tenant to get started.
          </p>

          <Formik
            initialValues={{ name: "", subdomain: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setMessage("");
              setError("");

              try {
                await sleep(1000); // Simulate network delay

                const response = await fetch("/api/create-tenant", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                if (response.ok) {
                  const data = await response.json();
                  setMessage(
                    `Tenant created successfully: ${data.name} (${data.subdomain})`
                  );
                  resetForm();
                } else {
                  const errorData = await response.json();
                  setError(errorData.error || "Failed to create tenant");
                }
              } catch (error) {
                setError("An error occurred while creating the tenant");
                console.error("Error creating tenant:", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Tenant Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="text"
                    name="subdomain"
                    placeholder="Subdomain"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("subdomain", e.target.value);
                      setSubdomain(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isCheckingSubdomain && (
                    <p className="text-blue-500 text-sm mt-1">
                      Checking availability...
                    </p>
                  )}
                  {subdomainError && (
                    <p className="text-red-500 text-sm mt-1">
                      {subdomainError}
                    </p>
                  )}
                  <ErrorMessage
                    name="subdomain"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || isCheckingSubdomain || !!subdomainError
                  }
                  className={`w-full ${
                    isSubmitting || isCheckingSubdomain || !!subdomainError
                      ? "bg-gray-400"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300`}
                >
                  {isSubmitting ? "Creating..." : "Create Tenant"}
                </button>
              </Form>
            )}
          </Formik>

          {message && (
            <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
              <h2 className="font-bold">Success</h2>
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
