import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import toast, { Toaster } from "react-hot-toast";
import { useLiveQuery } from "dexie-react-hooks";
import * as Repo from "repo";
import reportWebVitals from "./reportWebVitals";

const App: React.FC = () => {
  const notify = React.useCallback(() => {
    const promise = (async () => {
      const allContacts = await Repo.contacts.toArray();
      console.info(allContacts);
      return allContacts.length;
    })();

    toast.promise(promise, {
      loading: "Loading",
      success: (contractsCount) => `Posts count: ${contractsCount}`,
      error: (err) => `Error when fetching: ${err?.message ?? "unknown"}`,
    });
  }, []);

  const addPost = React.useCallback(() => {
    const promise = (async () => {
      await Repo.contacts.add({
        first: `${Math.random()}`,
        last: "Last name",
      });
    })();

    toast.promise(promise, {
      loading: "Adding post...",
      success: "Post added!",
      error: (err) => `Error when adding: ${err?.message ?? "unknown"}`,
    });
  }, []);

  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <br />
      <button onClick={addPost}>Add post</button>

      <ContactList />
    </div>
  );
};

const ContactList: React.FC = () => {
  const contacts = useLiveQuery(() =>
    Repo.contacts.reverse().limit(10).toArray()
  );

  return React.useMemo(() => {
    return contacts ? (
      <>
        {contacts.map(({ id, first, last }) => (
          <div key={id} className="px-2 text-semibold">
            {first}: {last}
          </div>
        ))}
      </>
    ) : null;
  }, [contacts]);
};

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
