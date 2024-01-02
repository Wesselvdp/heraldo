"use client";
import React, { FC, useState, useEffect } from "react";
import Form from "./Form";
import Button from "./Button";
import Input from "./Input";
import { updateSubscription, createSubscription } from "@/lib/db";
import { useContext } from "react";
import { MyContext } from "./MainBody";
type T = {
  subscription?: Subscription;
  isNew: boolean;
};

const SubscriptionEditor: FC<T> = ({ subscription, isNew }) => {
  const { panelActions, setPanelRenderFunc } = useContext(MyContext);

  // const [keywords, setKeywords]

  const [sub, setSub] = useState<Subscription>(
    subscription || {
      query: [],
      language: "",
      from: "",
      to: "",
      interest: "",
      name: "",
      id: ""
    }
  );

  useEffect(() => {
    console.log({ sub });
  }, [sub]);

  const onSave = (sub: Subscription) =>
    isNew ? createSubscription(sub) : updateSubscription(sub);

  return (
    <div className="">
      {/* <pre>{JSON.stringify(sub, null, 2)}</pre> */}
      <form className="flex flex-col gap-4">
        <Input
          type="text"
          id="name"
          label="Name"
          value={sub.name}
          onChange={val => setSub({ ...sub, name: val })}
        />
        <div className="inline-flex w-[33%] gap-2 flex-col">
          <label>Keywords</label>
          {sub.query.map((v, i) => (
            <div className="flex items-center">
              <Input
                type="text"
                id="query"
                value={v}
                className="mr-3"
                onChange={val =>
                  setSub({
                    ...sub,
                    query: sub.query.map((el, index) =>
                      i === index ? val : el
                    )
                  })
                }
              />
              <span
                onClick={() =>
                  setSub({
                    ...sub,
                    query: sub.query.flatMap((el, index) =>
                      i === index ? [] : el
                    )
                  })
                }
              >
                trash
              </span>
            </div>
          ))}
          <Button
            onClick={e => {
              e.preventDefault();

              setSub({
                ...sub,
                query: [...sub.query, ""]
              });
            }}
          >
            Add keywords
          </Button>
        </div>
        {/* <Input
          type="text"
          label="Language"
          value={sub.language}
          id="language"
          onChange={val => setSub({ ...sub, language: val })}
        /> */}
        <Input
          type="date"
          label="From date"
          id="from"
          value={sub.from.slice(0, 10)}
          onChange={val => setSub({ ...sub, from: val })}
        />
        <Input
          type="date"
          label="to date"
          id="to"
          value={sub.to.slice(0, 10)}
          onChange={val => setSub({ ...sub, to: val })}
        />
        <Input
          type="text"
          label="Special interest"
          id="interest"
          value={sub.interest}
          onChange={val => setSub({ ...sub, interest: val })}
        />

        <div className="text-right align-right">
          <Button
            onClick={e => {
              e.preventDefault();
              setPanelRenderFunc(() => () => <Form params={sub} />);
              panelActions.open();
            }}
          >
            Test
          </Button>
          {sub !== subscription && (
            <Button
              onClick={e => {
                e.preventDefault();
                onSave(sub);
              }}
            >
              Save
            </Button>
          )}
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
