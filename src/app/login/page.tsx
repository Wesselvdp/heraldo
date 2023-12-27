// import Form from '@/components/Form';

import React, { useState } from "react";

export default async function Home() {
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          name="email"
          id=""
        />
        <input
          value={pw}
          onChange={e => setPw(e.target.value)}
          type="text"
          name="password"
          id=""
        />
      </form>
    </main>
  );
}
