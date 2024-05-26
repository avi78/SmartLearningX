
type Props = {};


const LandingPage = async (props: Props) => {
  return (
    // bg-[url('/grid.svg')]
    <section className=" h-[500px] bg-[url('/grid.svg')]">
      <div className="mx-auto max-w-screen-xl z-30 px-4 pt-32 lg:flex  ">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Create your Lessons
            <strong className="font-extrabold text-primary sm:block">
              {" "}
              In Seconds Not in Hours{" "}
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed text-gray-500">
            Generate, publish and share your lesson right away with AI. Dive
            into insightful results, charts and analytics.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-purple-600 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
              href="#"
            >
              + Create AI Form
            </a>

            <a
              className="block w-full rounded px-12 py-3 text-sm font-medium text-primary shadow hover:text-purple-600 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      
    </section>
  );
}

export default LandingPage;