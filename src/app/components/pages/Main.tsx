import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useLiveQuery } from "dexie-react-hooks";
import * as Repo from "app/repo";
import PageLayout from "app/components/layout/PageLayout";

const Main: React.FC = () => {
  return (
    <PageLayout>
      <div className="p-4">
        <Content />
      </div>
    </PageLayout>
  );
};

export default Main;

const Content: React.FC = () => {
  const notify = useCallback(() => {
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

  const addPost = useCallback(() => {
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

  return useMemo(() => {
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
