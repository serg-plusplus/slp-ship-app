import { useCallback, useMemo, memo, useRef } from "react";
import classNames from "clsx";
import { useWallet } from "use-wallet";
import toast from "react-hot-toast";
import { useLiveQuery } from "dexie-react-hooks";
import { useBadger } from "lib/badger";
import * as Repo from "app/repo";
import PageLayout from "app/components/PageLayout";

const Main: React.FC = () => {
  return (
    <PageLayout>
      <div className="p-4">
        <Connect />
      </div>
    </PageLayout>
  );
};

export default Main;

const Connect: React.FC = () => {
  return (
    <div className="flex flex-col">
      <ConnetMetamask />
      <ConnetBadger />
    </div>
  );
};

const ConnetMetamask = memo(() => {
  const { connect, account } = useWallet();
  const connectingRef = useRef(false);

  const handleClick = useCallback(() => {
    if (account) return;

    if (connectingRef.current) return;
    connectingRef.current = true;

    const promise = connect("injected").finally(() => {
      connectingRef.current = false;
    });

    toast.promise(promise, {
      loading: "Connecting...",
      success: () => "Connected!",
      error: (err) => `Error when try to connect: ${err?.message ?? "unknown"}`,
    });
  }, [connect, account]);

  return (
    <button
      className={classNames(
        "mb-4 w-56",
        "flex items-center py-2 px-4",
        "capitalize tracking-wide bg-blue-600",
        "dark:bg-gray-800 text-white",
        "font-medium rounded hover:bg-blue-500",
        "dark:hover:bg-gray-700 focus:outline-none",
        "focus:bg-blue-500 dark:focus:bg-gray-700"
      )}
      onClick={handleClick}
    >
      {account ?? "Connect to Metamask"}
    </button>
  );
});

const ConnetBadger = memo(() => {
  const bch = useBadger();
  const installed = Boolean(bch?.defaultAccount);

  const commonProps = useMemo(
    () => ({
      className: classNames(
        "mb-4 w-56",
        "flex items-center py-2 px-4",
        "capitalize tracking-wide bg-blue-600",
        "dark:bg-gray-800 text-white",
        "font-medium rounded hover:bg-blue-500",
        "dark:hover:bg-gray-700 focus:outline-none",
        "focus:bg-blue-500 dark:focus:bg-gray-700"
      ),
    }),
    []
  );

  return installed ? (
    <button
      className={classNames(
        "mb-4 w-56",
        "flex items-center py-2 px-4",
        "capitalize tracking-wide bg-blue-600",
        "dark:bg-gray-800 text-white",
        "font-medium rounded hover:bg-blue-500",
        "dark:hover:bg-gray-700 focus:outline-none",
        "focus:bg-blue-500 dark:focus:bg-gray-700"
      )}
    >
      {bch?.defaultAccount}
    </button>
  ) : (
    <a
      {...commonProps}
      href="https://badgerwallet.cash/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Install Badger Wallet
    </a>
  );
});

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
