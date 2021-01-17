import classNames from "clsx";
import { Link } from "woozie";
import PageLayout from "app/components/layout/PageLayout";
import iconUrl1 from "app/misc/1.svg";
import iconUrl39 from "app/misc/39.svg";
import iconUrl117 from "app/misc/117.svg";

const Main: React.FC = () => (
  <PageLayout
    title="All flights"
    description={
      <>
        Stuck at home due to Covid?
        <br />
        Let your money cross the
        <br /> boards!
      </>
    }
  >
    <div className="py-8">
      <Flights />
    </div>
  </PageLayout>
);

export default Main;

const ALL_FLIGHTS = [
  {
    slug: "to-wslp",
    title: "To ERC20Burg",
    description: "Lock native SLP and Mint WSLP (ERC20)",
    iconUrl: iconUrl1,
    rotated: false,
    minHeight: "8.75rem",
    active: true,
  },
  {
    slug: "from-wslp",
    title: "From ERC20Burg",
    description: "Burn WSLP (ERC20) and Unlock native SLP",
    iconUrl: iconUrl1,
    rotated: true,
    minHeight: "8.75rem",
    active: true,
  },
  {
    slug: "to-werc20",
    title: "To SLPFord",
    description: "Lock ERC20 and Mint WERC20 (SLP)",
    iconUrl: iconUrl39,
    rotated: false,
    minHeight: "7.875rem",
    active: false,
  },
  {
    slug: "from-werc20",
    title: "From SLPFord",
    description: "Burn WERC20 (SLP) and Unlock ERC20",
    iconUrl: iconUrl39,
    rotated: true,
    minHeight: "7.875rem",
    active: false,
  },
  {
    slug: "cancel",
    title: "Cancel Trip",
    description: "Cancel the flight",
    iconUrl: iconUrl117,
    rotated: false,
    minHeight: "6rem",
    active: false,
  },
];

const Flights: React.FC = () => (
  <div className={classNames("w-full max-w-3xl mx-auto flex flex-wrap")}>
    {ALL_FLIGHTS.map(
      ({ slug, title, description, iconUrl, rotated, minHeight, active }) => (
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
            <div
              className={classNames(
                "mr-4 w-16 flex justify-center",
                active &&
                  (rotated
                    ? "group-hover:animate-bouncebottom"
                    : "group-hover:animate-bouncetop")
              )}
              style={{ minHeight }}
            >
              <img
                src={iconUrl}
                alt={title}
                className={classNames(
                  "w-16 h-auto",
                  rotated && "transform rotate-180 -translate-y-2"
                )}
              />
            </div>

            <div className="flex-1 flex flex-col items-center text-center">
              <h3
                className={classNames(
                  "mb-2",
                  "text-brand-indigo",
                  "text-lg",
                  "font-bold",
                  "uppercase tracking-tight",
                  "transition ease-in-out duration-300",
                  active && "group-hover:text-brand-blue"
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
                  "text-brand-darkgray opacity-75",
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
