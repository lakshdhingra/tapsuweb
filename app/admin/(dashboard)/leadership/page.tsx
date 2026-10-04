import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

export const metadata = {
  title: "Leadership | TASPU Admin",
};

const leaders = [
  {
    id: 1,
    name: "Vijaya Bhaskar Reddy",
    position: "President",
    photo: "/leaders/president.png",
  },
  {
    id: 2,
    name: "Rameshwar Rao",
    position: "Guest President",
    photo: "/leaders/guest president.jpeg",
  },
  {
    id: 3,
    name: "Murali Krishna Teja",
    position: "Working President",
    photo: "/leaders/working president.jpeg",
  },
  {
    id: 4,
    name: "Thanniru Nagaraju",
    position: "General Secretary",
    photo: "/leaders/gen sec.jpeg",
  },
  {
    id: 5,
    name: "Chekrala Krishna Prasad",
    position: "Joint Secretary",
    photo: "/leaders/joint sec.jpeg",
  },
  {
    id: 6,
    name: "Mohd Anwar",
    position: "Treasurer",
    photo: "/leaders/treasurer.jpeg",
  },
  {
    id: 7,
    name: "Ramsingh Bondil",
    position: "Executive Member",
    photo: "/leaders/ec member.jpeg",
  },
  {
    id: 8,
    name: "Thipparthi Chakradhar Kumar",
    position: "Executive Member",
    photo: "/leaders/ec member 2.jpeg",
  },
];

export default function LeadershipAdminPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Leadership Management</h1>
          <p className="text-muted-foreground mt-1">Manage the executive committee members displayed on the website.</p>
        </div>
        <div className="flex space-x-3">
          <Button className="h-11">
            <Plus size={18} className="mr-2" /> Add Leader
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 w-20">Photo</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaders.map((leader) => (
                <tr key={leader.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
                      <Image
                        src={leader.photo}
                        alt={leader.name}
                        fill
                        className="object-cover object-top"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{leader.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                      {leader.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600">
                      <Edit size={16} />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-600">
                      <Trash2 size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
