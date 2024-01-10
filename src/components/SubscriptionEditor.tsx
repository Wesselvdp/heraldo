"use client";
import React, { FC, useState, useEffect } from "react";
import Form from "./Form";
import Button from "./Button";
import Input from "./Input";
import { updateSubscription, createSubscription } from "@/lib/db";
import { useContext } from "react";
import { MyContext } from "./MainBody";
import { TestServerCookie } from "./TestServerCookie";
type T = {
  subscription?: Subscription;
  save: (sub: Subscription) => void;
  // onNameChange: (val: string) => void;
};

const keywordSuggestions = ["drones", "garmin", "solar", "poverty"];

const getRandomKeyword = () => {
  return keywordSuggestions[
    Math.floor(Math.random() * keywordSuggestions.length)
  ];
};

const SubscriptionEditor: FC<T> = ({ subscription, save }) => {
  const { panelActions, setPanelRenderFunc } = useContext(MyContext);
  const [newKeyword, setNewKeyword] = useState<string>("");
  const [sub, setSub] = useState<Subscription>(
    subscription || {
      query: [],
      language: "",
      from: "",
      to: "",
      interest: "",
      name: "",
      id: "",
      owner: ""
    }
  );

  useEffect(() => {
    save(sub);
  }, [subscription]);

  const deleteKeyword = (i: number) =>
    setSub({
      ...sub,
      query: sub.query.flatMap((el, index) => (i === index ? [] : el))
    });

  const onSave = (sub: Subscription) => save(sub);

  return (
    <div className="">
      {/* <pre>{JSON.stringify(sub, null, 2)}</pre> */}
      <form className="flex flex-col gap-6">
        <Input
          type="text"
          id="name"
          label="Name"
          value={sub.name}
          onChange={val => {
            setSub({ ...sub, name: val });
            // onNameChange(val);
          }}
        />

        {/* Query */}
        <div className="inline-flex w-[33%] gap-1 flex-col">
          <label>Search keywords</label>
          {sub.query?.map((v, i) => (
            <div key={i} className="flex items-center">
              <Input
                type="text"
                id="query"
                value={v}
                className="mr-3"
                onBlur={val => {
                  if (!val) deleteKeyword(i);
                }}
                onChange={val => {
                  setSub({
                    ...sub,
                    query: sub.query.map((el, index) =>
                      i === index ? val : el
                    )
                  });
                }}
              />

              <span
                onClick={() => deleteKeyword(i)}
                className="material-icons text-sm"
              >
                delete
              </span>
            </div>
          ))}
          <div className="flex opacity-60 items-center">
            <Input
              type="text"
              id="query"
              value={newKeyword}
              className="mr-3"
              placeholder={`e.g. ${getRandomKeyword()}`}
              onChange={val => setNewKeyword(val)}
              onBlur={val => {
                val &&
                  setSub({
                    ...sub,
                    query: [...sub.query, val]
                  });
                setNewKeyword("");
              }}
            />
          </div>

          {/* <Button
            onClick={e => {
              e.preventDefault();

              setSub({
                ...sub,
                query: [...sub.query, ""]
              });
            }}
          >
            Add keywords
          </Button> */}
        </div>
        <Input
          type="text"
          label="Describe your interest as you would to a child"
          id="interest"
          placeholder="I want to know about new climate change initiatives"
          value={sub.interest}
          onChange={val => setSub({ ...sub, interest: val })}
        />
        <Input
          type="date"
          label="From date"
          id="from"
          value={sub.from?.slice(0, 10) || ""}
          onChange={val => setSub({ ...sub, from: val })}
        />
        <Input
          type="date"
          label="To date"
          id="to"
          value={sub.to.slice(0, 10)}
          onChange={val => setSub({ ...sub, to: val })}
        />

        <div className="text-right align-right">
          <Button
            onClick={e => {
              e.preventDefault();
              setPanelRenderFunc(() => () => <Form sub={sub} />);
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
