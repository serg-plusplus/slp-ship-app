import { useCallback, useMemo } from "react";
import classNames from "clsx";
import { Link } from "woozie";
import toast from "react-hot-toast";
import { useLiveQuery } from "dexie-react-hooks";
import * as Repo from "app/repo";
import PageLayout from "app/components/layout/PageLayout";
import iconUrl1 from "app/misc/1.svg";
import iconUrl39 from "app/misc/39.svg";
import iconUrl117 from "app/misc/117.svg";

const Main: React.FC = () => {
  return (
    <PageLayout
      title="All flights"
      description={
        <>
          Stuck at home due to Covid?
          <br />
          Let your money cross the boards!
        </>
      }
    >
      <div className="py-8">
        <Flights />
      </div>
    </PageLayout>
  );
};

export default Main;

const ALL_FLIGHTS = [
  {
    slug: "to-wslp",
    title: "To ERC20Burg",
    description: "Lock native SLP and Mint WSLP (ERC20)",
    iconUrl: iconUrl1,
    rotated: false,
    active: true,
  },
  {
    slug: "from-wslp",
    title: "From ERC20Burg",
    description: "Burn WSLP (ERC20) and Unlock native SLP",
    iconUrl: iconUrl1,
    rotated: true,
    active: true,
  },
  {
    slug: "to-werc20",
    title: "To SLPFord",
    description: "Lock ERC20 and Mint WERC20 (SLP)",
    iconUrl: iconUrl39,
    rotated: false,
    active: false,
  },
  {
    slug: "from-werc20",
    title: "From SLPFord",
    description: "Burn WERC20 (SLP) and Unlock ERC20",
    iconUrl: iconUrl39,
    rotated: true,
    active: false,
  },
  {
    slug: "cancel",
    title: "Cancel Trip",
    description: "Cancel the flight",
    iconUrl: iconUrl117,
    rotated: false,
    active: false,
  },
];

const Flights: React.FC = () => {
  return (
    <div className={classNames("w-full max-w-3xl mx-auto flex flex-wrap")}>
      {ALL_FLIGHTS.map(
        ({ slug, title, description, iconUrl, rotated, active }) => (
          <div key={slug} className="relative w-1/2 p-4 group">
            <Link
              to={`/flight/${slug}`}
              className={classNames(
                "border-2 border-dashed border-brand-indigo hover:border-brand-blue",
                "transition ease-in-out duration-300",
                "rounded-xl",
                "p-6",
                "flex items-center",
                !active && "pointer-events-none opacity-25"
              )}
            >
              <img
                src={iconUrl}
                alt={title}
                className={classNames(
                  "w-16 h-auto mr-4 group-hover:animate-pulse",
                  rotated && "transform rotate-180 -translate-y-2"
                )}
              />

              <div className="flex-1 flex flex-col items-center text-center">
                <h3
                  className={classNames(
                    "mb-2",
                    "text-brand-indigo",
                    "text-lg",
                    "font-bold",
                    "uppercase tracking-tight"
                  )}
                >
                  {title}
                </h3>

                <p
                  className={classNames(
                    "font-courier",
                    "text-base",
                    "text-brand-darkgray"
                  )}
                >
                  {description}
                </p>
              </div>
            </Link>

            {!active && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  className={classNames(
                    "text-brand-blue",
                    "text-xl",
                    "font-bold",
                    "uppercase tracking-tight",
                    "transform -rotate-20"
                  )}
                >
                  Coming soon
                </p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

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
