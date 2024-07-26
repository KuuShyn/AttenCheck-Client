"use client";

import { convertToISO } from "@/lib/Timezone";
import { Button } from "../../../../components/Button";
import InputBox from "../../../../components/InputBox";
import { Backend_URL } from "../../../../lib/Constants";
import Link from "next/link";
import React, { useRef, useState } from "react";

type FormInputs = {
  name: string;
  email: string;
  password: string;
  timeZone: string;
  role: string;
  scheduledStart: string;
  scheduledEnd: string;
};

const SignupPage = () => {
  const [timeZone, setTimeZone] = useState<string>("EST");
  const [role, setRole] = useState<string>("USER");

  const register = async () => {
    const scheduledStartISO = convertToISO(data.current.scheduledStart, data.current.timeZone);
    const scheduledEndISO = convertToISO(data.current.scheduledEnd, data.current.timeZone);

    console.log("Start Working: ",scheduledStartISO);
    console.log("End Working: ",scheduledEndISO);

    const res = await fetch(`${Backend_URL}/auth-v2/register`, {
      method: "POST",
      body: JSON.stringify({
        
        name: data.current.name,
        email: data.current.email,
        password: data.current.password,
        timeZone: data.current.timeZone,
        role: data.current.role,
        scheduledStart: scheduledStartISO,
        scheduledEnd: scheduledEndISO,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      alert(res.statusText);
      return;
    }
    const response = await res.json();
    alert("User Registered!");
  };

  const data = useRef<FormInputs>({
    name: "",
    email: "",
    password: "",
    timeZone: "EST",
    role: "USER",
    scheduledStart: "",
    scheduledEnd: "",
  });

  return (
    <div className="m-2 border rounded overflow-hidden shadow">
      <div className="p-2 bg-gradient-to-b from-white to-slate-200 text-slate-600">
        Spawn a Slave
      </div>
      <div className="p-2 flex flex-col gap-6">
        <InputBox
          autoComplete="off"
          name="name"
          labelText="Name"
          required
          onChange={(e) => (data.current.name = e.target.value)}
        />
        <InputBox
          name="email"
          labelText="Email"
          required
          onChange={(e) => (data.current.email = e.target.value)}
        />
        <InputBox
          name="password"
          labelText="Password"
          type="password"
          required
          onChange={(e) => (data.current.password = e.target.value)}
        />
        <div className="mb-4">
          <label
            htmlFor="timeZone"
            className="block text-sm font-medium text-gray-700"
          >
            Time Zone
          </label>
          <select
            id="timeZone"
            value={data.current.timeZone}
            onChange={(e) => {
              setTimeZone(e.target.value);
              data.current.timeZone = e.target.value;
            }}
            className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="EST">Eastern Standard Time</option>
            <option value="HONDURAS">Honduras Time</option>
            <option value="PHILIPPINES">Philippine Time</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            value={data.current.role}
            onChange={(e) => {
              setRole(e.target.value);
              data.current.role = e.target.value;
            }}
            className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <InputBox
          name="scheduledStart"
          labelText="Scheduled Start Time"
          type="datetime-local"
          required
          onChange={(e) => (data.current.scheduledStart = e.target.value)}
        />
        <InputBox
          name="scheduledEnd"
          labelText="Scheduled End Time"
          type="datetime-local"
          required
          onChange={(e) => (data.current.scheduledEnd = e.target.value)}
        />
        <div className="flex justify-center items-center gap-2">
          <Button onClick={register}>Submit</Button>
          <Link href={"/dashboard"}>Cancel</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
