"use client";
import React, { FC, useState } from "react";
import Form from "./Form";
import Button from "./Button";
import Input from "./Input";
import { updateSubscription, createSubscription } from "@/lib/db";

type T = {
  subscription?: Subscription;
  isNew: boolean;
};

const SubscriptionEditor: FC<T> = ({ subscription, isNew }) => {
  const [sub, setSub] = useState<Subscription>(
    subscription || {
      query: "",
      language: "",
      from: "",
      to: "",
      interest: "",
      name: "",
      id: ""
    }
  );

  const onSave = (sub: Subscription) =>
    isNew ? createSubscription(sub) : updateSubscription(sub);

  return (
    <div className="">
      <form className="flex flex-col gap-4">
        <Input
          type="text"
          id="name"
          label="Name"
          value={sub.name}
          onChange={val => setSub({ ...sub, name: val })}
        />
        <Input
          type="text"
          id="query"
          label="Query"
          value={sub.query}
          onChange={val => setSub({ ...sub, query: val })}
        />
        <Input
          type="text"
          label="Language"
          value={sub.language}
          id="language"
          onChange={val => setSub({ ...sub, language: val })}
        />
        <Input
          type="date"
          label="From date"
          id="from"
          value={sub.from}
          onChange={val => setSub({ ...sub, from: val })}
        />
        <Input
          type="date"
          label="to date"
          id="to"
          value={sub.from}
          onChange={val => setSub({ ...sub, to: val })}
        />

        <label htmlFor="interest">Interest</label>

        <div className="text-right align-right">
          <Button
            onClick={e => {
              e.preventDefault();
              onSave(sub);
            }}
          >
            Save
          </Button>
        </div>
        {/* <input
          className="bg-slate-200 rounded"
          type="submit"
          value="🚀 Submit"
          onClick={onClick}
        /> */}
      </form>
      {/* <Form /> */}
    </div>
  );
};

export default SubscriptionEditor;
