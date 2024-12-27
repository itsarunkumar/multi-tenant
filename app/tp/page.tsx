import React from "react";

import Table from "@/components/shared/table";

import prisma from "@/lib/prisma";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const data: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
];

async function App() {
  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",

      accessor: "role",
    },
    {
      header: "Actions",
      accessor: "id",
    },
  ];

  const data = await prisma.tenant.findMany({
    where: {},
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Table</h1>
      {/* <Table columns={columns} data={data} /> */}
    </div>
  );
}

export default App;
