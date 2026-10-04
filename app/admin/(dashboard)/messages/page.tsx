import React from "react";
import { Search, Mail, Reply, Trash2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MOCK_MESSAGES = [
  { id: 1, name: "Anita Reddy", email: "anita@example.com", subject: "Membership Query", date: "Oct 16, 2026", isRead: false, snippet: "I have a question regarding the required documents for..." },
  { id: 2, name: "Vijay Kumar", email: "vijay@test.com", subject: "Event Sponsorship", date: "Oct 15, 2026", isRead: true, snippet: "We are interested in sponsoring the upcoming tech convention..." },
];

export const metadata = {
  title: "Messages | TASPU Admin",
};

export default function MessagesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">Inquiries from the public website.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-border">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input placeholder="Search messages..." className="pl-10 h-11" />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
        {MOCK_MESSAGES.map((msg) => (
          <div key={msg.id} className={`p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 ${!msg.isRead ? 'bg-[#FAF8F3]/30' : ''}`}>
            
            <div className="flex items-start gap-4">
              <div className={`mt-1 rounded-full p-2 ${!msg.isRead ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                <Mail size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold ${!msg.isRead ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</h3>
                  <span className="text-sm text-gray-500">&lt;{msg.email}&gt;</span>
                  {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary inline-block ml-2"></span>}
                </div>
                <h4 className={`text-sm mb-1 ${!msg.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>{msg.subject}</h4>
                <p className="text-sm text-gray-500 line-clamp-1">{msg.snippet}</p>
                <div className="text-xs text-gray-400 mt-2">{msg.date}</div>
              </div>
            </div>

            <div className="flex md:flex-col lg:flex-row gap-2 shrink-0 md:ml-auto">
              {!msg.isRead && (
                <Button variant="outline" size="sm" className="h-9">
                  <CheckCircle2 size={16} className="mr-2" /> Mark Read
                </Button>
              )}
              <Button variant="outline" size="sm" className="h-9">
                <Reply size={16} className="mr-2" /> Reply
              </Button>
              <Button variant="ghost" size="sm" className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 size={16} />
              </Button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
